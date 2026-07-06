#!/usr/bin/env node
/**
 * Complete a user's 6-book journey + multi-user isolation checks.
 * Usage: node scripts/complete-user-journey.mjs [email]
 */
import { execSync } from 'node:child_process'
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const PRIMARY_EMAIL = process.argv[2] ?? `qa-complete-${Date.now()}@example.com`
const SWITCH_EMAIL = process.argv[3] ?? `qa-switch-${Date.now()}@example.com`

const { req, createJourney, getToken } = createApiClient(BASE)

const BOOKS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

/** Realistic card picks per book (questionId → [cardId]) */
const BOOK_ANSWERS = {
  'psyche-tree': {
    'psyche-boundary': ['warm-hands'],
    'psyche-wave': ['still-lake'],
    'psyche-still': ['psyche-still-lake'],
    'attention-check': ['star-explorer'],
    'psyche-mirror': ['psyche-mirror-lake'],
    'psyche-guard': ['psyche-guard-tree'],
    'psyche-root': ['deep-root-tree'],
    'psyche-whole': ['psyche-whole-lake'],
  },
  'emotional-flow': {
    'flow-overall': ['ef-calm-lake'],
    'flow-expression': ['ef-soft-candle'],
    'flow-connection': ['ef-warm-hands'],
    'attention-check': ['ef-warm-hands'],
    'flow-body': ['ef-steady-river'],
    'flow-recovery': ['ef-still-mirror'],
    'flow-change': ['ef-seed'],
    'flow-whole': ['ef-whole-lake'],
  },
  'mind-light': {
    'mind-flow': ['ml-steady-river'],
    'mind-learn': ['ml-seeking'],
    'mind-focus': ['ml-still-lake'],
    'attention-check': ['ml-still-lake'],
    'mind-analyze': ['ml-steady-path'],
    'mind-create': ['ml-bloom'],
    'mind-decide': ['ml-mountain'],
    'mind-whole': ['ml-whole-star'],
  },
  'bond-thread': {
    'bond-near': ['bt-warm'],
    'bond-warm': ['bt-resonance'],
    'bond-distance': ['bt-stars2'],
    'attention-check': ['bt-stars2'],
    'bond-trust': ['bt-bridge'],
    'bond-guard': ['bt-mountain2'],
    'bond-repair': ['bt-seed'],
    'bond-whole': ['bt-whole-silk'],
  },
  'flow-balance': {
    'balance-split': ['fb-balance'],
    'balance-source': ['fb-mountain'],
    'balance-mist': ['fb-steady-path'],
    'attention-check': ['fb-star'],
    'balance-pace': ['fb-steady-river'],
    'balance-turn': ['fb-bloom'],
    'balance-boat': ['fb-mountain3'],
    'balance-whole': ['fb-whole-boat'],
  },
  'direction-light': {
    'dir-light': ['dl-deep-root'],
    'dir-meaning': ['dl-resonance'],
    'dir-step': ['dl-steady-path'],
    'attention-check': ['dl-star'],
    'dir-resonance': ['dl-resonance2'],
    'dir-vow': ['dl-mountain'],
    'dir-probe': ['dl-star2'],
    'dir-whole': ['dl-whole-star'],
  },
}

const BOOK_LABELS = {
  'psyche-tree': '心象之树',
  'emotional-flow': '情流',
  'mind-light': '心光',
  'bond-thread': '缘线',
  'flow-balance': '流衡',
  'direction-light': '向光',
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

function buildPayload(bookId, locale) {
  const answers = BOOK_ANSWERS[bookId]
  const label = BOOK_LABELS[bookId] ?? bookId
  return {
    bookId,
    locale,
    psychologyProfile: `【${label}】lanegg110 实测画像 — 雾中自照之一页。`,
    psychologyPromptInput: `[${label}] 用户完成 ${Object.keys(answers).length} 题，attention 通过。`,
    dimensions: Object.keys(answers)
      .filter((k) => k !== 'attention-check')
      .slice(0, 3)
      .map((id, i) => ({
        dimensionIndex: i + 1,
        title: id,
        averageScore: 1,
        level: 'mid-high',
        selectedCardIds: answers[id],
      })),
    answers,
    attentionPassed: true,
    attentionFailures: [],
  }
}

async function resumeJourney(email, locale = 'zh') {
  const data = await createJourney(email, locale)
  return data.journeyId
}

async function completeSixBooks(email) {
  console.log(`\n━━━ 六卷完成：${email} ━━━`)
  const journeyId = await resumeJourney(email)
  console.log('journeyId:', journeyId)

  const before = sql(
    `SELECT COUNT(*) FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='${email}'`,
  )
  console.log('保存前 assessment 数:', before)

  const assessmentIds = []
  for (const bookId of BOOKS) {
    const existing = sql(
      `SELECT id FROM book_assessments WHERE journey_id='${journeyId}' AND book_id='${bookId}'`,
    )
    if (existing) {
      console.log(`  跳过 ${bookId}（已存在 ${existing.slice(0, 8)}…）`)
      assessmentIds.push(existing)
      continue
    }

    const save = await req('POST', `/api/journeys/${journeyId}/assessments`, {
      body: buildPayload(bookId, 'zh'),
      journeyId,
    })
    if (save.status !== 201) {
      throw new Error(`${bookId} save failed: ${save.status} ${JSON.stringify(save.data)}`)
    }
    const aid = save.data.assessment.id
    assessmentIds.push(aid)
    console.log(`  ✓ ${bookId} → ${aid.slice(0, 8)}… (journey ${save.data.journeyStatus})`)
  }

  console.log('\n生成单卷神谕…')
  for (const aid of assessmentIds) {
    const m = await req('POST', `/api/assessments/${aid}/mystical-reading`, { journeyId })
    const len = m.data?.reading?.length ?? 0
    console.log(`  ${aid.slice(0, 8)}… mystical ${m.status} len=${len}`)
  }

  const statusMid = sql(`SELECT status FROM journeys WHERE id='${journeyId}'`)
  console.log('\njourney status:', statusMid)

  console.log('\n生成整象神谕…')
  const hol = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, { journeyId })
  console.log(
    `  holistic ${hol.status} source=${hol.data?.source} len=${hol.data?.reading?.length ?? 0}`,
  )

  return journeyId
}

function printDbReport(email) {
  console.log('\n━━━ SQLite 核对 ━━━')
  console.log(
    sql(
      `SELECT 'user' as t, u.email, j.id, j.status, j.holistic_reading_status, '' as book, '' as myst FROM users u JOIN journeys j ON j.user_id=u.id WHERE u.email='${email}'`,
    ),
  )
  const rows = sql(
    `SELECT ba.book_id, ba.locale, length(ba.answers_json), ba.mystical_reading_status, length(ba.mystical_reading), substr(ba.psychology_profile,1,30) FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='${email}' ORDER BY ba.created_at`,
  )
  console.log('book_id|locale|ans_len|myst_status|myst_len|profile_prefix')
  console.log(rows || '(无 assessment)')

  const hol = sql(
    `SELECT j.status, j.holistic_reading_status, j.holistic_reading_source, length(j.holistic_reading), substr(j.holistic_reading,1,80) FROM journeys j JOIN users u ON u.id=j.user_id WHERE u.email='${email}'`,
  )
  console.log('\n整象:', hol)
}

async function multiUserSwitchTest(primaryEmail, switchEmail) {
  console.log(`\n━━━ 多用户切换隔离测试 ━━━`)
  console.log('用户 A:', primaryEmail)
  console.log('用户 B:', switchEmail)

  const journeyA = await resumeJourney(primaryEmail)
  const journeyB = await resumeJourney(switchEmail)

  record('M1', journeyA !== journeyB, 'A/B 不同 journeyId', `${journeyA.slice(0, 8)} vs ${journeyB.slice(0, 8)}`)

  const countA = sql(`SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyA}'`)
  const countB = sql(`SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyB}'`)
  record('M2', countA === '6' && countB === '0', 'A 有 6 卷 / B 为空', `A=${countA} B=${countB}`)

  // B 完成 1 卷
  const saveB = await req('POST', `/api/journeys/${journeyB}/assessments`, {
    body: buildPayload('psyche-tree', 'zh'),
    journeyId: journeyB,
  })
  record('M3', saveB.status === 201, 'B 保存第 1 卷', `status=${saveB.status}`)

  const countA2 = sql(`SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyA}'`)
  const countB2 = sql(`SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyB}'`)
  record('M4', countA2 === '6' && countB2 === '1', 'B 增 1 卷不影响 A', `A=${countA2} B=${countB2}`)

  // A 续接仍同一 journey
  const resumeA2 = await resumeJourney(primaryEmail)
  record('M5', resumeA2 === journeyA, 'A 重新登录续同一 journey', resumeA2 === journeyA ? 'match' : 'MISMATCH')

  // B 续接仍同一 journey
  const resumeB2 = await resumeJourney(switchEmail)
  record('M6', resumeB2 === journeyB, 'B 重新登录续同一 journey', resumeB2 === journeyB ? 'match' : 'MISMATCH')

  // Bearer 查询各自 journey
  const getA = await req('GET', `/api/journeys/${journeyA}`, { journeyId: journeyA })
  const getB = await req('GET', `/api/journeys/${journeyB}`, { journeyId: journeyB })
  record(
    'M7',
    getA.data?.journeyId === journeyA && getB.data?.journeyId === journeyB,
    'Bearer 查询互不串 journey',
    `A books=${getA.data?.assessments?.length} B books=${getB.data?.assessments?.length}`,
  )

  // 跨 journey 访问 assessment → 应 404
  const aidA = sql(`SELECT id FROM book_assessments WHERE journey_id='${journeyA}' LIMIT 1`)
  const cross = await req('GET', `/api/assessments/${aidA}`, {
    accessToken: getToken(journeyB),
  })
  record(
    'M8',
    cross.status === 404 || cross.data?.error,
    'B 的 header 无法读取 A 的 assessment',
    `status=${cross.status}`,
  )

  // 同一 journey header 可读
  const own = await req('GET', `/api/assessments/${aidA}`, { journeyId: journeyA })
  record('M9', own.status === 200, 'A 可读自己的 assessment', `status=${own.status}`)

  // 模拟 localStorage 切换：两用户 assessment book_id 集合无交集污染
  const booksA = sql(
    `SELECT group_concat(book_id) FROM book_assessments WHERE journey_id='${journeyA}'`,
  )
  const booksB = sql(
    `SELECT group_concat(book_id) FROM book_assessments WHERE journey_id='${journeyB}'`,
  )
  record(
    'M10',
    booksA.split(',').length === 6 && booksB === 'psyche-tree',
    '各用户 book 集合独立',
    `A=[${booksA}] B=[${booksB}]`,
  )

  console.log('\n多用户测试汇总:')
  for (const r of multiResults) {
    console.log(`  ${r.ok ? '✓' : '✗'} [${r.id}] ${r.name} — ${r.detail}`)
  }
  const failed = multiResults.filter((r) => !r.ok)
  if (failed.length) throw new Error(`${failed.length} multi-user checks failed`)
}

const multiResults = []
function record(id, ok, name, detail) {
  multiResults.push({ id, ok, name, detail })
}

async function main() {
  console.log('Complete user journey + multi-user isolation')
  console.log('BASE:', BASE)

  await completeSixBooks(PRIMARY_EMAIL)
  printDbReport(PRIMARY_EMAIL)

  await multiUserSwitchTest(PRIMARY_EMAIL, SWITCH_EMAIL)

  console.log('\n✓ 全部完成')
}

main().catch((err) => {
  console.error('\n✗', err.message)
  process.exit(1)
})
