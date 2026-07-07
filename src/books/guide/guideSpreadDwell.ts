/** Image / breath dwell timings — shared by reading phase + auto-turn. */
import { getGuideIllustrationMotion } from './illustrationMotion'
import type { GuidePageBlock } from './types'

/** Pause between left page text and right page text — legacy; superseded by crossRight cue. */
export const SPREAD_SIDE_GAP_MS = 360

/** 左页读毕 → 移目右页的引导停息（含动画时长） */
const CROSS_RIGHT_CUE_MS = 1080
const CROSS_RIGHT_CUE_REDUCED_MS = 560

/** Left motif-only page — brief inhale before the eye moves right. */
const LEFT_BREATH_MS = 1400
const LEFT_BREATH_REDUCED_MS = 720

/** Right motif-only page — 展页左页读毕，右页留白吸气。 */
const MOTIF_INHALE_MS = 2000
const MOTIF_INHALE_REDUCED_MS = 1050

/** Pure image page (companion / ghost / portal preview) — linger on the picture. */
const SLOT_VIEW_MS = 2600
const SLOT_VIEW_REDUCED_MS = 1400

const HERO_VIEW_REDUCED_MS = 3200

function blockIllustrationId(blocks: readonly GuidePageBlock[]): string | undefined {
  for (const block of blocks) {
    if (block.kind === 'illustration') return block.id
    if (block.kind === 'visualPanel') return block.illustrationId
  }
  return undefined
}

export function illustrationSideDwellMs(
  blocks: readonly GuidePageBlock[],
  reducedMotion: boolean,
): number {
  const id = blockIllustrationId(blocks)
  if (!id) return 0

  const motion = getGuideIllustrationMotion(id)
  const isHero = blocks.some(
    (block) => block.kind === 'illustration' && (block.tone ?? 'hero') === 'hero',
  )

  if (reducedMotion) {
    return isHero ? HERO_VIEW_REDUCED_MS : SLOT_VIEW_REDUCED_MS
  }

  if (isHero) {
    return motion.durationMs + motion.holdMs
  }

  return SLOT_VIEW_MS
}

export function leftBreathDwellMs(reducedMotion: boolean): number {
  return reducedMotion ? LEFT_BREATH_REDUCED_MS : LEFT_BREATH_MS
}

export function motifInhaleDwellMs(reducedMotion: boolean): number {
  return reducedMotion ? MOTIF_INHALE_REDUCED_MS : MOTIF_INHALE_MS
}

export function crossRightCueMs(reducedMotion: boolean): number {
  return reducedMotion ? CROSS_RIGHT_CUE_REDUCED_MS : CROSS_RIGHT_CUE_MS
}

export const BREATH_PAGE_MS = LEFT_BREATH_MS
