/** Per-illustration motion presets for 序卷《同观》— keep img keyframe names in sync with index.css. */
export type GuideIllustrationVariant =
  | 'walk-in-mist'
  | 'facets-unfold'
  | 'still-breathe'
  | 'flow-drift'
  | 'mist-embrace'

export interface GuideIllustrationMotion {
  variant: GuideIllustrationVariant
  durationS: number
  durationMs: number
  /** Fraction of duration for mist overlay lift (0 = skip mist layer). */
  mistRatio: number
  /** Pause after motion before auto turn. */
  holdMs: number
}

export const GUIDE_ILLUSTRATION_IMG_ANIMATIONS: Record<GuideIllustrationVariant, string> =
  {
    'walk-in-mist': 'guide-illustration-walk-in',
    'facets-unfold': 'guide-illustration-facets-unfold',
    'still-breathe': 'guide-illustration-still-breathe',
    'flow-drift': 'guide-illustration-flow-drift',
    'mist-embrace': 'guide-illustration-mist-embrace',
  }

const MOTIONS: Record<string, GuideIllustrationMotion> = {
  /** 岸尚未远 — step toward shore, mist lifts */
  '01-shore-near': {
    variant: 'walk-in-mist',
    durationS: 5.5,
    durationMs: 5500,
    mistRatio: 0.68,
    holdMs: 2000,
  },
  /** 六卷各照一面 — unfold from center like facets opening */
  '02-six-facets': {
    variant: 'facets-unfold',
    durationS: 5,
    durationMs: 5000,
    mistRatio: 0.55,
    holdMs: 2000,
  },
  /** 此息停 — barely moves, breath-like fade */
  '03-still-pause': {
    variant: 'still-breathe',
    durationS: 4,
    durationMs: 4000,
    mistRatio: 0,
    holdMs: 2400,
  },
  /** 名在流中 — horizontal drift, names in flow */
  '04-name-in-flow': {
    variant: 'flow-drift',
    durationS: 5,
    durationMs: 5000,
    mistRatio: 0.6,
    holdMs: 2000,
  },
  /** 入雾 — mist gathers then releases the figure */
  '05-enter-mist': {
    variant: 'mist-embrace',
    durationS: 6,
    durationMs: 6000,
    mistRatio: 0.82,
    holdMs: 2200,
  },
}

const DEFAULT_MOTION: GuideIllustrationMotion = MOTIONS['01-shore-near']

/** @deprecated Use getGuideIllustrationMotion(id).durationMs */
export const GUIDE_ILLUSTRATION_DURATION_S = DEFAULT_MOTION.durationS
/** @deprecated Use getGuideIllustrationMotion(id).durationMs */
export const GUIDE_ILLUSTRATION_DURATION_MS = DEFAULT_MOTION.durationMs
/** @deprecated Use getGuideIllustrationMotion(id).holdMs */
export const GUIDE_ILLUSTRATION_HOLD_MS = DEFAULT_MOTION.holdMs
/** @deprecated Use getGuideIllustrationMotion(id).mistRatio */
export const GUIDE_ILLUSTRATION_MIST_RATIO = DEFAULT_MOTION.mistRatio

export function getGuideIllustrationMotion(id: string): GuideIllustrationMotion {
  return MOTIONS[id] ?? DEFAULT_MOTION
}

export function getGuideIllustrationDurationMs(id: string): number {
  return getGuideIllustrationMotion(id).durationMs
}

export function getGuideIllustrationHoldMs(id: string): number {
  return getGuideIllustrationMotion(id).holdMs
}
