#!/usr/bin/env node
/**
 * End-to-end API + DB verification for psyche-tree-demo.
 * Run while `npm run dev` is up on BASE_URL (default http://localhost:5173).
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'

async function req(method, path, { headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  return { status: res.status, data }
}

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

  const create = await req('POST', '/api/journeys', {
    body: { email, locale },
  })
  assert(create.status === 201, `create journey: ${create.status} ${JSON.stringify(create.data)}`)
  const journeyId = create.data.journeyId
  console.log('  journeyId:', journeyId)

  const dup = await req('POST', '/api/journeys', {
    body: { email, locale },
  })
  assert(dup.status === 201 && dup.data.journeyId === journeyId, 'resume same journey by email')

  const byEmail = await req('GET', `/api/journeys?email=${encodeURIComponent(email)}`)
  assert(byEmail.status === 200, `get by email: ${byEmail.status}`)
  assert(byEmail.data.journeyId === journeyId, 'email lookup journey id mismatch')

  const save = await req('POST', `/api/journeys/${journeyId}/assessments`, {
    headers: { 'X-Journey-Id': journeyId },
    body: { ...psychePayload, locale },
  })
  assert(save.status === 201, `save assessment: ${save.status} ${JSON.stringify(save.data)}`)
  const assessmentId = save.data.assessment.id
  assert(save.data.assessment.answers, 'assessment dto missing answers')
  assert(
    save.data.assessment.answers['psyche-boundary']?.[0],
    'answers not returned in dto',
  )
  console.log('  assessmentId:', assessmentId)

  const dupSave = await req('POST', `/api/journeys/${journeyId}/assessments`, {
    headers: { 'X-Journey-Id': journeyId },
    body: { ...psychePayload, locale },
  })
  assert(dupSave.status === 409, `duplicate save should 409, got ${dupSave.status}`)

  const journey = await req('GET', `/api/journeys/${journeyId}`)
  assert(journey.status === 200, `get journey: ${journey.status}`)
  assert(journey.data.assessments.length === 1, 'expected 1 assessment')
  const stored = journey.data.assessments[0]
  assert(stored.bookId === 'psyche-tree', 'bookId mismatch')
  assert(stored.psychologyProfile.includes('测试') || locale === 'en', 'profile stored')
  assert(stored.answers['psyche-root']?.length === 1, 'answers_json round-trip failed')
  console.log('  stored answers keys:', Object.keys(stored.answers).length)

  const getOne = await req('GET', `/api/assessments/${assessmentId}`, {
    headers: { 'X-Journey-Id': journeyId },
  })
  assert(getOne.status === 200, `get assessment: ${getOne.status}`)

  const holistic = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    headers: { 'X-Journey-Id': journeyId },
  })
  assert(
    holistic.status === 409 || holistic.status === 202 || holistic.status === 200,
    `holistic before complete: ${holistic.status}`,
  )

  return { journeyId, assessmentId, email }
}

async function main() {
  const ts = Date.now()
  const results = []

  results.push(
    await runLocale('Chinese flow', 'zh', `qa-zh-${ts}@example.com`),
  )
  results.push(
    await runLocale('English flow', 'en', `qa-en-${ts}@example.com`),
  )

  console.log('\n=== SQLite spot check ===')
  const { execSync } = await import('node:child_process')
  for (const r of results) {
    const out = execSync(
      `sqlite3 /Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite "SELECT book_id, locale, length(answers_json), mystical_reading_status FROM book_assessments WHERE journey_id='${r.journeyId}';"`,
      { encoding: 'utf8' },
    )
    console.log(`  ${r.email}:`, out.trim() || '(no rows)')
  }

  console.log('\n✓ All API + DB checks passed')
}

main().catch((err) => {
  console.error('\n✗', err.message)
  process.exit(1)
})
