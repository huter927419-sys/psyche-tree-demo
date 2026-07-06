#!/usr/bin/env node
/**
 * Verbose multi-user concurrent test with log file output.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const USER_COUNT = Number(process.env.USER_COUNT ?? 12)
const TS = Date.now()
const LOG_DIR = path.resolve(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, `concurrent-test-${TS}.log`)

const { req, createJourney, getToken } = createApiClient(BASE)

const lines = []
const results = []

function log(tag, msg, extra) {
  const line =
    extra !== undefined
      ? `[${new Date().toISOString()}] [${tag}] ${msg} ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`
      : `[${new Date().toISOString()}] [${tag}] ${msg}`
  lines.push(line)
  console.log(line)
}

function record(id, ok, detail) {
  results.push({ id, ok, detail })
  log(ok ? 'PASS' : 'FAIL', `[${id}] ${detail}`)
}

async function loggedReq(method, urlPath, { body, journeyId, accessToken, label } = {}) {
  const token = accessToken ?? (journeyId ? getToken(journeyId) : undefined)
  log('REQ', `${label ?? ''} ${method} ${urlPath}`, { auth: token ? 'Bearer ***' : '(none)' })

  const res = await req(method, urlPath, { body, journeyId, accessToken })
  log('RES', `${label ?? ''} HTTP ${res.status}`, res.data?.error ?? res.data?.journeyId ?? res.data?.assessment?.id ?? 'ok')
  return res
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

const BOOKS = ['psyche-tree', 'emotional-flow', 'mind-light', 'bond-thread', 'flow-balance', 'direction-light']

function savePayload(email, bookId) {
  return {
    bookId,
    locale: 'zh',
    psychologyProfile: `PROFILE:${email}:${bookId}`,
    psychologyPromptInput: `prompt ${bookId}`,
    dimensions: [{ dimensionIndex: 1, title: 't', averageScore: 1, level: 'mid', selectedCardIds: ['x'] }],
    answers: { q1: ['a'] },
    attentionPassed: true,
    attentionFailures: [],
  }
}

async function main() {
  fs.mkdirSync(LOG_DIR, { recursive: true })
  log('INFO', '=== 多用户并发测试 ===', { BASE, USER_COUNT, DB })

  const emails = Array.from({ length: USER_COUNT }, (_, i) => `conc-${i}-${TS}@example.com`)

  log('STEP', `1. ${USER_COUNT} 用户并发注册`)
  const creates = await Promise.all(
    emails.map((email, i) =>
      createJourney(email, i % 2 ? 'en' : 'zh').then((data) => {
        log('REQ', `reg-${i} POST /api/journeys`, { email })
        log('RES', `reg-${i} HTTP 201`, data.journeyId)
        return data
      }),
    ),
  )
  const users = emails.map((email, i) => ({
    email,
    journeyId: creates[i].journeyId,
    userId: creates[i].userId,
    bookId: BOOKS[i % BOOKS.length],
  }))

  record('P1', creates.every((c) => c.journeyId), `注册 ${creates.length}/${USER_COUNT}`)
  record(
    'P2',
    new Set(users.map((u) => u.journeyId)).size === users.length,
    'journeyId 唯一',
  )
  record(
    'P3',
    sql(`SELECT COUNT(*) FROM (SELECT user_id FROM journeys GROUP BY user_id HAVING COUNT(*)>1)`) === '0',
    '每用户 1 journey',
  )

  log('STEP', `2. ${USER_COUNT} 用户并发保存`)
  const saves = await Promise.all(
    users.map((u, i) =>
      loggedReq('POST', `/api/journeys/${u.journeyId}/assessments`, {
        body: savePayload(u.email, u.bookId),
        journeyId: u.journeyId,
        label: `save-${i}`,
      }),
    ),
  )
  record('S1', saves.every((s) => s.status === 201), `保存 ${saves.filter((s) => s.status === 201).length}/${USER_COUNT}`)

  let crossOk = true
  for (const u of users) {
    const row = sql(
      `SELECT psychology_profile FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users us ON us.id=j.user_id WHERE us.email='${u.email}'`,
    )
    if (!row.includes(u.email)) crossOk = false
  }
  record('S2', crossOk, 'profile 无串扰')

  const a = { ...users[0], assessmentId: saves[0].data?.assessment?.id }
  const b = users[1]

  log('STEP', '3. 跨用户访问（预期 404/401）')
  const x1 = await loggedReq('GET', `/api/assessments/${a.assessmentId}`, {
    accessToken: getToken(b.journeyId),
    label: 'B-read-A',
  })
  record('X1', x1.status === 404, `B读A → ${x1.status} (预期404)`)

  const x2 = await loggedReq('POST', `/api/journeys/${a.journeyId}/assessments`, {
    body: savePayload(a.email, 'emotional-flow'),
    accessToken: getToken(b.journeyId),
    label: 'wrong-token',
  })
  record('X2', x2.status === 401, `错token → ${x2.status} (预期401)`)

  log('STEP', '4. 同卷 8 路并发重复保存')
  const u2 = users[2]
  const freshBook = BOOKS.find((b) => b !== u2.bookId) ?? 'direction-light'
  const dups = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      loggedReq('POST', `/api/journeys/${u2.journeyId}/assessments`, {
        body: savePayload(u2.email, freshBook),
        journeyId: u2.journeyId,
        label: `dup-${i}`,
      }),
    ),
  )
  const c201 = dups.filter((d) => d.status === 201).length
  const c409 = dups.filter((d) => d.status === 409).length
  record('D1', c201 === 1 && c409 === 7, `201×${c201} 409×${c409}`)

  log('STEP', '5. 同邮箱 10 路并发续接')
  const resumeEmail = `resume-${TS}@example.com`
  const resumes = await Promise.all(
    Array.from({ length: 10 }, () => createJourney(resumeEmail, 'zh')),
  )
  record('R1', new Set(resumes.map((r) => r.journeyId)).size === 1, '10并发→1 journeyId')

  const failed = results.filter((r) => !r.ok)
  log('SUMMARY', `Total ${results.length} Passed ${results.length - failed.length} Failed ${failed.length}`)
  log('DB', sql('SELECT COUNT(*) FROM users') + ' users, ' + sql('SELECT COUNT(*) FROM journeys') + ' journeys, ' + sql('SELECT COUNT(*) FROM book_assessments') + ' assessments')

  fs.writeFileSync(LOG_FILE, lines.join('\n') + '\n')
  console.log(`\n📄 日志: ${LOG_FILE}`)

  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
