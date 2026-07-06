#!/usr/bin/env node
/**
 * Verbose API log for cross-user scenarios (Bearer token auth).
 * Output: console + logs/cross-access-debug.log
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const TS = Date.now()
const LOG_DIR = path.resolve(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, `cross-access-debug-${TS}.log`)

const { req, setToken } = createApiClient(BASE)
const lines = []

function log(section, msg, extra) {
  const row =
    extra !== undefined
      ? `${msg} ${typeof extra === 'string' ? extra : JSON.stringify(extra, null, 2)}`
      : msg
  const line = `[${new Date().toISOString()}] [${section}] ${row}`
  lines.push(line)
  console.log(line)
}

async function loggedReq(method, urlPath, { body, journeyId, accessToken, label } = {}) {
  log('REQUEST', `${label ?? ''} ${method} ${urlPath}`, {
    auth: accessToken ? 'Bearer ***' : journeyId ? 'journey token' : '(none)',
    body: body ?? null,
  })
  const res = await req(method, urlPath, { body, journeyId, accessToken })
  log('RESPONSE', `${label ?? ''} HTTP ${res.status}`, res.data)
  return res
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

async function main() {
  fs.mkdirSync(LOG_DIR, { recursive: true })

  log('INFO', '=== 跨用户访问诊断（Bearer token）===')
  log('INFO', `BASE=${BASE}`)
  log('INFO', `DB=${DB}`)

  const emailA = `log-user-a-${TS}@example.com`
  const emailB = `log-user-b-${TS}@example.com`

  const createA = await loggedReq('POST', '/api/journeys', {
    body: { email: emailA, locale: 'zh' },
    label: 'A-register',
  })
  const createB = await loggedReq('POST', '/api/journeys', {
    body: { email: emailB, locale: 'zh' },
    label: 'B-register',
  })

  const journeyA = createA.data.journeyId
  const journeyB = createB.data.journeyId
  const tokenA = createA.data.accessToken
  const tokenB = createB.data.accessToken
  setToken(journeyA, tokenA)
  setToken(journeyB, tokenB)

  log('DB', 'journey A', sql(`SELECT id, user_id FROM journeys WHERE id='${journeyA}'`))
  log('DB', 'journey B', sql(`SELECT id, user_id FROM journeys WHERE id='${journeyB}'`))

  const saveA = await loggedReq('POST', `/api/journeys/${journeyA}/assessments`, {
    body: {
      bookId: 'psyche-tree',
      locale: 'zh',
      psychologyProfile: `PROFILE-A-${TS}`,
      psychologyPromptInput: 'prompt A',
      dimensions: [
        { dimensionIndex: 1, title: 't', averageScore: 1, level: 'mid', selectedCardIds: ['x'] },
      ],
      answers: { q1: ['a'] },
      attentionPassed: true,
      attentionFailures: [],
    },
    journeyId: journeyA,
    label: 'A-save',
  })

  const assessmentA = saveA.data?.assessment?.id

  await loggedReq('GET', `/api/assessments/${assessmentA}`, {
    journeyId: journeyA,
    label: 'A-read-own (expect 200)',
  })

  await loggedReq('GET', `/api/assessments/${assessmentA}`, {
    accessToken: tokenB,
    label: 'B-read-A-cross (expect 404)',
  })

  await loggedReq('POST', `/api/assessments/${assessmentA}/mystical-reading`, {
    body: { locale: 'zh' },
    accessToken: tokenB,
    label: 'B-mystical-A-cross (expect 404)',
  })

  await loggedReq('POST', `/api/journeys/${journeyA}/assessments`, {
    body: {
      bookId: 'emotional-flow',
      locale: 'zh',
      psychologyProfile: 'hack',
      psychologyPromptInput: 'x',
      dimensions: [
        { dimensionIndex: 1, title: 't', averageScore: 1, level: 'mid', selectedCardIds: ['x'] },
      ],
      answers: { q1: ['a'] },
      attentionPassed: true,
      attentionFailures: [],
    },
    accessToken: tokenB,
    label: 'B-save-on-A-journey-wrong-token (expect 401)',
  })

  await loggedReq('GET', '/api/journeys/00000000-0000-0000-0000-000000000000', {
    label: 'invalid-journey no auth (expect 401)',
  })

  await loggedReq('GET', '/api/assessments/00000000-0000-0000-0000-000000000000', {
    journeyId: journeyA,
    label: 'invalid-assessment (expect 404)',
  })

  log('SUMMARY', '预期结果', {
    'A-read-own': '200',
    'B-read-A-cross': '404',
    'B-mystical-A-cross': '404',
    'B-wrong-token-on-A-journey': '401',
    'no-auth': '401',
  })

  fs.writeFileSync(LOG_FILE, lines.join('\n') + '\n', 'utf8')
  console.log(`\n📄 完整日志已写入: ${LOG_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
