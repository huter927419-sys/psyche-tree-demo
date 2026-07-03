#!/usr/bin/env node
/**
 * Export public/cards/*.svg → *.png (2x retina)
 * Requires: npm install -D sharp
 * Run: npm run export:cards:png
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CARDS_DIR = join(__dirname, '../public/cards')
const WIDTH = 1120
const HEIGHT = 560

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('请先安装 sharp: npm install -D sharp')
    process.exit(1)
  }

  if (!existsSync(CARDS_DIR)) {
    console.error('未找到 public/cards/，请先运行 npm run generate:cards')
    process.exit(1)
  }

  const svgs = readdirSync(CARDS_DIR).filter((f) => f.endsWith('.svg'))
  if (svgs.length === 0) {
    console.error('public/cards/ 中没有 SVG 文件')
    process.exit(1)
  }

  for (const file of svgs) {
    const name = file.replace(/\.svg$/, '')
    const svgPath = join(CARDS_DIR, file)
    const pngPath = join(CARDS_DIR, `${name}.png`)
    const svg = readFileSync(svgPath)

    await sharp(svg, { density: 300 })
      .resize(WIDTH, HEIGHT, { fit: 'cover', kernel: 'lanczos3' })
      .png({ compressionLevel: 6, effort: 10 })
      .toFile(pngPath)

    console.log(`✓ ${name}.png (${WIDTH}×${HEIGHT})`)
  }

  console.log(`\nExported ${svgs.length} PNG files to public/cards/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
