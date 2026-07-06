#!/usr/bin/env node
/**
 * Concurrent multi-user isolation tests.
 * Simulates parallel sign-ups, saves, cross-access, and duplicate writes.
 */
import { execSync } from 'node:child_process'
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const USER_COUNT = Number(process.env.USER_COUNT ?? 12)
const TS = Date.now()

const { req, createJourney, getToken } = createApiClient(BASE)

const BOOKS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

/** @type {{ id: string; ok: boolean; detail: string }[]} */
const results = []

function record(id, ok, detail) {
  results.push({ id, ok, detail })
  console.log(`  ${ok ? '✓' : '✗'} [${id}] ${detail}`)
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

function savePayload(email, bookId, locale = 'zh') {
  return {
    bookId,
    locale,
    psychologyProfile: `PROFILE:${email}:${bookId}`,
    psychologyPromptInput: `prompt ${bookId}`,
    dimensions: [
      {
        dimensionIndex: 1,
        title: 't',
        averageScore: 1,
        level: 'mid',
        selectedCardIds: ['x'],
      },
    ],
    answers: { q1: ['a'] },
    attentionPassed: true,
    attentionFailures: [],
  }
}

async function testParallelSignUp() {
  console.log(`\n=== 1 · ${USER_COUNT} 用户并发注册 ===`)
  const emails = Array.from(
    { length: USER_COUNT },
    (_, i) => `concurrent-u${i}-${TS}@example.com`,
  )

  const creates = await Promise.all(
    emails.map((email, i) => createJourney(email, i % 2 === 0 ? 'zh' : 'en')),
  )

  const journeyIds = creates.map((c) => c.journeyId)
  const all201 = creates.every((c) => c.journeyId && c.accessToken)
  const uniqueJ = new Set(journeyIds).size === journeyIds.length
  record('P1', all201, `全部 201 (${creates.length} 用户)`)
  record('P2', uniqueJ, `journeyId 互不重复 (${uniqueJ ? journeyIds.length : 'dup'})`)

  const dupJourneyPerUser = sql(
    `SELECT COUNT(*) FROM (SELECT user_id FROM journeys GROUP BY user_id HAVING COUNT(*)>1)`,
  )
  record('P3', dupJourneyPerUser === '0', `每用户仅 1 个 journey (dup_users=${dupJourneyPerUser})`)

  return emails.map((email, i) => ({
    email,
    journeyId: journeyIds[i],
    bookId: BOOKS[i % BOOKS.length],
  }))
}

async function testParallelSave(users) {
  console.log('\n=== 2 · 并发保存不同卷 ===')
  const saves = await Promise.all(
    users.map(({ email, journeyId, bookId }) =>
      req('POST', `/api/journeys/${journeyId}/assessments`, {
        body: savePayload(email, bookId),
        journeyId,
      }),
    ),
  )

  const ok = saves.every((s) => s.status === 201)
  record('S1', ok, `并发保存全部 201 (${saves.filter((s) => s.status === 201).length}/${saves.length})`)

  for (const { email, bookId } of users) {
    const row = sql(
      `SELECT ba.book_id, ba.psychology_profile FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='${email}'`,
    )
    const expected = `PROFILE:${email}:${bookId}`
    if (!row.includes(expected)) {
      record('S2', false, `${email} 数据串扰: ${row}`)
      return users
    }
  }
  record('S2', true, '各用户 profile 与邮箱/卷一致，无串扰')

  const total = sql(`SELECT COUNT(*) FROM book_assessments`)
  record('S3', total === String(users.length), `DB 共 ${total} 条 assessment`)

  return users.map((u, i) => ({
    ...u,
    assessmentId: saves[i].data?.assessment?.id,
  }))
}

async function testCrossAccess(users) {
  console.log('\n=== 3 · 跨用户访问拦截 ===')
  const a = users[0]
  const b = users[1]

  const cross = await req('GET', `/api/assessments/${a.assessmentId}`, {
    accessToken: getToken(b.journeyId),
  })
  record('X1', cross.status === 404, `B 读 A 的 assessment → ${cross.status}`)

  const wrongHeader = await req('POST', `/api/journeys/${a.journeyId}/assessments`, {
    body: savePayload(a.email, 'emotional-flow'),
    accessToken: getToken(b.journeyId),
  })
  record('X2', wrongHeader.status === 401, `错 token 保存 → ${wrongHeader.status}`)

  const crossMyst = await req('POST', `/api/assessments/${a.assessmentId}/mystical-reading`, {
    body: { locale: 'zh' },
    accessToken: getToken(b.journeyId),
  })
  record('X3', crossMyst.status === 404, `B 触发 A 神谕 → ${crossMyst.status}`)
}

async function testDuplicateConcurrentSave(users) {
  console.log('\n=== 4 · 同卷并发重复保存 ===')
  const u = users[2]
  const freshBook =
    BOOKS.find((b) => b !== u.bookId) ?? 'direction-light'
  const attempts = await Promise.all(
    Array.from({ length: 8 }, () =>
      req('POST', `/api/journeys/${u.journeyId}/assessments`, {
        body: savePayload(u.email, freshBook),
        journeyId: u.journeyId,
      }),
    ),
  )

  const created = attempts.filter((a) => a.status === 201).length
  const rejected = attempts.filter((a) => a.status === 409).length
  const count = sql(
    `SELECT COUNT(*) FROM book_assessments WHERE journey_id='${u.journeyId}' AND book_id='${freshBook}'`,
  )
  record(
    'D1',
    created === 1 && rejected === 7 && count === '1',
    `201×${created} 409×${rejected} DB=${count} (${freshBook})`,
  )
}

async function testConcurrentResumeSameEmail() {
  console.log('\n=== 5 · 同邮箱并发续接 ===')
  const email = `concurrent-resume-${TS}@example.com`
  const parallel = await Promise.all(
    Array.from({ length: 10 }, () => createJourney(email, 'zh')),
  )

  const ids = parallel.map((p) => p.journeyId)
  const unique = new Set(ids).size
  record(
    'R1',
    unique === 1 && parallel.every((p) => p.accessToken),
    `10 次并发注册 → 1 个 journeyId (${ids[0]?.slice(0, 8)}…)`,
  )

  const journeyCount = sql(
    `SELECT COUNT(*) FROM journeys j JOIN users u ON u.id=j.user_id WHERE u.email='${email}'`,
  )
  record('R2', journeyCount === '1', `DB 仅 1 journey (count=${journeyCount})`)
}

async function testBearerJourneyLookup(users) {
  console.log('\n=== 6 · Bearer 查询隔离 ===')
  const checks = await Promise.all(
    users.slice(0, 5).map(async ({ email, journeyId, bookId }) => {
      const r = await req('GET', `/api/journeys/${journeyId}`, { journeyId })
      const expected = `PROFILE:${email}:${bookId}`
      return (
        r.status === 200 &&
        r.data.journeyId === journeyId &&
        r.data.assessments.some(
          (a) => a.bookId === bookId && a.psychologyProfile === expected,
        )
      )
    }),
  )
  record('E1', checks.every(Boolean), `5 用户 Bearer 查询各归各 (${checks.filter(Boolean).length}/5)`)
}

async function testParallelMystical(users) {
  console.log('\n=== 7 · 多用户并发生成神谕 ===')
  const batch = users.slice(0, 6).filter((u) => u.assessmentId)
  const readings = await Promise.all(
    batch.map((u) =>
      req('POST', `/api/assessments/${u.assessmentId}/mystical-reading`, {
        body: { locale: u.email.includes('u0') || u.email.includes('u2') ? 'zh' : 'en' },
        journeyId: u.journeyId,
      }),
    ),
  )

  const ok = readings.every((r) => r.status === 200 && r.data?.reading?.length > 0)
  record('M1', ok, `并行神谕 ${readings.filter((r) => r.status === 200).length}/${readings.length}`)

  for (const u of batch) {
    const loc = sql(
      `SELECT mystical_reading_locale FROM book_assessments WHERE id='${u.assessmentId}'`,
    )
    const profile = sql(
      `SELECT psychology_profile FROM book_assessments WHERE id='${u.assessmentId}'`,
    )
    if (!profile.includes(u.email)) {
      record('M2', false, `神谕后 profile 串扰 ${u.email}`)
      return
    }
    if (!loc) {
      record('M2', false, `缺少 mystical_reading_locale ${u.email}`)
      return
    }
  }
  record('M2', true, '神谕后各用户 profile/locale 仍正确')
}

async function main() {
  console.log('Multi-user concurrent isolation test')
  console.log('BASE:', BASE, 'USER_COUNT:', USER_COUNT)

  const users = await testParallelSignUp()
  const withIds = await testParallelSave(users)
  await testCrossAccess(withIds)
  await testDuplicateConcurrentSave(withIds)
  await testConcurrentResumeSameEmail()
  await testBearerJourneyLookup(withIds)
  await testParallelMystical(withIds)

  const failed = results.filter((r) => !r.ok)
  console.log('\n=== Summary ===')
  console.log(`Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`)

  if (failed.length) {
    for (const f of failed) console.log(`  FAIL [${f.id}] ${f.detail}`)
    process.exit(1)
  }

  console.log('\n✓ Multi-user concurrent tests passed')
  console.log('\nDB:', sql('SELECT COUNT(DISTINCT user_id), COUNT(*) FROM journeys'), 'users|journeys')
  console.log('DB:', sql('SELECT COUNT(*) FROM book_assessments'), 'assessments')
}

main().catch((err) => {
  console.error('\n✗', err.message)
  process.exit(1)
})
