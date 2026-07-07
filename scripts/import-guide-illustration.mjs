#!/usr/bin/env node
/**
 * Import a guide prologue illustration into public/guide/{id}.png
 * Usage: node scripts/import-guide-illustration.mjs 01-shore-near /path/to/image.png
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/guide')
/** 3:4 — single guide page illustration */
const PNG_WIDTH = 1080
const PNG_HEIGHT = 1440

export const GUIDE_ILLUSTRATION_IDS = [
  '01-shore-near',
  '02-six-facets',
  '03-still-pause',
  '04-name-in-flow',
  '05-enter-mist',
  'v-tongguan',
  'v-liubai',
  'v-changye',
  'v-menpai',
  'v-huisheng',
  'v-qingchen',
  'v-yuanxing',
  'v-liujuan',
  'v-enter',
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
    .modulate({ brightness: 0.93, contrast: 1.08 })
    .sharpen({ sigma: 0.35, m1: 0.3, m2: 0.2 })
    .composite([
      { input: grainBuf, blend: 'overlay' },
      {
        input: Buffer.from(
          `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="v" cx="50%" cy="45%" r="80%">
                <stop offset="48%" stop-color="#000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0.32"/>
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
    console.error('用法: node scripts/import-guide-illustration.mjs <id> <image-path>')
    process.exit(1)
  }
  if (!GUIDE_ILLUSTRATION_IDS.includes(id)) {
    console.error(`未知 id: ${id}`)
    console.error('可用:', GUIDE_ILLUSTRATION_IDS.join(', '))
    process.exit(1)
  }
  if (!existsSync(srcPath)) {
    console.error(`找不到文件: ${srcPath}`)
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const outPath = join(OUT_DIR, `${id}.png`)
  const processed = await postProcess(readFileSync(srcPath))
  writeFileSync(outPath, processed)
  console.log(`✓ ${id} → ${outPath} (${PNG_WIDTH}×${PNG_HEIGHT})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
