#!/usr/bin/env node
/**
 * End-to-end API + DB verification for psyche-tree-demo.
 * Run while `npm run dev` is up on BASE_URL (default http://localhost:5173).
 */
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const { req, createJourney, getToken } = createApiClient(BASE)

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const psycheAnswers = {
  'psyche-boundary': ['card-boundary-stone'],
  'psyche-wave': ['card-still-lake'],
  'psyche-still': ['card-soft-candle'],
  'psyche-mirror': ['card-still-lake'],
  'psyche-guard': ['card-guardian-tree'],
  'psyche-root': ['card-deep-root-tree'],
  'psyche-whole': ['card-still-lake'],
}

const psychePayload = {
  bookId: 'psyche-tree',
  locale: 'zh',
  psychologyProfile: '测试心象画像',
  psychologyPromptInput: '测试 prompt input',
  dimensions: [
    {
      dimensionIndex: 1,
      title: '界石',
      averageScore: 1,
      level: 'mid-high',
      selectedCardIds: ['card-boundary-stone'],
    },
  ],
  answers: psycheAnswers,
  attentionPassed: true,
  attentionFailures: [],
}

async function runLocale(label, locale, email) {
  console.log(`\n=== ${label} (${locale}) ===`)

  const created = await createJourney(email, locale)
  const journeyId = created.journeyId
  console.log('  journeyId:', journeyId)
  assert(created.accessToken?.startsWith('psk_'), 'missing accessToken')

  const dup = await createJourney(email, locale, created.accessToken)
  assert(dup.journeyId === journeyId, 'resume same journey by email+token')

  const deprecated = await req('GET', `/api/journeys?email=${encodeURIComponent(email)}`)
  assert(deprecated.status === 410, `GET by email disabled: ${deprecated.status}`)

  const save = await req('POST', `/api/journeys/${journeyId}/assessments`, {
    journeyId,
    body: { ...psychePayload, locale },
  })
  assert(save.status === 201, `save assessment: ${save.status} ${JSON.stringify(save.data)}`)
  const assessmentId = save.data.assessment.id
  console.log('  assessmentId:', assessmentId)

  const dupSave = await req('POST', `/api/journeys/${journeyId}/assessments`, {
    journeyId,
    body: { ...psychePayload, locale },
  })
  assert(dupSave.status === 409, `duplicate save should 409, got ${dupSave.status}`)

  const journey = await req('GET', `/api/journeys/${journeyId}`, { journeyId })
  assert(journey.status === 200, `get journey: ${journey.status}`)
  assert(journey.data.assessments.length === 1, 'expected 1 assessment')

  const getOne = await req('GET', `/api/assessments/${assessmentId}`, { journeyId })
  assert(getOne.status === 200, `get assessment: ${getOne.status}`)

  const noAuth = await req('GET', `/api/journeys/${journeyId}`)
  assert(noAuth.status === 401, `unauthenticated get should 401, got ${noAuth.status}`)

  const holistic = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    journeyId,
  })
  assert(
    holistic.status === 409 || holistic.status === 202 || holistic.status === 200,
    `holistic before complete: ${holistic.status}`,
  )

  return { journeyId, assessmentId, email, accessToken: getToken(journeyId) }
}

async function main() {
  const ts = Date.now()
  await runLocale('简体中文', 'zh', `e2e-zh-${ts}@example.com`)
  await runLocale('English', 'en', `e2e-en-${ts}@example.com`)
  console.log('\n✓ E2E API checks passed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
