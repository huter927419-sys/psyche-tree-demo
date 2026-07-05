#!/usr/bin/env node
/**
 * Import a user-provided card image into public/cards/{pattern}.png
 * Usage: node scripts/import-card-image.mjs steady-river /path/to/image.png
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CARDS } from './card-prompts.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/cards')
const PNG_WIDTH = 1120
const PNG_HEIGHT = 560

async function postProcess(buffer) {
  const sharp = (await import('sharp')).default
  const w = PNG_WIDTH
  const h = PNG_HEIGHT
  const grain = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    const v = 72 + Math.floor(Math.random() * 36)
    grain[i * 4] = v
    grain[i * 4 + 1] = v
    grain[i * 4 + 2] = v
    grain[i * 4 + 3] = 14
  }
  const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 4 } })
    .blur(0.5)
    .png()
    .toBuffer()

  return sharp(buffer)
    .resize(PNG_WIDTH, PNG_HEIGHT, { fit: 'cover', position: 'centre' })
    .grayscale()
    .modulate({ brightness: 0.9, contrast: 1.12 })
    .sharpen({ sigma: 0.45, m1: 0.4, m2: 0.25 })
    .composite([
      { input: grainBuf, blend: 'overlay' },
      {
        input: Buffer.from(
          `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="v" cx="50%" cy="48%" r="72%">
                <stop offset="50%" stop-color="#000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0.48"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#v)"/>
          </svg>`,
        ),
        blend: 'multiply',
      },
    ])
    .png({ compressionLevel: 6 })
    .toBuffer()
}

async function main() {
  const [pattern, srcPath] = process.argv.slice(2)
  if (!pattern || !srcPath) {
    console.error('用法: node scripts/import-card-image.mjs <pattern> <image-path>')
    console.error('例如: node scripts/import-card-image.mjs steady-river ./my-river.png')
    process.exit(1)
  }

  const card = CARDS.find((c) => c.pattern === pattern)
  if (!card) {
    console.error(`未知 pattern: ${pattern}`)
    console.error('可用:', CARDS.map((c) => c.pattern).join(', '))
    process.exit(1)
  }

  if (!existsSync(srcPath)) {
    console.error(`找不到文件: ${srcPath}`)
    process.exit(1)
  }

  const outPath = join(OUT_DIR, `${pattern}.png`)
  const processed = await postProcess(readFileSync(srcPath))
  writeFileSync(outPath, processed)
  console.log(`✓ ${card.label} → ${outPath} (${PNG_WIDTH}×${PNG_HEIGHT})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
