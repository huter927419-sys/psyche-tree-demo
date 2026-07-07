/**
 * 展页阅读顺序 — 像人翻书：先停看图，再读左页，再读右页；纯图页多停一会。
 */
import type { GuidePageBlock, GuideSpread } from './types'
import { pageHasTextRhythm } from './guideTextRhythm'
import {
  crossRightCueMs,
  illustrationSideDwellMs,
  leftBreathDwellMs,
  motifInhaleDwellMs,
} from './guideSpreadDwell'
import { spreadReflectMs } from './guideSpreadContemplation'

export type SpreadReadPhase =
  | 'viewLeft'
  | 'readLeft'
  | 'crossRight'
  | 'viewRight'
  | 'readRight'
  | 'inhaleRight'
  | 'reflect'
  | 'done'

export function spreadPageHasRhythm(blocks: readonly GuidePageBlock[]): boolean {
  return pageHasTextRhythm(blocks)
}

export function pageHasViewableArt(blocks: readonly GuidePageBlock[]): boolean {
  return blocks.some(
    (block) => block.kind === 'illustration' || block.kind === 'visualPanel',
  )
}

export function pageIsBreathOnly(blocks: readonly GuidePageBlock[]): boolean {
  return (
    blocks.length > 0 &&
    blocks.every((block) => block.kind === 'storyMotif')
  )
}

export function spreadHasRightEngagement(spread: GuideSpread): boolean {
  const rightText = spreadPageHasRhythm(spread.right)
  const rightArt = pageHasViewableArt(spread.right)
  return rightText || rightArt || pageIsBreathOnly(spread.right)
}

function phaseAfterCrossRight(spread: GuideSpread): SpreadReadPhase {
  const rightText = spreadPageHasRhythm(spread.right)
  const rightArt = pageHasViewableArt(spread.right)

  if (rightText && rightArt) return 'viewRight'
  if (rightText) return 'readRight'
  if (rightArt) return 'viewRight'
  if (pageIsBreathOnly(spread.right)) return 'inhaleRight'
  return 'reflect'
}

export function initialSpreadPhase(spread: GuideSpread): SpreadReadPhase {
  const leftText = spreadPageHasRhythm(spread.left)
  const rightText = spreadPageHasRhythm(spread.right)
  const rightArt = pageHasViewableArt(spread.right)

  if (!leftText && needsLeftView(spread)) return 'viewLeft'
  if (leftText) return 'readLeft'
  if (rightText && rightArt) return 'viewRight'
  if (rightText) return 'readRight'
  if (rightArt) return 'viewRight'
  return 'reflect'
}

function needsLeftView(spread: GuideSpread): boolean {
  if (pageHasViewableArt(spread.left)) return true
  if (pageIsBreathOnly(spread.left)) return true
  return false
}

export function nextSpreadPhase(
  spread: GuideSpread,
  phase: SpreadReadPhase,
): SpreadReadPhase {
  const leftText = spreadPageHasRhythm(spread.left)
  const rightText = spreadPageHasRhythm(spread.right)

  switch (phase) {
    case 'viewLeft':
      if (leftText) return 'readLeft'
      if (spreadHasRightEngagement(spread)) return 'crossRight'
      return 'reflect'
    case 'readLeft':
      if (spreadHasRightEngagement(spread)) return 'crossRight'
      return 'reflect'
    case 'crossRight':
      return phaseAfterCrossRight(spread)
    case 'viewRight':
      if (rightText) return 'readRight'
      return 'reflect'
    case 'readRight':
      return 'reflect'
    case 'inhaleRight':
      return 'reflect'
    case 'reflect':
      return 'done'
    default:
      return 'done'
  }
}

export function leftPageViewMs(
  spread: GuideSpread,
  reducedMotion: boolean,
): number {
  if (pageHasViewableArt(spread.left)) {
    return illustrationSideDwellMs(spread.left, reducedMotion)
  }
  if (pageIsBreathOnly(spread.left)) {
    return leftBreathDwellMs(reducedMotion)
  }
  return 0
}

export function rightPageViewMs(
  spread: GuideSpread,
  reducedMotion: boolean,
): number {
  return illustrationSideDwellMs(spread.right, reducedMotion)
}

export function rightMotifInhaleMs(
  spread: GuideSpread,
  reducedMotion: boolean,
): number {
  if (!pageIsBreathOnly(spread.right)) return 0
  return motifInhaleDwellMs(reducedMotion)
}

export function crossRightPhaseMs(
  _spread: GuideSpread,
  reducedMotion: boolean,
): number {
  return crossRightCueMs(reducedMotion)
}

export { spreadReflectMs } from './guideSpreadContemplation'

/** Total auto-turn when reading in human order (view → read left → read right). */
export function spreadSequentialReadMs(
  spread: GuideSpread,
  reducedMotion: boolean,
  pageReadMs: (blocks: readonly GuidePageBlock[]) => number,
): number {
  const leftText = spreadPageHasRhythm(spread.left)
  const rightText = spreadPageHasRhythm(spread.right)
  const rightArt = pageHasViewableArt(spread.right)
  let total = 0

  if (!leftText && needsLeftView(spread)) {
    total += leftPageViewMs(spread, reducedMotion)
  }

  if (leftText) {
    total += pageReadMs(spread.left)
  }

  const leftEngaged = leftText || (!leftText && needsLeftView(spread))
  if (leftEngaged && spreadHasRightEngagement(spread)) {
    total += crossRightCueMs(reducedMotion)
  }

  if (rightText) {
    if (rightArt) {
      total += rightPageViewMs(spread, reducedMotion)
    }
    total += pageReadMs(spread.right)
  } else if (rightArt) {
    total += rightPageViewMs(spread, reducedMotion)
  } else if (leftText && pageIsBreathOnly(spread.right)) {
    total += rightMotifInhaleMs(spread, reducedMotion)
  } else if (!leftText && pageIsBreathOnly(spread.right)) {
    total += leftBreathDwellMs(reducedMotion)
  }

  total += spreadReflectMs(spread, reducedMotion)

  return total
}
