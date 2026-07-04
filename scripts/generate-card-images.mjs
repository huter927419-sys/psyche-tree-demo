#!/usr/bin/env node
/**
 * Generates cinematic card PNGs (layered procedural art + film post-process)
 * For photorealistic AI art: npm run generate:cards:ai (needs OPENAI_API_KEY)
 * Run: npm run generate:cards
 */
import { mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderCardSvg, PATTERNS } from './card-art-renderer.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/cards')
const PNG_WIDTH = 1120
const PNG_HEIGHT = 560

async function makeGrain(sharp, w, h) {
  const noise = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    const v = 80 + Math.floor(Math.random() * 40)
    noise[i * 4] = v
    noise[i * 4 + 1] = v
    noise[i * 4 + 2] = v
    noise[i * 4 + 3] = 18
  }
  return sharp(noise, { raw: { width: w, height: h, channels: 4 } })
    .blur(0.4)
    .png()
    .toBuffer()
}

async function renderPng(sharp, pattern) {
  const svg = renderCardSvg(pattern)
  const grain = await makeGrain(sharp, PNG_WIDTH, PNG_HEIGHT)

  return sharp(Buffer.from(svg), { density: 240 })
    .resize(PNG_WIDTH, PNG_HEIGHT, { fit: 'cover', kernel: 'lanczos3' })
    .grayscale()
    .modulate({ brightness: 0.92, contrast: 1.18 })
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.35 })
    .composite([
      { input: grain, blend: 'overlay' },
      {
        input: Buffer.from(
          `<svg width="${PNG_WIDTH}" height="${PNG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="v" cx="50%" cy="50%" r="70%">
                <stop offset="55%" stop-color="#000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#v)"/>
          </svg>`,
        ),
        blend: 'multiply',
      },
    ])
    .png({ compressionLevel: 6, effort: 10 })
    .toBuffer()
}

mkdirSync(OUT, { recursive: true })

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('请先安装 sharp: npm install -D sharp')
    process.exit(1)
  }

  for (const id of PATTERNS) {
    const buffer = await renderPng(sharp, id)
    await sharp(buffer).toFile(join(OUT, `${id}.png`))
    console.log(`✓ ${id}.png (${PNG_WIDTH}×${PNG_HEIGHT})`)
  }

  for (const file of readdirSync(OUT)) {
    if (file.endsWith('.svg')) unlinkSync(join(OUT, file))
  }

  console.log(`\nGenerated ${PATTERNS.length} cinematic PNG files in public/cards/`)
  console.log('提示：若需更写实的 AI 配图，配置 OPENAI_API_KEY 后运行 npm run generate:cards:ai -- --force')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
