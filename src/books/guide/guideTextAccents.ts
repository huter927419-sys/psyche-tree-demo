/**
 * 叙事重音 — 按「句」而非「字」施加节奏；常速连读，关键句才放慢。
 */
import {
  LINE_ANIM_MS,
  LINE_STEP_MS,
  type GuideRhythmMode,
} from './guideTextRhythm'
import { collectLineEntries, computeLineReadingTiming, pageEndBreathMs } from './guideReadingTiming'

export type GuideAccentBlockKind =
  | 'prefaceFrame'
  | 'prefaceWhisper'
  | 'prefaceNote'
  | 'openingInto'
  | 'openingTitle'
  | 'bridge'
  | 'afterglow'
  | 'portal'
  | 'vignette'
  | 'close'

export type GuideLineAccent =
  | 'default'
  | 'flow'
  | 'staccato'
  | 'linger'
  | 'swell'
  | 'dissolve'
  | 'whisper'
  | 'hollow'

const LINE_STEP_MUL: Record<GuideLineAccent, number> = {
  default: 1,
  flow: 0.42,
  staccato: 0.58,
  linger: 1.35,
  swell: 1.15,
  dissolve: 1.25,
  whisper: 1.2,
  hollow: 0.95,
}

const LINE_ANIM_MUL: Record<GuideLineAccent, number> = {
  default: 1,
  flow: 0.62,
  staccato: 0.72,
  linger: 1.25,
  swell: 1.2,
  dissolve: 1.35,
  whisper: 1.15,
  hollow: 1.05,
}

const LINE_ACCENT_EXTRA_PAUSE_MS = {
  bridge: 420,
  afterglow: 280,
  vanish: 220,
  rest: 260,
  absence: 320,
  meal: 280,
} as const

export type LineAccentTag =
  | 'default'
  | 'bridge'
  | 'timeMark'
  | 'staccato'
  | 'flow'
  | 'dialogue'
  | 'parallel'
  | 'vanish'
  | 'linger'
  | 'rest'
  | 'absence'
  | 'whisper'
  | 'ritual'
  | 'meal'

export function resolveLineAccentTag(
  line: string,
  lineClass: string,
  blockKind?: GuideAccentBlockKind,
  _lineIndex?: number,
  priorTag?: LineAccentTag,
): LineAccentTag {
  if (blockKind === 'bridge') return 'bridge'
  if (blockKind === 'prefaceWhisper') return 'whisper'
  if (blockKind === 'afterglow') return 'vanish'
  if (blockKind === 'close' && /留痕/.test(line)) return 'ritual'

  if (lineClass.includes('--time')) return 'timeMark'
  if (lineClass.includes('--dialogue')) return 'dialogue'

  if (lineClass.includes('--beat')) {
    return 'staccato'
  }

  if (/^有人停在/.test(line)) {
    if (priorTag === 'parallel') return 'flow'
    return 'parallel'
  }

  if (/回家吃饭|三碗饭/.test(line)) return 'meal'
  if (/无法回答/.test(line)) return 'linger'
  if (line === '没有。' || line === '却常在天黑时想起。') return 'absence'
  if (/也足。$/.test(line)) return 'rest'
  if (/已经走远|已经不见了|没有再|不再听见|不见了|雾尚未深/.test(line)) {
    return 'vanish'
  }
  if (
    /轻轻|缓缓|停了一会|停了很久|一直没有动|看了很久|很久|悄悄|下意识|唯独|只有一句|恭喜/.test(
      line,
    )
  ) {
    return 'linger'
  }
  if (blockKind === 'openingTitle') return 'ritual'
  if (/不是为了自己|人不可一卷而尽|心不可一面而明|命不可一时而定/.test(line)) {
    return 'ritual'
  }

  return 'default'
}

export function resolveLineAccent(
  line: string,
  lineClass: string,
  blockKind?: GuideAccentBlockKind,
  tag?: LineAccentTag,
  priorTag?: LineAccentTag,
): GuideLineAccent {
  const resolvedTag =
    tag ?? resolveLineAccentTag(line, lineClass, blockKind, undefined, priorTag)

  if (blockKind === 'prefaceFrame' && lineClass.includes('preface-title')) {
    return 'swell'
  }

  switch (resolvedTag) {
    case 'bridge':
      return 'swell'
    case 'timeMark':
      return 'linger'
    case 'staccato':
      return 'staccato'
    case 'flow':
      return 'flow'
    case 'dialogue':
      return 'hollow'
    case 'parallel':
      return 'swell'
    case 'vanish':
      return 'dissolve'
    case 'linger':
    case 'meal':
      return 'linger'
    case 'rest':
      return 'swell'
    case 'absence':
      return 'dissolve'
    case 'whisper':
      return 'whisper'
    case 'ritual':
      return 'swell'
    default:
      return 'default'
  }
}

export function lineStepMs(
  mode: GuideRhythmMode,
  accent: GuideLineAccent,
  reducedMotion: boolean,
): number {
  const base = reducedMotion ? 80 : LINE_STEP_MS[mode]
  return Math.round(base * LINE_STEP_MUL[accent])
}

export function lineAccentDurationMs(
  mode: GuideRhythmMode,
  accent: GuideLineAccent,
  reducedMotion: boolean,
): number {
  const base = reducedMotion ? 180 : LINE_ANIM_MS[mode]
  return Math.round(base * LINE_ANIM_MUL[accent])
}

function lineExtraPauseMs(tag: LineAccentTag): number {
  switch (tag) {
    case 'bridge':
      return LINE_ACCENT_EXTRA_PAUSE_MS.bridge
    case 'vanish':
      return LINE_ACCENT_EXTRA_PAUSE_MS.vanish
    case 'rest':
      return LINE_ACCENT_EXTRA_PAUSE_MS.rest
    case 'absence':
      return LINE_ACCENT_EXTRA_PAUSE_MS.absence
    case 'meal':
      return LINE_ACCENT_EXTRA_PAUSE_MS.meal
    default:
      return 0
  }
}

export function lineExtraPauseMsForTag(tag: LineAccentTag): number {
  return lineExtraPauseMs(tag)
}

export function segmentAccentRhythmDurationMs(
  lines: readonly string[],
  mode: GuideRhythmMode,
  getLineClass: (line: string, index: number) => string,
  blockKind: GuideAccentBlockKind | undefined,
  reducedMotion: boolean,
): number {
  const entries = collectLineEntries(lines)
  if (entries.length === 0) return 0

  let totalMs = 0
  let lastTiming = { speakMs: 0, holdMs: 0, gapMs: 0 }
  let priorTag: LineAccentTag = 'default'

  for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
    const { line, lineIndex } = entries[entryIndex]!
    const next = entries[entryIndex + 1]
    const lineClass = getLineClass(line, lineIndex)
    const tag = resolveLineAccentTag(line, lineClass, blockKind, lineIndex, priorTag)
    const accent = resolveLineAccent(line, lineClass, blockKind, tag, priorTag)
    const nextTag =
      next !== undefined
        ? resolveLineAccentTag(
            next.line,
            getLineClass(next.line, next.lineIndex),
            blockKind,
            next.lineIndex,
            tag,
          )
        : undefined

    lastTiming = computeLineReadingTiming(
      line,
      mode,
      accent,
      tag,
      nextTag,
      next?.line,
      reducedMotion,
    )
    priorTag = tag
    totalMs += lastTiming.speakMs + lastTiming.holdMs + lastTiming.gapMs
  }

  const tail = reducedMotion ? 120 : pageEndBreathMs(mode)
  return totalMs - lastTiming.gapMs + tail
}

export function storyLineClassForTiming(line: string): string {
  if (/^(那一年|很多年以后|五年以后|几年以后|三年以后|后来|有一天|那天)/.test(line)) {
    return 'guide-story-line guide-story-line--time'
  }
  if (/^「/.test(line)) {
    return 'guide-story-line guide-story-line--dialogue'
  }
  if (line.length <= 4 && !/[，。！？」]/.test(line)) {
    return 'guide-story-line guide-story-line--beat'
  }
  return 'guide-story-line'
}
