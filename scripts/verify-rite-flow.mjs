#!/usr/bin/env node
/**
 * Browser E2E: volume rites, one-book result, return-to-tree (after API completes 6 books).
 * Requires: npm run dev on BASE_URL
 */
import { execSync } from 'node:child_process'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const DB =
  process.env.SQLITE_PATH ??
  '/Users/wanglei/Projects/psyche-tree-demo/data/psyche-tree.sqlite'
const TS = Date.now()
const EMAIL = `qa-ui-rite-${TS}@example.com`

const checks = []

function pass(name, detail = '') {
  checks.push({ name, ok: true, detail })
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  checks.push({ name, ok: false, detail })
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function clickThroughRite(page, donePattern) {
  const done = page.getByRole('button', { name: donePattern })
  for (let i = 0; i < 14; i++) {
    if (await done.isVisible().catch(() => false)) {
      if (await done.isEnabled().catch(() => false)) {
        await done.click()
        return true
      }
    }
    const next = page.getByRole('button', { name: /下一段|Next|次へ/ })
    if (await next.isVisible().catch(() => false)) {
      try {
        await page.waitForFunction(
          () => {
            const buttons = [...document.querySelectorAll('button')]
            const btn = buttons.find((b) => /下一段|Next|次へ/.test(b.textContent ?? ''))
            return Boolean(btn && !btn.disabled)
          },
          { timeout: 10_000 },
        )
        await next.click()
        await page.waitForTimeout(350)
        continue
      } catch {
        await page.waitForTimeout(500)
        continue
      }
    }
    await page.waitForTimeout(500)
  }
  if (
    (await done.isVisible().catch(() => false)) &&
    (await done.isEnabled().catch(() => false))
  ) {
    await done.click()
    return true
  }
  return false
}

async function answerAllQuestions(page) {
  for (let round = 0; round < 12; round++) {
    const exitVisible = await page
      .locator('.volume-rite-overlay--exit')
      .isVisible()
      .catch(() => false)
    if (exitVisible) return true

    const cards = page.locator('button.group.relative.w-full.text-left')
    const n = await cards.count()
    if (n > 0) {
      await cards.first().click()
      await page.waitForTimeout(1500)
      continue
    }
    await page.waitForTimeout(350)
  }
  return await page
    .locator('.volume-rite-overlay--exit')
    .isVisible()
    .catch(() => false)
}

async function completeSixBooksViaApi() {
  const BOOKS = [
    'psyche-tree',
    'emotional-flow',
    'mind-light',
    'bond-thread',
    'flow-balance',
    'direction-light',
  ]

  const readingHeaders = {
    'Content-Type': 'application/json',
    'X-Psyche-Reading-Test-Fallback': '1',
  }

  const create = await fetch(`${BASE}/api/journeys`, {
    method: 'POST',
    headers: readingHeaders,
    body: JSON.stringify({ email: EMAIL, locale: 'zh' }),
  })
  const created = await create.json()
  if (!create.ok) throw new Error(`create journey: ${created.error ?? create.status}`)

  const { journeyId, userId } = created
  const answers = {
    'psyche-boundary': ['card-boundary-stone'],
    'psyche-wave': ['card-still-lake'],
    'psyche-still': ['card-soft-candle'],
    'attention-check': ['card-star-explorer'],
    'psyche-mirror': ['card-still-lake'],
    'psyche-guard': ['card-guardian-tree'],
    'psyche-root': ['card-deep-root-tree'],
    'psyche-whole': ['card-still-lake'],
  }

  for (const bookId of BOOKS) {
    const payload = {
      bookId,
      locale: 'zh',
      psychologyProfile: `UI test ${bookId}`,
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
      answers: bookId === 'psyche-tree' ? answers : { [`${bookId}-q1`]: ['card-a'] },
      attentionPassed: true,
      attentionFailures: [],
    }
    const res = await fetch(`${BASE}/api/journeys/${journeyId}/assessments`, {
      method: 'POST',
      headers: {
        ...readingHeaders,
        'X-Journey-Id': journeyId,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok && res.status !== 409) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`save ${bookId}: ${res.status} ${err.error ?? ''}`)
    }
  }

  const status = execSync(
    `sqlite3 "${DB}" "SELECT status FROM journeys WHERE id='${journeyId}'"`,
    { encoding: 'utf8' },
  ).trim()

  return { journeyId, userId, email: EMAIL, status }
}

async function main() {
  console.log(`\n=== Psyche Tree UI flow test @ ${BASE} ===\n`)

  try {
    const probe = await fetch(BASE)
    if (!probe.ok) throw new Error(`HTTP ${probe.status}`)
    pass('Dev server reachable')
  } catch (e) {
    fail('Dev server reachable', String(e))
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
  const context = await browser.newContext({
    viewport: { width: 988, height: 1059 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // ── 1. Homepage + locale ──
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  pass('Homepage loaded')

  await page.getByRole('button', { name: '繁體', exact: true }).click()
  if (await page.getByRole('heading', { name: /霧岸書架/ }).isVisible()) {
    pass('Locale zhTw on shelf')
  } else {
    fail('Locale zhTw on shelf')
  }
  await page.getByRole('button', { name: '简体', exact: true }).click()

  // ── 2. Single book: entry rite → questions → exit rite → profile ──
  await page.getByRole('button', { name: '心象', exact: true }).click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: '展开记忆' }).click()
  await page.waitForTimeout(1200)

  if (await page.locator('input[type="email"]').isVisible()) {
    await page.locator('input[type="email"]').fill(`qa-single-${TS}@example.com`)
    await page.getByRole('button', { name: '进入探索' }).click()
    await page.waitForTimeout(1500)
  }

  if (await page.locator('.volume-rite-overlay').isVisible()) {
    pass('Entry rite overlay shown')
  } else {
    fail('Entry rite overlay shown')
  }

  const entryDone = await clickThroughRite(
    page,
    /在息间后，进入问印|进入问印|After the breath-interval, enter seals|Enter the seals|息間ののち、問印へ|問印へ/,
  )
  if (entryDone) pass('Entry rite completed')
  else fail('Entry rite completed')

  await page.waitForTimeout(600)
  const answered = await answerAllQuestions(page)
  if (answered) pass('Question cards answered through last seal')
  else fail('Question cards answered through last seal')

  await page.waitForTimeout(700)
  if (await page.locator('.volume-rite-overlay').isVisible()) {
    pass('Exit rite overlay shown')
  } else {
    fail('Exit rite overlay shown')
  }

  const exitDone = await clickThroughRite(page, /进入照见|Enter the mirror|照見へ/)
  if (exitDone) pass('Exit rite completed')
  else fail('Exit rite completed')

  await page.locator('.volume-rite-overlay').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => null)
  await page.waitForTimeout(1800)

  let profileVisible = false
  for (let attempt = 0; attempt < 8; attempt++) {
    if (
      await page
        .locator('h2.book-page-title')
        .filter({ hasText: /心象画像|Inner portrait/ })
        .isVisible()
        .catch(() => false)
    ) {
      profileVisible = true
      break
    }
    if (await page.getByText('自我底层').isVisible().catch(() => false)) {
      profileVisible = true
      break
    }
    await page.waitForTimeout(800)
  }
  if (profileVisible) pass('Psychology profile page visible')
  else fail('Psychology profile page visible')

  // ── 3. API: complete 6 books, browser: return-to-tree → holistic ──
  let session
  try {
    session = await completeSixBooksViaApi()
    pass('API six-book journey', `status=${session.status} id=${session.journeyId.slice(0, 8)}…`)
  } catch (e) {
    fail('API six-book journey', String(e))
    session = null
  }

  if (session) {
    await page.evaluate(
      ({ journeyId, email, userId }) => {
        localStorage.setItem('psyche-journey-id', journeyId)
        localStorage.setItem('psyche-journey-email', email)
        localStorage.setItem('psyche-user-id', userId)
        sessionStorage.removeItem('psyche-return-tree-' + journeyId)
      },
      session,
    )
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 })

    const oracleBtn = page.getByRole('button', {
      name: /整象神谕|查看整象神谕|View whole oracle|整象神託/,
    })
    try {
      await oracleBtn.waitFor({ state: 'visible', timeout: 15_000 })
      pass('Ultimate oracle trigger on shelf')
      await oracleBtn.scrollIntoViewIfNeeded()
      await oracleBtn.click({ timeout: 8000 })
      await page.waitForTimeout(400)
    } catch {
      fail('Ultimate oracle trigger on shelf')
    }

    if (await page.locator('.return-tree-overlay').isVisible()) {
      pass('Return-to-tree overlay shown')
      const treeDone = await clickThroughRite(
        page,
        /继续整象神谕|Continue to whole oracle|整象神託へ/,
      )
      if (treeDone) pass('Return-to-tree completed')
      else fail('Return-to-tree completed')
    } else {
      fail('Return-to-tree overlay shown')
    }

    try {
      await page.locator('.holistic-oracle-overlay').waitFor({
        state: 'visible',
        timeout: 12_000,
      })
      pass('Holistic oracle overlay after 归树')
    } catch {
      fail('Holistic oracle overlay after 归树')
    }
  }

  await browser.close()

  const failed = checks.filter((c) => !c.ok)
  console.log(`\n=== ${checks.length - failed.length}/${checks.length} passed ===`)
  if (failed.length) {
    console.log('\nFailed:')
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
