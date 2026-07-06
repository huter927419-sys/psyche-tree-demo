#!/usr/bin/env node
/**
 * Generate display-sized WebP companions for PNG art in public/.
 * Run: npm run optimize:images
 */
import { readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

/** Max CSS display width × ~2 for retina, per asset class */
const PRESETS = [
  { dir: 'public/guide', width: 540, quality: 82 },
  { dir: 'public/covers', width: 720, quality: 82 },
  { dir: 'public/backgrounds', width: 1280, quality: 80 },
  { dir: 'public/cards', width: 560, quality: 80 },
]

async function optimizeDir(sharp, { dir, width, quality }) {
  const abs = join(ROOT, dir)
  const files = readdirSync(abs).filter((name) => name.endsWith('.png'))
  let saved = 0

  for (const name of files) {
    const src = join(abs, name)
    const out = join(abs, name.replace(/\.png$/, '.webp'))
    const before = statSync(src).size
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(out)
    const after = statSync(out).size
    saved += before - after
    console.log(`✓ ${dir}/${name.replace(/\.png$/, '.webp')} ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`)
  }

  return saved
}

async function main() {
  const sharp = (await import('sharp')).default
  let totalSaved = 0

  for (const preset of PRESETS) {
    totalSaved += await optimizeDir(sharp, preset)
  }

  console.log(`Done — saved ~${Math.round(totalSaved / 1024)}KB vs full-size PNG`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
