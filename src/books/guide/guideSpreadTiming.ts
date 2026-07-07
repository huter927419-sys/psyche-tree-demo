import {
  estimateGuideSpreadDwellMs,
  getSpreadIllustrationId,
  spreadHasIllustration,
} from './guideAutoTurn'
import { spreadSequentialReadMs } from './guideSpreadReading'
import {
  BREATH_PAGE_MS,
  illustrationSideDwellMs,
  leftBreathDwellMs,
  SPREAD_SIDE_GAP_MS,
} from './guideSpreadDwell'
import { getSpreadRestProfile } from './guideSpreadRest'
import type { GuidePageBlock, GuideSpread } from './types'
import {
  blockRhythmDurationMs,
  spreadHasTextRhythm,
} from './guideTextRhythm'

function pageRhythmDurationMs(
  blocks: readonly GuidePageBlock[],
  reducedMotion: boolean,
): number {
  return blocks.reduce(
    (max, block) => Math.max(max, blockRhythmDurationMs(block, reducedMotion)),
    0,
  )
}

function pageBreathDurationMs(
  blocks: readonly GuidePageBlock[],
  reducedMotion: boolean,
): number {
  if (blocks.length === 0) return 0
  const motifOnly = blocks.every((block) => block.kind === 'storyMotif')
  if (!motifOnly) return 0
  return leftBreathDwellMs(reducedMotion)
}

export { illustrationSideDwellMs, leftBreathDwellMs, SPREAD_SIDE_GAP_MS, BREATH_PAGE_MS }

/**
 * Single dwell until auto turn: sequential read + image view + short 收息.
 */
export function computeSpreadAutoTurnMs(
  spread: GuideSpread,
  reducedMotion = false,
): number {
  const hasRhythm = spreadHasTextRhythm(spread)

  const rhythmMs = hasRhythm
    ? spreadSequentialReadMs(spread, reducedMotion, (blocks) =>
        pageRhythmDurationMs(blocks, reducedMotion),
      )
    : 0

  const breathMs = hasRhythm
    ? 0
    : Math.max(
        pageBreathDurationMs(spread.left, reducedMotion),
        pageBreathDurationMs(spread.right, reducedMotion),
      )

  let illustrationMs = 0
  if (!hasRhythm && spreadHasIllustration(spread)) {
    const id = getSpreadIllustrationId(spread)
    if (id) {
      illustrationMs = Math.max(
        illustrationSideDwellMs(spread.left, reducedMotion),
        illustrationSideDwellMs(spread.right, reducedMotion),
      )
    }
  }

  const coreMs = Math.max(rhythmMs, breathMs, illustrationMs)

  if (coreMs === 0) {
    return estimateGuideSpreadDwellMs(spread, { reducedMotion })
  }

  const holdMs = getSpreadRestProfile(spread, reducedMotion).postHoldMs

  return coreMs + holdMs
}
