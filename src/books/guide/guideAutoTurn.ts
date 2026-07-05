/** Dwell timing + preference for 序卷《同观》auto turn only — not used by the six volumes. */
import {
  getGuideIllustrationDurationMs,
  getGuideIllustrationMotion,
  GUIDE_ILLUSTRATION_HOLD_MS,
} from './illustrationMotion'
import type { GuidePageBlock, GuideSpread } from './types'

const GUIDE_AUTO_TURN_KEY = 'psyche-guide-auto-turn'

/** Pause after page turn before auto-turn dwell (content shows when flip ends). */
export const GUIDE_POST_FLIP_SETTLE_MS = 520
export const GUIDE_POST_FLIP_SETTLE_REDUCED_MS = 240

export function getGuideAutoTurnEnabled(): boolean {
  if (typeof localStorage === 'undefined') return true
  return localStorage.getItem(GUIDE_AUTO_TURN_KEY) !== 'off'
}

export function saveGuideAutoTurnEnabled(enabled: boolean): void {
  localStorage.setItem(GUIDE_AUTO_TURN_KEY, enabled ? 'on' : 'off')
}

export function spreadHasIllustration(spread: GuideSpread): boolean {
  return [...spread.left, ...spread.right].some((block) => block.kind === 'illustration')
}

export function getSpreadIllustrationId(spread: GuideSpread): string | undefined {
  for (const block of [...spread.left, ...spread.right]) {
    if (block.kind === 'illustration') return block.id
  }
  return undefined
}

function blockText(block: GuidePageBlock): string {
  switch (block.kind) {
    case 'part':
    case 'shoreQuestion':
    case 'pause':
      return block.text
    case 'hook':
    case 'phenomenon':
    case 'turn':
    case 'shoreView':
    case 'breath':
    case 'volumeMeaning':
    case 'close':
    case 'lines':
      return block.lines.join('')
    case 'tongguanEast':
    case 'tongguanModern':
      return `${block.quote.source}${block.quote.text}`
    case 'illustration':
      return ''
    default:
      return ''
  }
}

function spreadText(spread: GuideSpread): string {
  const blocks = [...spread.left, ...spread.right]
  const footer = blocks.flatMap((block) =>
    block.kind === 'tongguanModern' ? block.footer : [],
  )
  return [...blocks.map(blockText), ...footer].join('')
}

function isRestSpread(spread: GuideSpread): boolean {
  const blocks = [...spread.left, ...spread.right]
  return blocks.length > 0 && blocks.every((block) => block.kind === 'pause')
}

export function estimateGuideSpreadDwellMs(
  spread: GuideSpread,
  options: { reducedMotion?: boolean } = {},
): number {
  if (spreadHasIllustration(spread)) {
    const id = getSpreadIllustrationId(spread)
    if (options.reducedMotion) return 3200
    if (id) {
      const motion = getGuideIllustrationMotion(id)
      return motion.durationMs + motion.holdMs
    }
    return getGuideIllustrationDurationMs('01-shore-near') + GUIDE_ILLUSTRATION_HOLD_MS
  }

  if (isRestSpread(spread)) {
    return options.reducedMotion ? 2400 : 3600
  }

  const text = spreadText(spread).replace(/\s/g, '')
  if (text.length === 0) {
    return 4200
  }

  const perCharMs = options.reducedMotion ? 220 : 340
  const baseMs = options.reducedMotion ? 3600 : 4800
  const estimated = baseMs + text.length * perCharMs
  return Math.min(options.reducedMotion ? 9000 : 18000, Math.max(5200, estimated))
}

export { GUIDE_ILLUSTRATION_HOLD_MS }
