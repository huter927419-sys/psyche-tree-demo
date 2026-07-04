#!/usr/bin/env node
/**
 * Multi-language switching tests after DB reset.
 * Requires npm run dev on BASE_URL.
 */
import { execSync } from 'node:child_process'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const TS = Date.now()

/** @type {{ id: string; ok: boolean; detail: string }[]} */
const results = []

function record(id, ok, detail) {
  results.push({ id, ok, detail })
  console.log(`  ${ok ? '✓' : '✗'} [${id}] ${detail}`)
}

async function req(method, path, { body, journeyId } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (journeyId) headers['X-Journey-Id'] = journeyId
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  return { status: res.status, data }
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q}"`, { encoding: 'utf8' }).trim()
}

function looksChinese(text) {
  return /[\u4e00-\u9fff]/.test(text ?? '')
}

function looksEnglish(text) {
  const t = text ?? ''
  return t.length > 40 && !/[\u4e00-\u9fff]/.test(t)
}

function looksJapanese(text) {
  const t = text ?? ''
  return t.length > 20 && /[\u3040-\u309f\u30a0-\u30ff]/.test(t)
}

const psycheAnswers = {
  'psyche-boundary': ['warm-hands'],
  'psyche-wave': ['still-lake'],
  'psyche-still': ['psyche-still-lake'],
  'attention-check': ['star-explorer'],
  'psyche-mirror': ['psyche-mirror-lake'],
  'psyche-guard': ['psyche-guard-tree'],
  'psyche-root': ['deep-root-tree'],
  'psyche-whole': ['psyche-whole-lake'],
}

function assessmentPayload(locale) {
  return {
    bookId: 'psyche-tree',
    locale,
    psychologyProfile: locale === 'en' ? 'Mindscape profile EN' : '心象画像 中文',
    psychologyPromptInput: locale === 'en' ? 'prompt EN' : 'prompt 中文',
    dimensions: [
      {
        dimensionIndex: 1,
        title: 'test',
        averageScore: 1,
        level: 'mid',
        selectedCardIds: ['warm-hands'],
      },
    ],
    answers: psycheAnswers,
    attentionPassed: true,
    attentionFailures: [],
  }
}

const BOOKS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

async function saveBook(journeyId, bookId, locale) {
  return req('POST', `/api/journeys/${journeyId}/assessments`, {
    body: {
      bookId,
      locale,
      psychologyProfile: `${bookId} ${locale}`,
      psychologyPromptInput: `input ${bookId} ${locale}`,
      dimensions: [
        {
          dimensionIndex: 1,
          title: 't',
          averageScore: 1,
          level: 'mid',
          selectedCardIds: ['x'],
        },
      ],
      answers: bookId === 'psyche-tree' ? psycheAnswers : { q1: ['a'] },
      attentionPassed: true,
      attentionFailures: [],
    },
    journeyId,
  })
}

async function testMysticalLocaleSwitch() {
  console.log('\n=== 1 · 单卷神谕语言切换 ===')
  const email = `locale-myst-${TS}@example.com`

  const create = await req('POST', '/api/journeys', {
    body: { email, locale: 'en' },
  })
  const journeyId = create.data.journeyId

  const save = await saveBook(journeyId, 'psyche-tree', 'en')
  const aid = save.data.assessment.id

  const en = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'en' },
    journeyId,
  })
  record(
    'M1',
    en.status === 200 &&
      looksEnglish(en.data.reading) &&
      looksChinese(en.data.readingZh) &&
      looksJapanese(en.data.readingJa),
    `EN 神谕生成，三语并行 (${en.data.reading?.slice(0, 40)}…)`,
  )

  const zh = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'M2',
    zh.status === 200 && looksChinese(zh.data.reading) && zh.data.source === 'cached',
    `切中文命中缓存 (${zh.data.reading?.slice(0, 30)}…)`,
  )

  const enAgain = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'en' },
    journeyId,
  })
  record(
    'M3',
    enAgain.status === 200 && looksEnglish(enAgain.data.reading),
    `再切英文 (${enAgain.data.reading?.slice(0, 50)}…)`,
  )

  const dbBoth = sql(
    `SELECT (mystical_reading_zh IS NOT NULL AND length(mystical_reading_zh)>0) || '|' || (mystical_reading_en IS NOT NULL AND length(mystical_reading_en)>0) || '|' || (mystical_reading_ja IS NOT NULL AND length(mystical_reading_ja)>0) FROM book_assessments WHERE id='${aid}'`,
  )
  record('M4', dbBoth === '1|1|1', `DB 中日英均已保存 (${dbBoth})`)

  const enCached = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'en' },
    journeyId,
  })
  record(
    'M5',
    enCached.status === 200 && enCached.data.source === 'cached',
    `同语言命中缓存 source=${enCached.data.source}`,
  )

  const zhCached = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'M6',
    zhCached.status === 200 && zhCached.data.source === 'cached',
    `切回中文亦命中缓存 source=${zhCached.data.source}`,
  )

  const jaCached = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'ja' },
    journeyId,
  })
  record(
    'M7',
    jaCached.status === 200 &&
      looksJapanese(jaCached.data.reading) &&
      jaCached.data.source === 'cached',
    `切日文命中缓存 source=${jaCached.data.source}`,
  )
}

async function testHolisticLocaleSwitch() {
  console.log('\n=== 2 · 整象神谕语言切换 ===')
  const email = `locale-hol-${TS}@example.com`

  const create = await req('POST', '/api/journeys', {
    body: { email, locale: 'zh' },
  })
  const journeyId = create.data.journeyId

  for (const bookId of BOOKS) {
    const s = await saveBook(journeyId, bookId, 'zh')
    if (s.status !== 201) throw new Error(`save ${bookId}: ${s.status}`)
  }

  const zh = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'H1',
    zh.status === 200 &&
      looksChinese(zh.data.reading) &&
      looksEnglish(zh.data.readingEn) &&
      looksJapanese(zh.data.readingJa),
    `中文整象，三语并行 (${zh.data.reading?.slice(0, 40)}…)`,
  )

  const en = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    body: { locale: 'en' },
    journeyId,
  })
  record(
    'H2',
    en.status === 200 && en.data.source === 'cached' && looksEnglish(en.data.reading),
    `切英文整象命中缓存 (${en.data.reading?.slice(0, 50)}…)`,
  )

  const zhAgain = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'H3',
    zhAgain.status === 200 &&
      looksChinese(zhAgain.data.reading) &&
      zhAgain.data.source === 'cached',
    `再切中文命中缓存 (${zhAgain.data.reading?.slice(0, 30)}…)`,
  )

  const dbHol = sql(
    `SELECT (holistic_reading_zh IS NOT NULL AND length(holistic_reading_zh)>0) || '|' || (holistic_reading_en IS NOT NULL AND length(holistic_reading_en)>0) || '|' || (holistic_reading_ja IS NOT NULL AND length(holistic_reading_ja)>0) FROM journeys WHERE id='${journeyId}'`,
  )
  record('H4', dbHol === '1|1|1', `DB 整象中日英均已保存 (${dbHol})`)

  const zhCached = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'H5',
    zhCached.status === 200 && zhCached.data.source === 'cached',
    `切回中文整象缓存 source=${zhCached.data.source}`,
  )

  const jaCached = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, {
    body: { locale: 'ja' },
    journeyId,
  })
  record(
    'H6',
    jaCached.status === 200 &&
      looksJapanese(jaCached.data.reading) &&
      jaCached.data.source === 'cached',
    `切日文整象命中缓存 source=${jaCached.data.source}`,
  )
}

async function testRegisterLocaleVsUiSwitch() {
  console.log('\n=== 3 · 注册语言 vs 答题/UI 语言 ===')
  const email = `locale-reg-${TS}@example.com`

  // 英文界面注册
  const create = await req('POST', '/api/journeys', {
    body: { email, locale: 'en' },
  })
  const journeyId = create.data.journeyId
  record('R1', create.data.locale === 'en', `journey.locale=en (${journeyId.slice(0, 8)})`)

  // 中文 UI 下答题保存
  const save = await req('POST', `/api/journeys/${journeyId}/assessments`, {
    body: assessmentPayload('zh'),
    journeyId,
  })
  record(
    'R2',
    save.status === 201 && save.data.assessment.locale === 'zh',
    `答题 locale=zh（UI 中文） actual=${save.data.assessment.locale}`,
  )

  const aid = save.data.assessment.id
  const zhOracle = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'zh' },
    journeyId,
  })
  record(
    'R3',
    zhOracle.status === 200 && looksChinese(zhOracle.data.reading),
    `中文 UI 请求神谕 → 中文正文`,
  )

  const enOracle = await req('POST', `/api/assessments/${aid}/mystical-reading`, {
    body: { locale: 'en' },
    journeyId,
  })
  record(
    'R4',
    enOracle.status === 200 && looksEnglish(enOracle.data.reading),
    `切英文 UI 请求神谕 → 英文正文`,
  )
}

async function testMultiUserLocaleIsolation() {
  console.log('\n=== 4 · 多用户 + 多语言隔离 ===')
  const emailA = `locale-a-${TS}@example.com`
  const emailB = `locale-b-${TS}@example.com`

  const jA = (await req('POST', '/api/journeys', { body: { email: emailA, locale: 'zh' } }))
    .data.journeyId
  const jB = (await req('POST', '/api/journeys', { body: { email: emailB, locale: 'en' } }))
    .data.journeyId

  const sA = await saveBook(jA, 'psyche-tree', 'zh')
  const sB = await saveBook(jB, 'psyche-tree', 'en')
  const aidA = sA.data.assessment.id
  const aidB = sB.data.assessment.id

  await req('POST', `/api/assessments/${aidA}/mystical-reading`, {
    body: { locale: 'zh' },
    journeyId: jA,
  })
  await req('POST', `/api/assessments/${aidB}/mystical-reading`, {
    body: { locale: 'en' },
    journeyId: jB,
  })

  const cross = await req('GET', `/api/assessments/${aidA}`, { journeyId: jB })
  record('I1', cross.status === 404, `用户 B 无法读 A 的 assessment (${cross.status})`)

  const getA = await req('GET', `/api/journeys?email=${encodeURIComponent(emailA)}`)
  const getB = await req('GET', `/api/journeys?email=${encodeURIComponent(emailB)}`)
  record(
    'I2',
    getA.data.assessments[0]?.locale === 'zh' &&
      getB.data.assessments[0]?.locale === 'en',
    `A=zh B=en 数据独立`,
  )

  const zhA = sql(
    `SELECT mystical_reading_zh IS NOT NULL FROM book_assessments WHERE id='${aidA}'`,
  )
  const enB = sql(
    `SELECT mystical_reading_en IS NOT NULL FROM book_assessments WHERE id='${aidB}'`,
  )
  record('I3', zhA === '1' && enB === '1', `神谕语言 A=zh B=en 各存各列`)
}

async function testFallbackLocale() {
  console.log('\n=== 5 · Fallback 语言标记 ===')
  const email = `locale-fb-${TS}@example.com`
  const create = await req('POST', '/api/journeys', {
    body: { email, locale: 'zh' },
  })
  const journeyId = create.data.journeyId

  for (const bookId of BOOKS) {
    await saveBook(journeyId, bookId, 'zh')
  }

  const fb = await req('POST', `/api/journeys/${journeyId}/holistic-reading/fallback`, {
    body: { reading: '中文 fallback 整象测试', locale: 'zh' },
    journeyId,
  })
  record('F1', fb.status === 200, `fallback 写入 status=${fb.status}`)

  const row = sql(
    `SELECT (holistic_reading_zh IS NOT NULL) || '|' || holistic_reading_zh FROM journeys WHERE id='${journeyId}'`,
  )
  record('F2', row.startsWith('1|'), `DB 中文 fallback 已写入 ${row.slice(0, 40)}`)
}

async function main() {
  console.log('Locale switch test suite')
  console.log('BASE:', BASE)

  await testMysticalLocaleSwitch()
  await testHolisticLocaleSwitch()
  await testRegisterLocaleVsUiSwitch()
  await testMultiUserLocaleIsolation()
  await testFallbackLocale()

  const failed = results.filter((r) => !r.ok)
  console.log('\n=== Summary ===')
  console.log(`Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`)

  if (failed.length) {
    for (const f of failed) console.log(`  FAIL [${f.id}] ${f.detail}`)
    process.exit(1)
  }

  console.log('\n✓ All locale switch tests passed')
  console.log('\nDB snapshot:')
  console.log(
    sql(
      `SELECT u.email, j.locale, j.holistic_reading_locale, COUNT(ba.id) FROM users u JOIN journeys j ON j.user_id=u.id LEFT JOIN book_assessments ba ON ba.journey_id=j.id GROUP BY j.id`,
    ),
  )
}

main().catch((err) => {
  console.error('\n✗', err.message)
  process.exit(1)
})
