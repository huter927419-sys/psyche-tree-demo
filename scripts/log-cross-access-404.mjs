#!/usr/bin/env node
/**
 * Verbose API log for 404 cross-user scenarios (expected security behavior).
 * Output: console + logs/cross-access-debug.log
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const TS = Date.now()
const LOG_DIR = path.resolve(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, `cross-access-debug-${TS}.log`)

const lines = []

function log(section, msg, extra) {
  const row = extra !== undefined ? `${msg} ${typeof extra === 'string' ? extra : JSON.stringify(extra, null, 2)}` : msg
  const line = `[${new Date().toISOString()}] [${section}] ${row}`
  lines.push(line)
  console.log(line)
}

async function req(method, urlPath, { body, journeyId, label } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (journeyId) headers['X-Journey-Id'] = journeyId

  log('REQUEST', `${label ?? ''} ${method} ${urlPath}`, {
    headers: { ...headers, 'X-Journey-Id': journeyId ?? '(none)' },
    body: body ?? null,
  })

  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  log('RESPONSE', `${label ?? ''} HTTP ${res.status}`, data)

  return { status: res.status, data }
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

async function main() {
  fs.mkdirSync(LOG_DIR, { recursive: true })

  log('INFO', '=== 404 跨用户访问诊断（预期为安全拦截，不是 bug）===')
  log('INFO', `BASE=${BASE}`)
  log('INFO', `DB=${DB}`)

  const emailA = `log-user-a-${TS}@example.com`
  const emailB = `log-user-b-${TS}@example.com`

  log('STEP', '--- 1. 创建用户 A、B ---')
  const createA = await req('POST', '/api/journeys', {
    body: { email: emailA, locale: 'zh' },
    label: 'A-register',
  })
  const createB = await req('POST', '/api/journeys', {
    body: { email: emailB, locale: 'zh' },
    label: 'B-register',
  })

  const journeyA = createA.data.journeyId
  const journeyB = createB.data.journeyId
  const userIdA = createA.data.userId
  const userIdB = createB.data.userId

  log('DB', '用户 A', sql(`SELECT id, email FROM users WHERE email='${emailA}'`))
  log('DB', '用户 B', sql(`SELECT id, email FROM users WHERE email='${emailB}'`))
  log('DB', 'journey A', sql(`SELECT id, user_id, locale FROM journeys WHERE id='${journeyA}'`))
  log('DB', 'journey B', sql(`SELECT id, user_id, locale FROM journeys WHERE id='${journeyB}'`))

  log('STEP', '--- 2. A 保存一卷答题 ---')
  const saveA = await req('POST', `/api/journeys/${journeyA}/assessments`, {
    body: {
      bookId: 'psyche-tree',
      locale: 'zh',
      psychologyProfile: `PROFILE-A-${TS}`,
      psychologyPromptInput: 'prompt A',
      dimensions: [{ dimensionIndex: 1, title: 't', averageScore: 1, level: 'mid', selectedCardIds: ['x'] }],
      answers: { q1: ['a'] },
      attentionPassed: true,
      attentionFailures: [],
    },
    journeyId: journeyA,
    label: 'A-save',
  })

  const assessmentA = saveA.data?.assessment?.id
  log('DB', 'A 的 assessment', sql(
    `SELECT id, journey_id, book_id, substr(psychology_profile,1,40) FROM book_assessments WHERE id='${assessmentA}'`,
  ))

  log('STEP', '--- 3. 正常访问：A 用自己的 header 读 assessment（应 200）---')
  await req('GET', `/api/assessments/${assessmentA}`, {
    journeyId: journeyA,
    label: 'A-read-own',
  })

  log('STEP', '--- 4. 【预期 404】B 用 B 的 journeyId 读 A 的 assessment ---')
  log('WHY', 'assertAssessmentBelongsToJourney: assessment.journey_id !== X-Journey-Id → ASSESSMENT_NOT_FOUND → 404')
  await req('GET', `/api/assessments/${assessmentA}`, {
    journeyId: journeyB,
    label: 'B-read-A-cross',
  })

  log('STEP', '--- 5. 【预期 404】B 用 B 的 header 触发 A 的神谕 ---')
  await req('POST', `/api/assessments/${assessmentA}/mystical-reading`, {
    body: { locale: 'zh' },
    journeyId: journeyB,
    label: 'B-mystical-A-cross',
  })

  log('STEP', '--- 6. 【预期 401】URL 是 A 的 journey，header 却是 B 的 journeyId ---')
  log('WHY', 'handleSaveAssessment: x-journey-id !== path journeyId → MISSING_JOURNEY_HEADER → 401')
  await req('POST', `/api/journeys/${journeyA}/assessments`, {
    body: {
      bookId: 'emotional-flow',
      locale: 'zh',
      psychologyProfile: 'hack',
      psychologyPromptInput: 'x',
      dimensions: [{ dimensionIndex: 1, title: 't', averageScore: 1, level: 'mid', selectedCardIds: ['x'] }],
      answers: { q1: ['a'] },
      attentionPassed: true,
      attentionFailures: [],
    },
    journeyId: journeyB,
    label: 'B-save-on-A-journey-wrong-header',
  })

  log('STEP', '--- 7. 【预期 404】不存在的 journeyId ---')
  await req('GET', '/api/journeys/00000000-0000-0000-0000-000000000000', {
    label: 'invalid-journey',
  })

  log('STEP', '--- 8. 【预期 404】不存在的 assessmentId ---')
  await req('GET', '/api/assessments/00000000-0000-0000-0000-000000000000', {
    journeyId: journeyA,
    label: 'invalid-assessment',
  })

  log('SUMMARY', '测试里的 404 含义', {
    'X1 B读A的assessment': '预期 404 — 防止用户 B 看到用户 A 的答题',
    'X3 B触发A神谕': '预期 404 — 同上，神谕接口也校验归属',
    'X2 错header': '预期 401 — header 与 URL journey 不一致',
    '正常 A读自己': '预期 200',
  })

  log('SUMMARY', '用户标识', { userIdA, userIdB, journeyA, journeyB, assessmentA })

  fs.writeFileSync(LOG_FILE, lines.join('\n') + '\n', 'utf8')
  console.log(`\n📄 完整日志已写入: ${LOG_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
