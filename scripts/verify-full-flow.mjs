#!/usr/bin/env node
/**
 * Full business-flow verification (API + SQLite).
 * Scenarios A–F from QA plan. Requires `npm run dev` on BASE_URL.
 */
import { execSync } from 'node:child_process'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const DB = process.env.SQLITE_PATH ?? '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const TS = Date.now()
const EMAIL_ZH = `qa-flow-zh-${TS}@example.com`
const EMAIL_EN = `qa-flow-en-${TS}@example.com`
const EMAIL_ZH2 = `qa-flow-zh2-${TS}@example.com`

const BOOKS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

const psycheAnswers = {
  'psyche-boundary': ['card-boundary-stone'],
  'psyche-wave': ['card-still-lake'],
  'psyche-still': ['card-soft-candle'],
  'psyche-mirror': ['card-still-lake'],
  'psyche-guard': ['card-guardian-tree'],
  'psyche-root': ['card-deep-root-tree'],
  'psyche-whole': ['card-still-lake'],
}

/** @type {{ id: string, name: string, ok: boolean, detail: string }[]} */
const results = []

function record(id, name, ok, detail) {
  results.push({ id, name, ok, detail })
  const mark = ok ? '✓' : '✗'
  console.log(`  ${mark} [${id}] ${name}${detail ? ` — ${detail}` : ''}`)
}

async function req(method, path, { body, journeyId } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (journeyId) headers['X-Journey-Id'] = journeyId
  const res = await fetch(`${BASE}${path}`, {
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
  return { status: res.status, data }
}

function sql(query) {
  return execSync(`sqlite3 "${DB}" "${query}"`, { encoding: 'utf8' }).trim()
}

function assessmentPayload(bookId, locale, profileSuffix = '') {
  return {
    bookId,
    locale,
    psychologyProfile: `QA profile ${bookId}${profileSuffix}`,
    psychologyPromptInput: `prompt ${bookId}`,
    dimensions: [
      {
        dimensionIndex: 1,
        title: 'test',
        averageScore: 1,
        level: 'mid',
        selectedCardIds: ['card-test'],
      },
    ],
    answers: bookId === 'psyche-tree' ? psycheAnswers : { [`${bookId}-q1`]: ['card-a'] },
    attentionPassed: true,
    attentionFailures: [],
  }
}

async function createJourney(email, locale) {
  const r = await req('POST', '/api/journeys', { body: { email, locale } })
  if (r.status !== 201) throw new Error(`create journey: ${r.status}`)
  return r.data.journeyId
}

async function saveAssessment(journeyId, bookId, locale) {
  return req('POST', `/api/journeys/${journeyId}/assessments`, {
    body: assessmentPayload(bookId, locale),
    journeyId,
  })
}

async function scenarioA() {
  console.log('\n=== A · 中文新用户 · 单卷 ===')
  const journeyId = await createJourney(EMAIL_ZH, 'zh')
  record('A3', '邮箱注册创建 journey', true, journeyId.slice(0, 8))

  const resume = await req('POST', '/api/journeys', { body: { email: EMAIL_ZH, locale: 'zh' } })
  record(
    'A3b',
    '同邮箱续接同一 journey',
    resume.status === 201 && resume.data.journeyId === journeyId,
    resume.data.journeyId === journeyId ? 'match' : 'mismatch',
  )

  const save = await saveAssessment(journeyId, 'psyche-tree', 'zh')
  record(
    'A6',
    '单卷答题保存',
    save.status === 201,
    `status=${save.status} id=${save.data?.assessment?.id?.slice(0, 8) ?? 'n/a'}`,
  )

  const dup = await saveAssessment(journeyId, 'psyche-tree', 'zh')
  record('A9', '重复保存同一卷 → 409', dup.status === 409, `status=${dup.status}`)

  const journey = await req('GET', `/api/journeys/${journeyId}`, { journeyId })
  const stored = journey.data?.assessments?.[0]
  record(
    'A7',
    'answers_json 7 键回读',
    stored?.answers && Object.keys(stored.answers).length === 7,
    `keys=${stored ? Object.keys(stored.answers).length : 0}`,
  )

  const row = sql(
    `SELECT COUNT(*) FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='${EMAIL_ZH}'`,
  )
  record('A-DB', 'SQLite 1 条 assessment', row === '1', `count=${row}`)

  const mystical = await req('POST', `/api/assessments/${save.data.assessment.id}/mystical-reading`, {
    journeyId,
  })
  record(
    'A6b',
    '单卷神谕生成',
    mystical.status === 200 && mystical.data?.reading?.length > 0,
    `status=${mystical.status} len=${mystical.data?.reading?.length ?? 0}`,
  )

  const mystRow = sql(
    `SELECT mystical_reading_status, length(mystical_reading) FROM book_assessments WHERE id='${save.data.assessment.id}'`,
  )
  record('A-DB2', '神谕落库', mystRow.startsWith('completed|'), mystRow)

  return journeyId
}

async function scenarioB(journeyId) {
  console.log('\n=== B · 中文第二卷 ===')
  const save = await saveAssessment(journeyId, 'emotional-flow', 'zh')
  record('B2', '第二卷保存', save.status === 201, `status=${save.status}`)

  const count = sql(
    `SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyId}'`,
  )
  record('B3', '同一 journey 2 条 assessment', count === '2', `count=${count}`)

  const status = sql(`SELECT status FROM journeys WHERE id='${journeyId}'`)
  record('B3b', 'journey 仍为 in_progress', status === 'in_progress', status)
}

async function scenarioE(journeyId) {
  console.log('\n=== E · 换用户 / 续接 ===')
  const resume = await req('POST', '/api/journeys', { body: { email: EMAIL_ZH, locale: 'zh' } })
  record(
    'E3',
    '原邮箱重新登录续 journey',
    resume.data.journeyId === journeyId,
    resume.data.journeyId,
  )

  const newJ = await createJourney(EMAIL_ZH2, 'zh')
  record('E4', '新邮箱创建新 journey', newJ !== journeyId, newJ.slice(0, 8))

  const oldCount = sql(`SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyId}'`)
  record('E5', '原用户数据未删', oldCount === '2', `assessments=${oldCount}`)
}

async function scenarioD() {
  console.log('\n=== D · 英文单卷 ===')
  const journeyId = await createJourney(EMAIL_EN, 'en')
  const save = await saveAssessment(journeyId, 'psyche-tree', 'en')
  record('D3', '英文 assessment 保存', save.status === 201, `locale=en`)

  const localeRow = sql(
    `SELECT ba.locale FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='${EMAIL_EN}'`,
  )
  record('D-DB', 'DB locale=en', localeRow === 'en', localeRow)
}

async function scenarioC(journeyId) {
  console.log('\n=== C · 中文六卷 + 整象 ===')
  for (const bookId of BOOKS.slice(2)) {
    const existing = sql(
      `SELECT COUNT(*) FROM book_assessments WHERE journey_id='${journeyId}' AND book_id='${bookId}'`,
    )
    if (existing === '1') continue
    const save = await saveAssessment(journeyId, bookId, 'zh')
    if (save.status !== 201) {
      record('C1', `保存 ${bookId}`, false, `${save.status} ${JSON.stringify(save.data)}`)
      return
    }
  }
  record('C1', '六卷全部保存', true, '6 books')

  const status = sql(`SELECT status FROM journeys WHERE id='${journeyId}'`)
  record('C2', 'journey.status=completed', status === 'completed', status)

  const holEarly = await req('POST', `/api/journeys/${journeyId}/holistic-reading`, { journeyId })
  record(
    'C3',
    '整象 POST 成功',
    holEarly.status === 200 && holEarly.data?.reading?.length > 0,
    `status=${holEarly.status} len=${holEarly.data?.reading?.length ?? 0}`,
  )

  const holRow = sql(
    `SELECT holistic_reading_status, holistic_reading_source, length(holistic_reading) FROM journeys WHERE id='${journeyId}'`,
  )
  record('C-DB', '整象落库', holRow.startsWith('completed|'), holRow)

  const journey = await req('GET', `/api/journeys/${journeyId}`, { journeyId })
  record(
    'C4',
    'GET journey 含 6 assessments + holistic',
    journey.data.assessments.length === 6 && journey.data.holistic?.reading,
    `books=${journey.data.assessments.length}`,
  )
}

async function scenarioF(journeyId) {
  console.log('\n=== F · 异常边界 ===')
  const incompleteEmail = `qa-incomplete-${TS}@example.com`
  const incJ = await createJourney(incompleteEmail, 'zh')
  await saveAssessment(incJ, 'psyche-tree', 'zh')

  const hol = await req('POST', `/api/journeys/${incJ}/holistic-reading`, { journeyId: incJ })
  record('F2', '未完成 journey 请求整象 → 409', hol.status === 409, `status=${hol.status}`)

  const dup = await saveAssessment(incJ, 'psyche-tree', 'zh')
  record('F1', '重复卷 → 409', dup.status === 409, `status=${dup.status}`)

  const fb = await req('POST', `/api/journeys/${journeyId}/holistic-reading/fallback`, {
    body: { reading: 'fallback oracle test text for QA' },
    journeyId,
  })
  record('F4', '整象 fallback 写入', fb.status === 200, `status=${fb.status}`)

  const fbRow = sql(
    `SELECT holistic_reading_source, holistic_reading FROM journeys WHERE id='${journeyId}'`,
  )
  record(
    'F4b',
    'fallback 覆盖落库',
    fbRow.startsWith('fallback|'),
    fbRow.slice(0, 40),
  )
}

async function scenarioUI() {
  console.log('\n=== UI · 静态资源与 API 可达 ===')
  const home = await fetch(BASE)
  record('UI1', '首页 HTTP 200', home.status === 200, `status=${home.status}`)

  const html = await home.text()
  record('UI2', 'React 挂载点存在', html.includes('id="root"'), 'root div')
  record('UI2b', '页面标题「雾岸」', html.includes('雾岸'), 'title')

  const prodJs = html.match(/src="(\/assets\/index-[^"]+\.js)"/)
  const devJs = html.match(/src="(\/src\/main\.tsx[^"]*)"/)
  const jsPath = prodJs?.[1] ?? devJs?.[1]
  if (jsPath) {
    const jsRes = await fetch(`${BASE}${jsPath}`)
    record('UI3', '入口 JS/TS 可加载', jsRes.status === 200, jsPath)
  } else {
    record('UI3', '入口 JS/TS 可加载', false, 'no script tag')
  }

  const uiRes = await fetch(`${BASE}/src/i18n/ui.ts`)
  if (uiRes.status === 200) {
    const uiSrc = await uiRes.text()
    record('UI4', '含整象神谕文案', uiSrc.includes('整象神谕'), 'i18n zh')
    record('UI5', '含退出/登出文案', uiSrc.includes('退出') || uiSrc.includes('Sign out'), 'logout')
    record('UI6', '含回顾模式', uiSrc.includes('回顾'), 'readOnly zh')
    record('UI6b', '含英文 Whole-image oracle', uiSrc.includes('Whole-image oracle'), 'i18n en')
  } else {
    const cssMatch = html.match(/href="(\/assets\/index-[^"]+\.css)"/)
    if (cssMatch) {
      const jsBundle = prodJs ? await (await fetch(`${BASE}${prodJs[1]}`)).text() : ''
      record('UI4', '含整象神谕文案', jsBundle.includes('整象神谕'), 'bundle')
      record('UI5', '含登出文案', jsBundle.includes('登出'), 'bundle')
      record('UI6', '含回顾模式', jsBundle.includes('回顾'), 'bundle')
    }
  }

  const cssPath =
    html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1] ??
    '/src/index.css'
  const cssRes = await fetch(`${BASE}${cssPath}`)
  if (cssRes.status === 200) {
    const css = await cssRes.text()
    record('UI7', 'CSS 可加载', true, cssPath)
    record(
      'UI8',
      '含书架动画 keyframes',
      css.includes('hero-facet-beacon') || css.includes('hero-verse'),
      'animation',
    )
  } else {
    record('UI7', 'CSS 可加载', false, `status=${cssRes.status}`)
  }

  const heroRes = await fetch(`${BASE}/src/components/bookshelf/BookshelfHeroProse.tsx`)
  record(
    'UI10',
    '书架 intro 组件可达',
    heroRes.status === 200,
    `status=${heroRes.status}`,
  )

  const api404 = await req('GET', '/api/journeys/not-a-real-id')
  record('UI9', '无效 journey → 404', api404.status === 404, `status=${api404.status}`)
}

async function scenarioRealUser() {
  console.log('\n=== 回归 · lanegg110@126.com ===')
  const r = await req('GET', '/api/journeys?email=lanegg110%40126.com')
  if (r.status !== 200) {
    record('R1', '查询已有用户', false, `status=${r.status}`)
    return
  }
  record('R1', '查询已有用户 journey', true, r.data.journeyId?.slice(0, 8))

  const count = sql(
    `SELECT COUNT(*) FROM book_assessments ba JOIN journeys j ON j.id=ba.journey_id JOIN users u ON u.id=j.user_id WHERE u.email='lanegg110@126.com'`,
  )
  record(
    'R2',
    '当前 assessment 数量',
    true,
    `${count} 条（未完成任一卷则为 0，属用户行为非 bug）`,
  )
}

async function main() {
  console.log('Full flow verification')
  console.log('BASE:', BASE)
  console.log('DB:', DB)
  console.log('ZH email:', EMAIL_ZH)
  console.log('EN email:', EMAIL_EN)

  let journeyId
  try {
    journeyId = await scenarioA()
    await scenarioB(journeyId)
    await scenarioE(journeyId)
    await scenarioD()
    await scenarioC(journeyId)
    await scenarioF(journeyId)
    await scenarioUI()
    await scenarioRealUser()
  } catch (err) {
    console.error('\nFatal:', err.message)
    process.exit(1)
  }

  const failed = results.filter((r) => !r.ok)
  console.log('\n=== Summary ===')
  console.log(`Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`)

  if (failed.length) {
    console.log('\nFailed checks:')
    for (const f of failed) console.log(`  - [${f.id}] ${f.name}: ${f.detail}`)
    process.exit(1)
  }

  console.log('\n✓ Full business flow passed')
  console.log('\nSQLite snapshot (test users):')
  console.log(
    sql(
      `SELECT u.email, j.status, COUNT(ba.id) FROM users u JOIN journeys j ON j.user_id=u.id LEFT JOIN book_assessments ba ON ba.journey_id=j.id WHERE u.email LIKE 'qa-flow-%${TS.toString().slice(0, 6)}%' OR u.email LIKE 'qa-flow-zh-${TS}%' OR u.email LIKE 'qa-flow-en-${TS}%' OR u.email LIKE 'qa-incomplete-${TS}%' GROUP BY j.id`,
    ) || '(run individual query)',
  )

  const snap = sql(
    `SELECT u.email, j.status, COUNT(ba.id) as books FROM users u JOIN journeys j ON j.user_id=u.id LEFT JOIN book_assessments ba ON ba.journey_id=j.id WHERE u.email IN ('${EMAIL_ZH}','${EMAIL_EN}','${EMAIL_ZH2}','qa-incomplete-${TS}@example.com') GROUP BY j.id`,
  )
  console.log(snap)
}

main()
