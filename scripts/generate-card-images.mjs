#!/usr/bin/env node
/**
 * Generates monochrome card illustration SVGs to public/cards/
 * Run: npm run generate:cards
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/cards')

const W = 560
const H = 280

const PATTERNS = [
  'steady-river', 'wind-leaf', 'mountain-guard', 'star-explorer',
  'deep-root-tree', 'fog-path', 'star-guide', 'drift-boat',
  'warm-hands', 'shield', 'silk-bridge', 'stars-gaze',
  'balance-boat', 'cautious-mountain', 'flexible-wind', 'sensing-river',
  'still-lake', 'soft-candle', 'guardian-tree', 'wind-leaf-emotion',
  'bloom-tree', 'stable-mountain', 'wind-cloud', 'seed-awakening',
  'resonance-light', 'seeking-lamp', 'steady-path', 'fog-walk',
]

function treeBackground() {
  return `
    <g opacity="0.28" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M186,268 C184,220 188,170 192,130 C196,90 198,55 200,42 L204,42 C208,90 210,130 214,170 C218,220 216,268 214,268 Z" fill="rgba(55,52,48,0.55)" stroke="rgba(200,195,185,0.2)" stroke-width="0.5"/>
      <path d="M200,255 Q165,275 130,268" stroke="rgba(180,175,165,0.35)" stroke-width="1.2"/>
      <path d="M200,255 Q235,275 270,268" stroke="rgba(180,175,165,0.35)" stroke-width="1.2"/>
      <path d="M194,175 Q140,155 95,135" stroke="rgba(180,175,165,0.3)" stroke-width="1.4"/>
      <path d="M206,175 Q260,155 305,135" stroke="rgba(180,175,165,0.3)" stroke-width="1.4"/>
      <path d="M198,115 Q198,85 200,62" stroke="rgba(180,175,165,0.28)" stroke-width="1.2"/>
      <ellipse cx="200" cy="78" rx="72" ry="38" fill="rgba(40,38,35,0.35)" stroke="rgba(180,175,165,0.15)" stroke-width="0.5"/>
      <ellipse cx="145" cy="105" rx="42" ry="26" fill="rgba(40,38,35,0.2)" stroke="rgba(180,175,165,0.12)" stroke-width="0.4"/>
      <ellipse cx="255" cy="105" rx="42" ry="26" fill="rgba(40,38,35,0.2)" stroke="rgba(180,175,165,0.12)" stroke-width="0.4"/>
    </g>`
}

function wrap(id, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="45%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <radialGradient id="ambient-${id}" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#ambient-${id})"/>
  ${treeBackground()}
  <g stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${body}
  </g>
</svg>`
}

function glow(x, y, r, o = 0.35) {
  const inner = o * 0.55
  const mid = o * 0.18
  const outer = o * 0.06
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(248,244,236,${outer})"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="rgba(248,244,236,${mid})"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.22}" fill="rgba(255,252,247,${inner})"/>`
  )
}

function line(x1, y1, x2, y2, w = 1.2, o = 0.85) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(245,240,232,${o})" stroke-width="${w}"/>`
}

function path(d, w = 1.2, o = 0.85) {
  return `<path d="${d}" stroke="rgba(245,240,232,${o})" stroke-width="${w}"/>`
}

function dim(d, w = 0.6, o = 0.28) {
  return `<path d="${d}" stroke="rgba(200,200,200,${o})" stroke-width="${w}"/>`
}

function drawMountainGuard() {
  return (
    glow(280, 85, 55) +
    path('M100,220 L280,55 L460,220', 1.3) +
    dim('M160,220 L280,110 L400,220') +
    line(60, 220, 500, 220, 0.5, 0.25) +
    glow(280, 60, 10, 1)
  )
}

function drawWindLeaf() {
  return (
    glow(280, 120, 40) +
    path('M250,130 Q275,95 310,125 Q285,140 250,130', 1) +
    dim('M30,150 Q180,120 320,145') +
    dim('M200,80 Q340,60 480,90')
  )
}

function drawSteadyRiver() {
  return (
    glow(300, 130, 50) +
    path('M20,200 Q140,150 220,160 T480,70', 1.4) +
    dim('M20,210 Q160,170 240,180 T500,90') +
    glow(220, 160, 8, 0.9) +
    glow(380, 95, 6, 0.8)
  )
}

function drawDeepRootTree() {
  return (
    glow(280, 100, 45) +
    line(280, 55, 280, 210, 1.3) +
    path('M280,100 Q160,70 100,45', 1) +
    path('M280,90 Q400,55 460,35', 1) +
    path('M280,130 Q170,105 130,85', 0.8, 0.5) +
    path('M280,120 Q390,95 440,75', 0.8, 0.5) +
    dim('M280,210 L180,250 M280,210 L230,255 M280,210 L330,255 M280,210 L380,250')
  )
}

function drawFogPath() {
  return (
    path('M15,195 Q170,165 280,150 T520,95', 1.2) +
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<ellipse cx="${240 + i * 45}" cy="${105 + (i % 2) * 12}" rx="38" ry="12" stroke="rgba(200,200,200,0.15)" stroke-width="0.7"/>`,
      )
      .join('') +
    glow(490, 88, 14, 1)
  )
}

const art = {
  'steady-river': drawSteadyRiver,

  'wind-leaf': drawWindLeaf,

  'mountain-guard': drawMountainGuard,

  'star-explorer': () =>
    [[120, 75], [220, 45], [340, 80], [430, 55]]
      .map(([x, y]) => glow(x, y, 12, 0.95))
      .join('') +
    path('M120,75 L220,45 L340,80 L430,55', 0.8, 0.35) +
    path('M340,80 Q400,130 480,200', 1.1),

  'deep-root-tree': drawDeepRootTree,

  'fog-path': drawFogPath,

  'star-guide': () =>
    [[90, 155], [200, 95], [310, 72], [450, 115]]
      .map(([x, y], i, arr) => {
        const next = arr[i + 1]
        let s = glow(x, y, 10, 0.95)
        if (next) s += line(x, y, next[0], next[1], 0.9, 0.45)
        return s
      })
      .join(''),

  'drift-boat': () =>
    dim('M0,165 Q280,155 560,170') +
    dim('M0,178 Q280,168 560,183') +
    path('M210,160 Q280,145 350,160', 1.1) +
    line(265, 160, 280, 115, 0.9) +
    path('M280,115 L295,160', 0.9),

  'warm-hands': () =>
    glow(280, 130, 50, 0.5) +
    path('M155,165 Q200,105 250,155', 1.1) +
    path('M405,165 Q360,105 310,155', 1.1) +
    `<ellipse cx="280" cy="130" rx="55" ry="22" stroke="rgba(200,200,200,0.2)" stroke-width="0.8"/>`,

  shield: () =>
    glow(280, 130, 45) +
    path('M280,45 L390,95 L390,170 Q280,230 170,170 L170,95 Z', 1.2) +
    `<ellipse cx="280" cy="135" rx="28" ry="34" stroke="rgba(180,180,180,0.25)" stroke-width="0.8"/>`,

  'silk-bridge': () =>
    path('M40,175 Q280,55 520,175', 1.2) +
    dim('M40,182 Q280,65 520,182') +
    line(40, 175, 40, 220, 0.7, 0.35) +
    line(520, 175, 520, 220, 0.7, 0.35) +
    line(25, 220, 55, 220, 0.5, 0.3) +
    line(505, 220, 535, 220, 0.5, 0.3),

  'stars-gaze': () =>
    glow(155, 105, 14, 1) +
    glow(405, 105, 14, 1) +
    path('M155,105 Q280,75 405,105', 0.7, 0.3),

  'balance-boat': () =>
    dim('M0,160 Q280,150 560,165') +
    path('M175,160 Q280,140 385,160', 1.1) +
    line(280, 140, 280, 85, 0.9) +
    line(250, 95, 310, 95, 0.6, 0.35),

  'cautious-mountain': () =>
    drawMountainGuard() +
    line(70, 220, 490, 220, 1, 0.45) +
    `<rect x="70" y="220" width="420" height="22" fill="white" opacity="0.04"/>`,

  'flexible-wind': () =>
    drawWindLeaf() +
    [0, 1, 2]
      .map((i) =>
        dim(
          `M${20 + i * 12},${95 + i * 18} Q220,${70 + i * 12} 520,${105 + i * 15}`,
        ),
      )
      .join(''),

  'sensing-river': () =>
    drawSteadyRiver() +
    glow(195, 155, 28, 0.4) +
    `<path d="M195,155 m-22,0 a22,22 0 1,0 44,0" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>`,

  'still-lake': () =>
    `<ellipse cx="280" cy="175" rx="200" ry="32" stroke="rgba(245,240,232,0.7)" stroke-width="0.9"/>` +
    dim('M280,175 m-180,0 a180,22 0 1,0 360,0') +
    [[190, 75], [280, 55], [370, 75], [230, 85], [330, 78]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="white" opacity="0.85"/>`)
      .join('') +
    glow(280, 175, 35, 0.25),

  'soft-candle': () =>
    glow(280, 95, 45, 0.55) +
    `<rect x="265" y="115" width="30" height="85" fill="#1a1a1a" stroke="rgba(200,200,200,0.35)" stroke-width="0.8"/>` +
    path('M280,115 Q265,90 280,70 Q295,90 280,115', 1) +
    `<ellipse cx="280" cy="105" rx="14" ry="24" fill="white" opacity="0.18"/>`,

  'guardian-tree': () =>
    line(280, 60, 280, 210, 1.2) +
    `<circle cx="280" cy="120" r="38" stroke="rgba(200,200,200,0.22)" stroke-width="0.8"/>` +
    dim('M280,120 m-26,0 a26,26 0 1,0 52,0') +
    glow(280, 120, 40, 0.2),

  'wind-leaf-emotion': () =>
    drawWindLeaf() +
    [0, 1, 2, 3, 4]
      .map((i) => {
        const x = 110 + i * 70
        return `<g transform="translate(${x},${150 + Math.sin(i) * 8}) rotate(${12 + i * 18})"><path d="M0,0 Q8,-12 16,0" stroke="rgba(200,200,200,${0.18 + i * 0.03})" stroke-width="0.7"/></g>`
      })
      .join(''),

  'bloom-tree': () =>
    drawDeepRootTree() +
    [[195, 70], [365, 55], [390, 100], [170, 95]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" stroke="rgba(245,240,232,0.45)" stroke-width="0.7"/>`)
      .join(''),

  'stable-mountain': () =>
    drawMountainGuard() + line(55, 220, 505, 220, 1.1, 0.5),

  'wind-cloud': () =>
    `<ellipse cx="230" cy="105" rx="52" ry="18" stroke="rgba(245,240,232,0.55)" stroke-width="0.9"/>` +
    `<ellipse cx="290" cy="100" rx="40" ry="15" stroke="rgba(245,240,232,0.45)" stroke-width="0.8"/>` +
    `<ellipse cx="350" cy="108" rx="48" ry="17" stroke="rgba(200,200,200,0.3)" stroke-width="0.7"/>` +
    dim('M20,75 Q220,55 420,70'),

  'seed-awakening': () =>
    glow(280, 155, 35) +
    `<ellipse cx="280" cy="170" rx="22" ry="12" stroke="rgba(245,240,232,0.75)" stroke-width="0.9"/>` +
    path('M280,162 Q265,120 255,85', 1.1) +
    path('M255,85 Q275,75 290,88', 0.7, 0.4) +
    line(195, 230, 365, 230, 0.5, 0.22),

  'resonance-light': () =>
    glow(155, 130, 12, 1) +
    glow(405, 130, 12, 1) +
    path('M155,130 Q280,85 405,130', 1) +
    line(280, 85, 280, 210, 0.6, 0.25),

  'seeking-lamp': () =>
    glow(280, 85, 48, 0.5) +
    line(280, 210, 280, 105, 1) +
    `<circle cx="280" cy="82" r="16" stroke="rgba(245,240,232,0.85)" stroke-width="1"/>` +
    `<circle cx="280" cy="82" r="9" fill="white" opacity="0.2"/>` +
    dim('M80,165 Q280,140 480,165'),

  'steady-path': () =>
    path('M50,200 Q170,155 280,130 T490,65', 1.3) +
    glow(170, 155, 5, 0.7) +
    glow(280, 130, 5, 0.7) +
    glow(490, 65, 5, 0.7) +
    line(50, 215, 510, 215, 0.5, 0.2),

  'fog-walk': () =>
    drawFogPath() +
    glow(268, 145, 5, 0.9) +
    line(268, 145, 268, 175, 0.7, 0.4) +
    line(250, 175, 286, 175, 0.7, 0.4),
}

mkdirSync(OUT, { recursive: true })

for (const id of PATTERNS) {
  const body = art[id]?.() ?? `<circle cx="280" cy="140" r="40" stroke="rgba(200,200,200,0.3)"/>`
  writeFileSync(join(OUT, `${id}.svg`), wrap(id, body))
  console.log(`✓ ${id}.svg`)
}

console.log(`\nGenerated ${PATTERNS.length} card images in public/cards/`)
