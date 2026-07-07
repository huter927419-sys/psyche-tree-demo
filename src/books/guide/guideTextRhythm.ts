import type { GuidePageBlock, GuideSpread } from './types'
import {
  segmentAccentRhythmDurationMs,
  storyLineClassForTiming,
} from './guideTextAccents'

export type GuideRhythmMode = 'body' | 'preface' | 'ritual' | 'close'

/** Gap before the next line — normal reading pace (whole line, not per character). */
export const LINE_STEP_MS: Record<GuideRhythmMode, number> = {
  body: 340,
  preface: 420,
  ritual: 380,
  close: 460,
}

/** Single line "speak" length — how long the voice stays on one line. */
export const LINE_ANIM_MS: Record<GuideRhythmMode, number> = {
  body: 360,
  preface: 440,
  ritual: 400,
  close: 420,
}

/** Legacy char constants — kept for reduced-motion helpers only. */
const CHAR_STEP_MS: Record<GuideRhythmMode, number> = {
  body: 380,
  preface: 500,
  ritual: 440,
  close: 540,
}

const CHAR_ANIM_MS: Record<GuideRhythmMode, number> = {
  body: 420,
  preface: 540,
  ritual: 480,
  close: 560,
}

/** Extra pause when moving to the next line. */
export const LINE_PAUSE_MS: Record<GuideRhythmMode, number> = {
  body: 180,
  preface: 240,
  ritual: 200,
  close: 260,
}

const INDEX_LABELS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌'] as const

function storyIndexLabel(index: number): string {
  return INDEX_LABELS[index] ?? String(index)
}

export const TAIL_HOLD_MS: Record<GuideRhythmMode, number> = {
  body: 280,
  preface: 360,
  ritual: 320,
  close: 400,
}

/** Brief pause after the last line before auto turn. */
export const GUIDE_RHYTHM_POST_HOLD_MS = 200
export const GUIDE_RHYTHM_POST_HOLD_REDUCED_MS = 120

export function splitRhythmChars(text: string): string[] {
  return [...text]
}

export function countRhythmChars(lines: readonly string[]): number {
  return lines.reduce((sum, line) => sum + splitRhythmChars(line).length, 0)
}

export function pageHasTextRhythm(blocks: readonly GuidePageBlock[]): boolean {
  return blocks.some((block) => blockHasTextRhythm(block))
}

export function spreadHasTextRhythm(spread: GuideSpread): boolean {
  return pageHasTextRhythm(spread.left) || pageHasTextRhythm(spread.right)
}

export function blockHasTextRhythm(block: GuidePageBlock): boolean {
  switch (block.kind) {
    case 'lines':
      return block.variant === 'vignette'
    case 'prefacePlate':
    case 'prefaceNote':
    case 'storyOpening':
    case 'storyBridge':
    case 'storyAfterglow':
    case 'storyPortal':
      return true
    case 'close':
      return block.variant === 'enter'
    default:
      return false
  }
}

export function charRhythmDelayMs(
  lines: readonly string[],
  lineIndex: number,
  charIndex: number,
  mode: GuideRhythmMode,
  reducedMotion = false,
): number {
  if (reducedMotion) {
    let prior = 0
    for (let li = 0; li < lineIndex; li += 1) {
      prior += splitRhythmChars(lines[li] ?? '').length
    }
    return (prior + charIndex) * 60
  }

  let delay = 0
  for (let li = 0; li < lineIndex; li += 1) {
    if (li > 0) delay += LINE_PAUSE_MS[mode]
    delay += splitRhythmChars(lines[li] ?? '').length * CHAR_STEP_MS[mode]
  }
  if (lineIndex > 0) delay += LINE_PAUSE_MS[mode]
  delay += charIndex * CHAR_STEP_MS[mode]
  return delay
}

export function charRhythmDurationMs(
  mode: GuideRhythmMode,
  reducedMotion = false,
): number {
  return reducedMotion ? 240 : CHAR_ANIM_MS[mode]
}

export function segmentRhythmDurationMs(
  lines: readonly string[],
  mode: GuideRhythmMode,
  reducedMotion = false,
): number {
  const totalChars = countRhythmChars(lines)
  if (totalChars === 0) return 0

  const lastLineIndex = lines.length - 1
  const lastLine = lines[lastLineIndex] ?? ''
  const lastCharIndex = Math.max(0, splitRhythmChars(lastLine).length - 1)
  const delayMs = charRhythmDelayMs(
    lines,
    lastLineIndex,
    lastCharIndex,
    mode,
    reducedMotion,
  )
  const durationMs = charRhythmDurationMs(mode, reducedMotion)
  const tail = reducedMotion ? 180 : TAIL_HOLD_MS[mode]
  return delayMs + durationMs + tail
}

export function estimateSpreadRhythmFallbackMs(
  spread: GuideSpread,
  reducedMotion = false,
): number {
  const sides = [spread.left, spread.right]
  const durations = sides.map((blocks) =>
    blocks.reduce((max, block) => {
      const segmentMs = blockRhythmDurationMs(block, reducedMotion)
      return Math.max(max, segmentMs)
    }, 0),
  )
  const longest = Math.max(...durations, 0)
  const hold = reducedMotion
    ? GUIDE_RHYTHM_POST_HOLD_REDUCED_MS
    : GUIDE_RHYTHM_POST_HOLD_MS
  return longest + hold + 800
}

export function blockRhythmDurationMs(
  block: GuidePageBlock,
  reducedMotion: boolean,
): number {
  switch (block.kind) {
    case 'lines':
      if (block.variant !== 'vignette') return 0
      return segmentAccentRhythmDurationMs(
        block.lines,
        'body',
        storyLineClassForTiming,
        'vignette',
        reducedMotion,
      )
    case 'prefacePlate': {
      const frameMs = segmentAccentRhythmDurationMs(
        block.frame,
        'preface',
        (_, i) => (i === 0 ? 'guide-preface-title' : 'guide-preface-subtitle'),
        'prefaceFrame',
        reducedMotion,
      )
      const whisperMs = block.whisper?.length
        ? segmentAccentRhythmDurationMs(
            block.whisper,
            'preface',
            () => 'guide-preface-whisper-line',
            'prefaceWhisper',
            reducedMotion,
          ) + 180
        : 0
      return frameMs + whisperMs
    }
    case 'prefaceNote':
      return segmentAccentRhythmDurationMs(
        block.lines,
        'preface',
        () => 'guide-preface-note-line',
        'prefaceNote',
        reducedMotion,
      )
    case 'storyOpening': {
      const titleMs =
        segmentAccentRhythmDurationMs(
          [`《${block.title}》`],
          'ritual',
          () => 'guide-story-title',
          'openingTitle',
          reducedMotion,
        ) + (block.into?.length ? 160 : 0)
      const intoMs = block.into?.length
        ? segmentAccentRhythmDurationMs(
            block.into,
            'ritual',
            () => 'guide-story-lead-line',
            'openingInto',
            reducedMotion,
          )
        : 0
      return titleMs + intoMs
    }
    case 'storyBridge':
      return segmentAccentRhythmDurationMs(
        block.lines,
        'ritual',
        () => 'guide-story-bridge-line',
        'bridge',
        reducedMotion,
      )
    case 'storyAfterglow':
      return segmentAccentRhythmDurationMs(
        block.lines,
        'close',
        () => 'guide-story-afterglow-line',
        'afterglow',
        reducedMotion,
      )
    case 'storyPortal':
      return segmentAccentRhythmDurationMs(
        ['篇章已毕', '下一片刻', storyIndexLabel(block.index), `《${block.title}》`],
        'ritual',
        (_, i) => {
          if (i === 0) return 'guide-story-portal-done'
          if (i === 1) return 'guide-story-portal-kicker'
          if (i === 2) return 'guide-story-portal-index'
          return 'guide-story-portal-title'
        },
        'portal',
        reducedMotion,
      )
    case 'close':
      if (block.variant !== 'enter') return 0
      return segmentAccentRhythmDurationMs(
        block.lines,
        'close',
        () => 'guide-spread-body',
        'close',
        reducedMotion,
      )
    default:
      return 0
  }
}
