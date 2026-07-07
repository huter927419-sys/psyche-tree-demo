#!/usr/bin/env node
/**
 * Generate ink-wash vignette illustrations for 序卷《同观》.
 * Run: node scripts/generate-guide-vignettes.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/guide')
const W = 1080
const H = 1440

const VIGNETTES = {
  'v-tongguan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <defs>
      <radialGradient id="g" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#3a3530"/>
        <stop offset="100%" stop-color="#1a1816"/>
      </radialGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8dfd0" stop-opacity="0"/>
        <stop offset="55%" stop-color="#c9bfb0" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#e8dfd0" stop-opacity="0.28"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1440" fill="url(#g)"/>
    <ellipse cx="540" cy="920" rx="420" ry="80" fill="url(#mist)"/>
    <path d="M120 980 Q540 860 960 980" stroke="#d4c9b8" stroke-opacity="0.35" fill="none" stroke-width="2"/>
    <circle cx="540" cy="420" r="3" fill="#e8dfd0" fill-opacity="0.55"/>
    <circle cx="480" cy="380" r="1.5" fill="#e8dfd0" fill-opacity="0.35"/>
    <circle cx="610" cy="360" r="1.5" fill="#e8dfd0" fill-opacity="0.3"/>
  </svg>`,
  'v-liubai': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#1c1a18"/>
    <rect x="280" y="320" width="520" height="680" fill="none" stroke="#d4c9b8" stroke-opacity="0.22" stroke-width="2"/>
    <rect x="320" y="380" width="440" height="520" fill="#2a2622" fill-opacity="0.6"/>
    <line x1="420" y1="520" x2="660" y2="520" stroke="#d4c9b8" stroke-opacity="0.08" stroke-width="1"/>
    <line x1="420" y1="600" x2="620" y2="600" stroke="#d4c9b8" stroke-opacity="0.06" stroke-width="1"/>
    <rect x="480" y="780" width="120" height="8" rx="2" fill="#d4c9b8" fill-opacity="0.12"/>
  </svg>`,
  'v-changye': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#141218"/>
    <rect x="340" y="260" width="400" height="560" fill="#1e1c22" stroke="#d4c9b8" stroke-opacity="0.18" stroke-width="2"/>
    <rect x="500" y="340" width="80" height="120" fill="#e8dfd0" fill-opacity="0.08"/>
    <path d="M380 820 Q540 760 700 820" stroke="#d4c9b8" stroke-opacity="0.15" fill="none" stroke-width="1.5"/>
    <circle cx="540" cy="200" r="40" fill="#e8dfd0" fill-opacity="0.04"/>
  </svg>`,
  'v-menpai': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#1a1816"/>
    <rect x="360" y="480" width="360" height="120" rx="4" fill="#2a2622" stroke="#d4c9b8" stroke-opacity="0.35" stroke-width="2"/>
    <line x1="420" y1="540" x2="660" y2="540" stroke="#d4c9b8" stroke-opacity="0.2" stroke-width="1"/>
    <line x1="480" y1="510" x2="600" y2="510" stroke="#d4c9b8" stroke-opacity="0.12" stroke-width="1"/>
    <path d="M200 900 L880 900" stroke="#d4c9b8" stroke-opacity="0.08" stroke-width="1"/>
  </svg>`,
  'v-huisheng': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#181614"/>
    <rect x="390" y="420" width="300" height="520" rx="36" fill="#222018" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="2"/>
    <circle cx="540" cy="620" r="48" fill="none" stroke="#d4c9b8" stroke-opacity="0.2" stroke-width="2"/>
    <path d="M516 620 L540 600 L564 620 L540 648 Z" fill="#d4c9b8" fill-opacity="0.15"/>
    <rect x="430" y="780" width="220" height="6" rx="3" fill="#d4c9b8" fill-opacity="0.1"/>
  </svg>`,
  'v-qingchen': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#1a1c18"/>
    <rect x="200" y="680" width="680" height="24" fill="#2a2824" fill-opacity="0.8"/>
    <ellipse cx="420" cy="620" rx="60" ry="80" fill="#3a4a32" fill-opacity="0.35"/>
    <ellipse cx="540" cy="600" rx="50" ry="70" fill="#4a5a3a" fill-opacity="0.4"/>
    <ellipse cx="660" cy="630" rx="55" ry="75" fill="#3a4a32" fill-opacity="0.35"/>
    <path d="M180 400 Q540 280 900 380" stroke="#e8dfd0" stroke-opacity="0.12" fill="none" stroke-width="2"/>
  </svg>`,
  'v-yuanxing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#1c1a16"/>
    <rect x="320" y="380" width="440" height="560" fill="#eae2d4" fill-opacity="0.06" stroke="#d4c9b8" stroke-opacity="0.22" stroke-width="1.5"/>
    <line x1="380" y1="460" x2="700" y2="460" stroke="#d4c9b8" stroke-opacity="0.12" stroke-width="1"/>
    <line x1="380" y1="520" x2="650" y2="520" stroke="#d4c9b8" stroke-opacity="0.08" stroke-width="1"/>
    <line x1="380" y1="580" x2="680" y2="580" stroke="#d4c9b8" stroke-opacity="0.08" stroke-width="1"/>
    <path d="M720 900 Q540 960 360 900" stroke="#d4c9b8" stroke-opacity="0.1" fill="none" stroke-width="1.5"/>
  </svg>`,
  'v-liujuan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <rect width="1080" height="1440" fill="#1a1816"/>
    <ellipse cx="540" cy="720" rx="380" ry="200" fill="#e8dfd0" fill-opacity="0.04"/>
    <circle cx="340" cy="680" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="480" cy="640" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="600" cy="640" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="740" cy="680" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="420" cy="780" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
    <circle cx="660" cy="780" r="28" fill="none" stroke="#d4c9b8" stroke-opacity="0.25" stroke-width="1.5"/>
  </svg>`,
  'v-enter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440">
    <defs>
      <radialGradient id="m" cx="50%" cy="60%" r="65%">
        <stop offset="0%" stop-color="#e8dfd0" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#1a1816" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1440" fill="#141210"/>
    <rect width="1080" height="1440" fill="url(#m)"/>
    <path d="M200 1100 Q540 900 880 1100" stroke="#d4c9b8" stroke-opacity="0.2" fill="none" stroke-width="2"/>
    <path d="M540 480 L540 880" stroke="#d4c9b8" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="4 8"/>
    <circle cx="540" cy="460" r="6" fill="#e8dfd0" fill-opacity="0.4"/>
  </svg>`,
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const sharp = (await import('sharp')).default

  for (const [id, svg] of Object.entries(VIGNETTES)) {
    const pngPath = join(OUT_DIR, `${id}.png`)
    await sharp(Buffer.from(svg)).resize(W, H).png().toFile(pngPath)
    console.log(`Wrote ${pngPath}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
