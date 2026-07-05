#!/usr/bin/env node
/**
 * Import a homepage ambient background into public/backgrounds/{id}.png
 * Usage: node scripts/import-background-image.mjs 01-mist-arrival /path/to/image.png
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/backgrounds')
/** 16:9 — full-viewport cover for homepage crossfade */
const PNG_WIDTH = 2560
const PNG_HEIGHT = 1440

export const BACKGROUND_SCENE_IDS = [
  '01-mist-arrival',
  '02-far-peaks',
  '03-still-water',
  '04-light-column',
  '05-wind-mist',
  '06-night-shore',
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
    grain[i * 4 + 3] = 10
  }
  const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 4 } })
    .blur(0.5)
    .png()
    .toBuffer()

  return sharp(buffer)
    .resize(PNG_WIDTH, PNG_HEIGHT, { fit: 'cover', position: 'centre' })
    .grayscale()
    .modulate({ brightness: 0.96, contrast: 1.06 })
    .sharpen({ sigma: 0.3, m1: 0.28, m2: 0.18 })
    .composite([
      { input: grainBuf, blend: 'overlay' },
      {
        input: Buffer.from(
          `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="v" cx="50%" cy="48%" r="82%">
                <stop offset="50%" stop-color="#000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
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
  const [id, srcPath] = process.argv.slice(2)
  if (!id || !srcPath) {
    console.error('用法: node scripts/import-background-image.mjs <id> <image-path>')
    console.error('例如: node scripts/import-background-image.mjs 01-mist-arrival ./scene.png')
    process.exit(1)
  }

  if (!BACKGROUND_SCENE_IDS.includes(id)) {
    console.error(`未知 id: ${id}`)
    console.error('可用:', BACKGROUND_SCENE_IDS.join(', '))
    process.exit(1)
  }

  if (!existsSync(srcPath)) {
    console.error(`找不到文件: ${srcPath}`)
    process.exit(1)
  }

  const outPath = join(OUT_DIR, `${id}.png`)
  mkdirSync(OUT_DIR, { recursive: true })
  const processed = await postProcess(readFileSync(srcPath))
  writeFileSync(outPath, processed)
  console.log(`✓ ${id} → ${outPath} (${PNG_WIDTH}×${PNG_HEIGHT})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
