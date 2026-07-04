#!/usr/bin/env node
/**
 * Capture bookshelf homepage screenshots for all four UI locales.
 * Requires dev server: npm run dev -- --host 127.0.0.1 --port 5173
 *
 * Viewport 988×1059 @2× matches existing docs/screenshots/homepage/*.png.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../docs/screenshots/homepage')
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'

const SHOTS = [
  { file: 'homepage-zh.png', button: '简体' },
  { file: 'homepage-zh-tw.png', button: '繁體' },
  { file: 'homepage-en.png', button: 'English' },
  { file: 'homepage-ja.png', button: '日本語' },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: { width: 988, height: 1059 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  })
  const page = await context.newPage()

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForFunction(() => document.fonts.ready)
  await page.waitForTimeout(1200)

  for (const { file, button } of SHOTS) {
    await page.getByRole('button', { name: button, exact: true }).click()
    await page.waitForTimeout(900)
    const outPath = path.join(OUT_DIR, file)
    await page.screenshot({ path: outPath, fullPage: true })
    console.log(`✓ ${file}`)
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
