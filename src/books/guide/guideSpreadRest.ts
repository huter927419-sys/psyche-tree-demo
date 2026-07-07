/**
 * 展页收息 — 按页面气质决定读毕后的停驻时长与视觉层次。
 * 桥页、篇末、门户、开篇各有不同的「息」。
 */
import type { GuidePageBlock, GuideSpread } from './types'

export type GuideSpreadRestKind =
  | 'normal'
  | 'bridge'
  | 'chapterTail'
  | 'chapterGate'
  | 'opening'
  | 'preface'
  | 'enter'

export type GuideSpreadRestVisual = 'none' | 'soft' | 'bridge' | 'chapter'

export type GuideSpreadRestProfile = {
  kind: GuideSpreadRestKind
  postHoldMs: number
  visual: GuideSpreadRestVisual
}

const POST_HOLD_MS: Record<GuideSpreadRestKind, number> = {
  normal: 840,
  bridge: 2400,
  chapterTail: 3200,
  chapterGate: 3800,
  opening: 1120,
  preface: 1280,
  enter: 4600,
}

const POST_HOLD_REDUCED_MS: Record<GuideSpreadRestKind, number> = {
  normal: 440,
  bridge: 1280,
  chapterTail: 1680,
  chapterGate: 2000,
  opening: 580,
  preface: 640,
  enter: 2600,
}

const VISUAL: Record<GuideSpreadRestKind, GuideSpreadRestVisual> = {
  normal: 'none',
  bridge: 'bridge',
  chapterTail: 'chapter',
  chapterGate: 'chapter',
  opening: 'soft',
  preface: 'soft',
  enter: 'chapter',
}

function spreadBlocks(spread: GuideSpread): readonly GuidePageBlock[] {
  return [...spread.left, ...spread.right]
}

function spreadHas(
  spread: GuideSpread,
  predicate: (block: GuidePageBlock) => boolean,
): boolean {
  return spreadBlocks(spread).some(predicate)
}

export function classifySpreadRestKind(spread: GuideSpread): GuideSpreadRestKind {
  if (
    spreadHas(
      spread,
      (block) => block.kind === 'close' && block.variant === 'enter',
    )
  ) {
    return 'enter'
  }

  if (spreadHas(spread, (block) => block.kind === 'storyAfterglow')) {
    if (spreadHas(spread, (block) => block.kind === 'storyPortal')) {
      return 'chapterGate'
    }
    return 'chapterTail'
  }

  if (spreadHas(spread, (block) => block.kind === 'storyBridge')) {
    return 'bridge'
  }

  if (spreadHas(spread, (block) => block.kind === 'storyOpening')) {
    return 'opening'
  }

  if (
    spreadHas(spread, (block) => block.kind === 'prefacePlate') ||
    spreadHas(spread, (block) => block.kind === 'prefaceNote')
  ) {
    return 'preface'
  }

  return 'normal'
}

export function getSpreadRestProfile(
  spread: GuideSpread,
  reducedMotion = false,
): GuideSpreadRestProfile {
  const kind = classifySpreadRestKind(spread)
  return {
    kind,
    postHoldMs: reducedMotion ? POST_HOLD_REDUCED_MS[kind] : POST_HOLD_MS[kind],
    visual: VISUAL[kind],
  }
}

/** 下一展是否为新篇章开篇（hero + 题签） */
export function nextSpreadIsSectionOpening(nextSpread?: GuideSpread): boolean {
  if (!nextSpread) return false
  return spreadHas(nextSpread, (block) => block.kind === 'storyOpening')
}
