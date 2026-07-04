/** Procedural cinematic B&W card art — one unique rich scene per pattern */

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function rnd(pattern, salt = 0) {
  const x = Math.sin(hash(`${pattern}-${salt}`) * 0.0001) * 10000
  return x - Math.floor(x)
}

export function defs(id, pattern) {
  const s = hash(pattern) % 997
  return `
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020202"/>
      <stop offset="45%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#141414"/>
    </linearGradient>
    <radialGradient id="beam-${id}" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="40%" stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="35%" stop-color="#fff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.65"/>
    </linearGradient>
    <filter id="blur-${id}"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="mist-${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="${s}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0"/>
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <filter id="water-${id}">
      <feTurbulence type="turbulence" baseFrequency="0.02 0.06" numOctaves="3" seed="${s + 3}" result="w"/>
      <feColorMatrix in="w" type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0.25 0"/>
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>`
}

export function atmosphere(id, pattern, W, H) {
  const mistY = H * 0.62
  return `
  ${defs(id, pattern)}
  <rect width="${W}" height="${H}" fill="url(#sky-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#beam-${id})"/>
  <rect x="${W * 0.32}" y="0" width="${W * 0.36}" height="${H}" fill="url(#beam-${id})" opacity="0.7"/>
  <rect width="${W}" height="${H}" filter="url(#mist-${id})" opacity="0.55"/>
  <ellipse cx="${W / 2}" cy="${H * 0.92}" rx="${W * 0.48}" ry="${H * 0.18}" fill="#fff" opacity="0.06"/>
  <rect width="${W}" height="${H}" fill="url(#fade-${id})"/>`
}

export function stars(W, H, pattern, count = 40) {
  let s = ''
  for (let i = 0; i < count; i++) {
    const x = rnd(pattern, i) * W
    const y = rnd(pattern, i + 50) * H * 0.55
    const r = 0.4 + rnd(pattern, i + 100) * 1.8
    const o = 0.25 + rnd(pattern, i + 150) * 0.65
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${o.toFixed(2)}"/>`
  }
  return s
}

export function layeredMountains(W, H, pattern, layers = 4) {
  let s = ''
  for (let i = 0; i < layers; i++) {
    const y = H * (0.38 + i * 0.08)
    const o = 0.15 + i * 0.12
    const pts = []
    const steps = 8
    for (let j = 0; j <= steps; j++) {
      const x = (j / steps) * W
      const peak = Math.sin((j / steps) * Math.PI * (1.5 + rnd(pattern, i * 10 + j))) * H * (0.12 - i * 0.015)
      const yj = y + peak + rnd(pattern, i * 20 + j) * H * 0.04
      pts.push(`${x.toFixed(0)},${yj.toFixed(0)}`)
    }
    s += `<polygon points="${pts.join(' ')} ${W},${H} 0,${H}" fill="#fff" opacity="${o.toFixed(2)}"/>`
  }
  return s
}

export function waterBand(W, H, y, pattern, waves = 12) {
  let s = `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="#080808"/>`
  for (let i = 0; i < waves; i++) {
    const wy = y + 8 + i * ((H - y) / waves)
    const o = 0.08 + (i / waves) * 0.2
    s += `<path d="M0,${wy} Q${W * 0.25},${wy - 6 + rnd(pattern, i) * 12} ${W * 0.5},${wy} T${W},${wy + rnd(pattern, i + 30) * 8}" fill="none" stroke="#fff" stroke-width="${(0.4 + rnd(pattern, i) * 0.8).toFixed(1)}" opacity="${o.toFixed(2)}"/>`
  }
  s += `<rect x="0" y="${y}" width="${W}" height="${H - y}" filter="url(#water-${pattern})" opacity="0.4"/>`
  return s
}

export function figure(x, y, scale, glow = true) {
  const s = scale
  const g = glow
    ? `<ellipse cx="${x}" cy="${y - 18 * s}" rx="${14 * s}" ry="${20 * s}" fill="url(#glow-fig)"/>`
    : ''
  return (
    g +
    `<ellipse cx="${x}" cy="${y - 16 * s}" rx="${5 * s}" ry="${6 * s}" fill="#ddd" opacity="0.85"/>` +
    `<path d="M${x - 5 * s},${y - 6 * s} Q${x},${y + 8 * s} ${x + 5 * s},${y - 6 * s}" fill="#ccc" opacity="0.75"/>`
  )
}

const SCENES = {
  'steady-river': (W, H, p) =>
    layeredMountains(W, H, p, 3) +
    waterBand(W, H, H * 0.58, p, 14) +
    `<path d="M0,${H * 0.62} Q${W * 0.3},${H * 0.55} ${W * 0.55},${H * 0.6} T${W},${H * 0.52}" stroke="#fff" stroke-width="2" opacity="0.35" fill="none"/>` +
    `<circle cx="${W * 0.55}" cy="${H * 0.58}" r="18" fill="#fff" opacity="0.08"/>`,

  'wind-leaf': (W, H, p) =>
    `<path d="M${W * 0.35},${H * 0.35} Q${W * 0.42},${H * 0.18} ${W * 0.58},${H * 0.32} Q${W * 0.48},${H * 0.48} ${W * 0.35},${H * 0.35} Z" fill="#bbb" opacity="0.55" stroke="#fff" stroke-width="0.8"/>` +
    [0, 1, 2, 3, 4]
      .map(
        (i) =>
          `<path d="M${W * 0.2 + i * 30},${H * 0.25} Q${W * 0.35 + i * 20},${H * 0.15} ${W * 0.5 + i * 25},${H * 0.28}" stroke="#fff" stroke-width="0.5" opacity="${0.12 + i * 0.04}" fill="none"/>`,
      )
      .join(''),

  'mountain-guard': (W, H, p) =>
    layeredMountains(W, H, p, 5) +
    `<polygon points="${W * 0.35},${H * 0.72} ${W * 0.5},${H * 0.22} ${W * 0.65},${H * 0.72}" fill="#fff" opacity="0.35"/>` +
    figure(W * 0.5, H * 0.68, 1.2),

  'star-explorer': (W, H, p) =>
    stars(W, H, p, 55) +
    waterBand(W, H, H * 0.72, p, 6) +
    figure(W * 0.45, H * 0.78, 0.85) +
    `<ellipse cx="${W * 0.45}" cy="${H * 0.82}" rx="30" ry="4" fill="#fff" opacity="0.12"/>`,

  'deep-root-tree': (W, H, p) =>
    `<path d="M${W * 0.5},${H * 0.15} Q${W * 0.35},${H * 0.35} ${W * 0.42},${H * 0.55} Q${W * 0.48},${H * 0.75} ${W * 0.5},${H * 0.88}" stroke="#aaa" stroke-width="3" fill="none" opacity="0.6"/>` +
    `<path d="M${W * 0.5},${H * 0.88} L${W * 0.35},${H * 0.95} M${W * 0.5},${H * 0.88} L${W * 0.42},${H * 0.98} M${W * 0.5},${H * 0.88} L${W * 0.58},${H * 0.98} M${W * 0.5},${H * 0.88} L${W * 0.65},${H * 0.95}" stroke="#888" stroke-width="1.2" opacity="0.45"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.28}" rx="85" ry="45" fill="#fff" opacity="0.08"/>`,

  'fog-path': (W, H, p) =>
    `<path d="M${W * 0.48},${H * 0.95} Q${W * 0.46},${H * 0.6} ${W * 0.5},${H * 0.35} Q${W * 0.54},${H * 0.15} ${W * 0.52},${H * 0.05}" stroke="#666" stroke-width="18" opacity="0.25" stroke-linecap="round"/>` +
    `<circle cx="${W * 0.52}" cy="${H * 0.12}" r="25" fill="url(#glow-${p})" opacity="0.8"/>` +
    figure(W * 0.48, H * 0.82, 0.7),

  'star-guide': (W, H, p) =>
    stars(W, H, p, 35) +
    `<path d="M${W * 0.15},${H * 0.35} L${W * 0.35},${H * 0.28} L${W * 0.55},${H * 0.22} L${W * 0.78},${H * 0.3}" stroke="#fff" stroke-width="0.8" opacity="0.4" fill="none"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.75}" rx="120" ry="18" fill="#fff" opacity="0.06"/>`,

  'drift-boat': (W, H, p) =>
    waterBand(W, H, H * 0.55, p, 16) +
    `<path d="M${W * 0.32},${H * 0.58} Q${W * 0.45},${H * 0.52} ${W * 0.58},${H * 0.58} L${W * 0.55},${H * 0.64} L${W * 0.35},${H * 0.64} Z" fill="#ccc" opacity="0.5"/>` +
    `<path d="M${W * 0.32},${H * 0.58} Q${W * 0.45},${H * 0.52} ${W * 0.58},${H * 0.58}" stroke="#fff" stroke-width="0.6" opacity="0.3" transform="translate(0,12) scale(1,-0.35)" transform-origin="${W * 0.45} ${H * 0.6}"/>`,

  'warm-hands': (W, H) =>
    `<path d="M${W * 0.28},${H * 0.55} C${W * 0.32},${H * 0.35} ${W * 0.38},${H * 0.32} ${W * 0.42},${H * 0.48} C${W * 0.44},${H * 0.58} ${W * 0.36},${H * 0.62} ${W * 0.28},${H * 0.55} Z" fill="#bbb" opacity="0.65"/>` +
    `<path d="M${W * 0.72},${H * 0.55} C${W * 0.68},${H * 0.35} ${W * 0.62},${H * 0.32} ${W * 0.58},${H * 0.48} C${W * 0.56},${H * 0.58} ${W * 0.64},${H * 0.62} ${W * 0.72},${H * 0.55} Z" fill="#bbb" opacity="0.65"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.48}" rx="55" ry="35" fill="#fff" opacity="0.1"/>`,

  shield: (W, H) =>
    `<path d="M${W * 0.5},${H * 0.18} L${W * 0.68},${H * 0.32} L${W * 0.68},${H * 0.58} Q${W * 0.5},${H * 0.78} ${W * 0.32},${H * 0.58} L${W * 0.32},${H * 0.32} Z" fill="#888" opacity="0.35" stroke="#fff" stroke-width="1.2"/>` +
    waterBand(W, H, H * 0.72, 'shield', 5),

  'silk-bridge': (W, H, p) =>
    `<path d="M${W * 0.08},${H * 0.65} Q${W * 0.5},${H * 0.22} ${W * 0.92},${H * 0.65}" stroke="#fff" stroke-width="1.5" opacity="0.55" fill="none"/>` +
    `<path d="M${W * 0.08},${H * 0.72} Q${W * 0.5},${H * 0.28} ${W * 0.92},${H * 0.72}" stroke="#aaa" stroke-width="0.8" opacity="0.3" fill="none"/>` +
    layeredMountains(W, H, p, 2),

  'stars-gaze': (W, H, p) =>
    stars(W, H, p, 30) +
    figure(W * 0.28, H * 0.55, 0.6) +
    figure(W * 0.72, H * 0.55, 0.6) +
    `<path d="M${W * 0.28},${H * 0.42} Q${W * 0.5},${H * 0.32} ${W * 0.72},${H * 0.42}" stroke="#fff" stroke-width="0.6" opacity="0.25" stroke-dasharray="4 6"/>`,

  'balance-boat': (W, H, p) =>
    waterBand(W, H, H * 0.52, p, 20) +
    `<path d="M${W * 0.38},${H * 0.54} Q${W * 0.5},${H * 0.5} ${W * 0.62},${H * 0.54} L${W * 0.6},${H * 0.58} L${W * 0.4},${H * 0.58} Z" fill="#ddd" opacity="0.45"/>` +
    `<line x1="${W * 0.5}" y1="${H * 0.52}" x2="${W * 0.5}" y2="${H * 0.38}" stroke="#fff" stroke-width="0.8" opacity="0.5"/>`,

  'cautious-mountain': (W, H, p) =>
    `<polygon points="${W * 0.25},${H * 0.75} ${W * 0.5},${H * 0.2} ${W * 0.75},${H * 0.75}" fill="#fff" opacity="0.28"/>` +
    `<rect x="${W * 0.2}" y="${H * 0.72}" width="${W * 0.6}" height="${H * 0.08}" fill="#fff" opacity="0.12"/>` +
    figure(W * 0.42, H * 0.68, 0.55),

  'flexible-wind': (W, H, p) =>
    [0, 1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<path d="M0,${H * 0.45 + i * 12} Q${W * 0.4},${H * 0.35 + i * 8} ${W},${H * 0.42 + i * 10}" stroke="#fff" stroke-width="${0.5 + i * 0.15}" opacity="${0.15 + i * 0.05}" fill="none"/>`,
      )
      .join('') +
    `<path d="M${W * 0.55},${H * 0.4} Q${W * 0.62},${H * 0.25} ${W * 0.7},${H * 0.38} Q${W * 0.58},${H * 0.42} ${W * 0.55},${H * 0.4} Z" fill="#bbb" opacity="0.4"/>`,

  'sensing-river': (W, H, p) =>
    waterBand(W, H, H * 0.52, p, 10) +
    figure(W * 0.52, H * 0.58, 0.75) +
    `<ellipse cx="${W * 0.52}" cy="${H * 0.62}" rx="35" ry="8" fill="#fff" opacity="0.08"/>`,

  'still-lake': (W, H, p) =>
    stars(W, H, p, 25) +
    layeredMountains(W, H, p, 3) +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.68}" rx="${W * 0.42}" ry="${H * 0.12}" fill="#fff" fill-opacity="0.08" stroke="#fff" stroke-width="0.6" stroke-opacity="0.35"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.68}" rx="${W * 0.42}" ry="${H * 0.12}" transform="scale(1,-0.35)" transform-origin="${W * 0.5} ${H * 0.68}" fill="#fff" opacity="0.04"/>`,

  'soft-candle': (W, H) =>
    `<rect x="${W * 0.46}" y="${H * 0.45}" width="${W * 0.08}" height="${H * 0.35}" fill="#888" opacity="0.5" rx="2"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.38}" rx="12" ry="22" fill="#fff" opacity="0.35"/>` +
    `<path d="M${W * 0.5},${H * 0.45} Q${W * 0.46},${H * 0.32} ${W * 0.5},${H * 0.22} Q${W * 0.54},${H * 0.32} ${W * 0.5},${H * 0.45} Z" fill="#eee" opacity="0.7"/>`,

  'guardian-tree': (W, H) =>
    `<path d="M${W * 0.5},${H * 0.12} L${W * 0.62},${H * 0.85} Q${W * 0.5},${H * 0.92} ${W * 0.38},${H * 0.85} Z" fill="#777" opacity="0.35"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.35}" rx="70" ry="40" fill="#fff" opacity="0.06"/>` +
    figure(W * 0.5, H * 0.62, 0.5, false),

  'wind-leaf-emotion': (W, H, p) =>
    [0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const x = W * 0.25 + rnd(p, i) * W * 0.5
        const y = H * 0.25 + rnd(p, i + 10) * H * 0.4
        const rot = -30 + rnd(p, i + 20) * 60
        return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M0,0 Q6,-14 14,0 Q6,8 0,0 Z" fill="#bbb" opacity="${0.25 + rnd(p, i) * 0.35}"/></g>`
      })
      .join(''),

  'bloom-tree': (W, H, p) =>
    `<path d="M${W * 0.5},${H * 0.2} L${W * 0.52},${H * 0.82}" stroke="#999" stroke-width="2.5" opacity="0.5"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const a = (i / 8) * Math.PI * 2
        const cx = W * 0.5 + Math.cos(a) * 55
        const cy = H * 0.32 + Math.sin(a) * 35
        return `<circle cx="${cx}" cy="${cy}" r="${6 + rnd(p, i) * 4}" fill="#fff" opacity="${0.2 + rnd(p, i + 5) * 0.25}"/>`
      })
      .join(''),

  'stable-mountain': (W, H, p) =>
    `<polygon points="${W * 0.15},${H * 0.78} ${W * 0.5},${H * 0.25} ${W * 0.85},${H * 0.78}" fill="#fff" opacity="0.32"/>` +
    `<line x1="0" y1="${H * 0.78}" x2="${W}" y2="${H * 0.78}" stroke="#fff" stroke-width="0.8" opacity="0.35"/>` +
    figure(W * 0.5, H * 0.74, 0.5),

  'wind-cloud': (W, H, p) =>
    [0, 1, 2]
      .map(
        (i) =>
          `<ellipse cx="${W * (0.35 + i * 0.15)}" cy="${H * (0.35 + i * 0.08)}" rx="${60 + i * 15}" ry="${18 + i * 5}" fill="#fff" opacity="${0.12 + i * 0.06}" filter="url(#blur-${p})"/>`,
      )
      .join('') +
    layeredMountains(W, H, p, 2),

  'seed-awakening': (W, H) =>
    `<ellipse cx="${W * 0.5}" cy="${H * 0.72}" rx="45" ry="12" fill="#666" opacity="0.4"/>` +
    `<path d="M${W * 0.5},${H * 0.68} Q${W * 0.46},${H * 0.45} ${W * 0.48},${H * 0.28} Q${W * 0.52},${H * 0.25} ${W * 0.54},${H * 0.3}" stroke="#ccc" stroke-width="1.5" fill="none" opacity="0.65"/>` +
    `<path d="M${W * 0.48},${H * 0.28} Q${W * 0.55},${H * 0.22} ${W * 0.58},${H * 0.32}" stroke="#aaa" stroke-width="0.8" fill="none" opacity="0.5"/>`,

  'resonance-light': (W, H, p) =>
    `<circle cx="${W * 0.32}" cy="${H * 0.48}" r="22" fill="#fff" opacity="0.35"/>` +
    `<circle cx="${W * 0.68}" cy="${H * 0.48}" r="22" fill="#fff" opacity="0.35"/>` +
    [0, 1, 2, 3, 4]
      .map(
        (i) =>
          `<ellipse cx="${W * 0.5}" cy="${H * 0.48}" rx="${30 + i * 18}" ry="${8 + i * 4}" fill="none" stroke="#fff" stroke-width="0.5" opacity="${0.35 - i * 0.05}"/>`,
      )
      .join(''),

  'seeking-lamp': (W, H) =>
    `<line x1="${W * 0.5}" y1="${H * 0.85}" x2="${W * 0.5}" y2="${H * 0.42}" stroke="#aaa" stroke-width="1.2" opacity="0.5"/>` +
    `<circle cx="${W * 0.5}" cy="${H * 0.38}" r="20" stroke="#fff" stroke-width="1.2" fill="#fff" opacity="0.15"/>` +
    `<polygon points="${W * 0.5},${H * 0.15} ${W * 0.72},${H * 0.55} ${W * 0.28},${H * 0.55}" fill="#fff" opacity="0.06"/>`,

  'steady-path': (W, H, p) =>
    `<path d="M${W * 0.46},${H * 0.95} L${W * 0.48},${H * 0.15}" stroke="#555" stroke-width="22" opacity="0.2" stroke-linecap="round"/>` +
    [0, 1, 2, 3, 4]
      .map(
        (i) =>
          `<ellipse cx="${W * (0.35 + rnd(p, i) * 0.06)}" cy="${H * (0.25 + i * 0.12)}" rx="8" ry="25" fill="#fff" opacity="0.05"/>`,
      )
      .join('') +
    `<circle cx="${W * 0.48}" cy="${H * 0.12}" r="12" fill="#fff" opacity="0.25"/>`,

  'fog-walk': (W, H, p) =>
    waterBand(W, H, H * 0.7, p, 4) +
    figure(W * 0.48, H * 0.62, 1) +
    `<ellipse cx="${W * 0.48}" cy="${H * 0.68}" rx="22" ry="3" fill="#fff" opacity="0.15"/>`,

  'gushing-spring': (W, H, p) =>
    layeredMountains(W, H, p, 2) +
    `<path d="M${W * 0.5},${H * 0.25} Q${W * 0.48},${H * 0.55} ${W * 0.5},${H * 0.75}" stroke="#fff" stroke-width="2.5" opacity="0.45" fill="none"/>` +
    `<ellipse cx="${W * 0.5}" cy="${H * 0.78}" rx="35" ry="10" fill="#fff" opacity="0.12"/>` +
    [0, 1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<line x1="${W * 0.5 + (i - 2.5) * 8}" y1="${H * 0.55}" x2="${W * 0.5 + (i - 2.5) * 14}" y2="${H * 0.35 + rnd(p, i) * 20}" stroke="#fff" stroke-width="0.6" opacity="0.25"/>`,
      )
      .join(''),

  'wind-ripple': (W, H, p) =>
    waterBand(W, H, H * 0.45, p, 18) +
    [0, 1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<ellipse cx="${W * 0.5}" cy="${H * 0.58}" rx="${20 + i * 28}" ry="${4 + i * 2}" fill="none" stroke="#fff" stroke-width="0.6" opacity="${0.45 - i * 0.06}"/>`,
      )
      .join(''),

  'torrent-river': (W, H, p) =>
    `<path d="M${W * 0.15},${H * 0.35} L${W * 0.85},${H * 0.35} L${W * 0.75},${H * 0.85} L${W * 0.25},${H * 0.85} Z" fill="#111" opacity="0.8"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map(
        (i) =>
          `<path d="M${W * 0.2 + i * 8},${H * 0.38} Q${W * 0.35 + i * 5},${H * (0.5 + rnd(p, i) * 0.2)} ${W * 0.5 + i * 4},${H * 0.82}" stroke="#fff" stroke-width="${1 + rnd(p, i) * 1.5}" opacity="${0.2 + rnd(p, i + 8) * 0.25}" fill="none"/>`,
      )
      .join(''),
}

export function renderCardSvg(pattern, W = 560, H = 280) {
  const draw = SCENES[pattern] ?? SCENES['fog-path']
  const body = draw(W, H, pattern)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow-fig" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${atmosphere(pattern, pattern, W, H)}
  <g>${body}</g>
</svg>`
}

export const PATTERNS = Object.keys(SCENES)
