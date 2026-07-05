#!/usr/bin/env node
/**
 * Import a user-provided volume cover into public/covers/{id}.png
 * Usage: node scripts/import-cover-image.mjs guide /path/to/image.png
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/covers')
/** 32:42 — matches .book-closed aspect-ratio in CSS */
const PNG_WIDTH = 1280
const PNG_HEIGHT = 1680

export const COVER_IDS = [
  'guide',
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

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
    grain[i * 4 + 3] = 12
  }
  const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 4 } })
    .blur(0.5)
    .png()
    .toBuffer()

  return sharp(buffer)
    .resize(PNG_WIDTH, PNG_HEIGHT, { fit: 'cover', position: 'centre' })
    .grayscale()
    .modulate({ brightness: 0.92, contrast: 1.1 })
    .sharpen({ sigma: 0.4, m1: 0.35, m2: 0.22 })
    .composite([
      { input: grainBuf, blend: 'overlay' },
      {
        input: Buffer.from(
          `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="v" cx="50%" cy="42%" r="78%">
                <stop offset="45%" stop-color="#000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0.38"/>
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
  const [coverId, srcPath] = process.argv.slice(2)
  if (!coverId || !srcPath) {
    console.error('用法: node scripts/import-cover-image.mjs <cover-id> <image-path>')
    console.error('例如: node scripts/import-cover-image.mjs guide ./my-cover.png')
    process.exit(1)
  }

  if (!COVER_IDS.includes(coverId)) {
    console.error(`未知 cover id: ${coverId}`)
    console.error('可用:', COVER_IDS.join(', '))
    process.exit(1)
  }

  if (!existsSync(srcPath)) {
    console.error(`找不到文件: ${srcPath}`)
    process.exit(1)
  }

  const outPath = join(OUT_DIR, `${coverId}.png`)
  mkdirSync(OUT_DIR, { recursive: true })
  const processed = await postProcess(readFileSync(srcPath))
  writeFileSync(outPath, processed)
  console.log(`✓ ${coverId} → ${outPath} (${PNG_WIDTH}×${PNG_HEIGHT})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
