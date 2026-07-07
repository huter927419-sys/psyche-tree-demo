/**
 * 人声节奏 — 读（speak）→ 落点停（hold）→ 换气（gap）
 * 时长随字数、标点、重音变化，避免等间隔机械感。
 */
import type { GuideLineAccent, LineAccentTag } from './guideTextAccents'
import type { GuideRhythmMode } from './guideTextRhythm'

const MS_PER_CHAR: Record<GuideRhythmMode, number> = {
  body: 88,
  preface: 102,
  ritual: 94,
  close: 108,
}

const SPEAK_CHAR_MUL: Record<GuideLineAccent, number> = {
  default: 1,
  flow: 0.72,
  staccato: 0.68,
  linger: 1.22,
  swell: 1.14,
  dissolve: 1.28,
  whisper: 1.18,
  hollow: 1.02,
}

const HOLD_MUL: Record<GuideLineAccent, number> = {
  default: 1,
  flow: 0.45,
  staccato: 0.55,
  linger: 1.55,
  swell: 1.35,
  dissolve: 1.6,
  whisper: 1.4,
  hollow: 1.1,
}

const GAP_MUL: Record<GuideLineAccent, number> = {
  default: 1,
  flow: 0.35,
  staccato: 0.5,
  linger: 1.2,
  swell: 1.05,
  dissolve: 1.15,
  whisper: 1.1,
  hollow: 0.9,
}

const TAG_HOLD_EXTRA: Partial<Record<LineAccentTag, number>> = {
  bridge: 280,
  timeMark: 220,
  vanish: 260,
  absence: 300,
  rest: 240,
  meal: 260,
  dialogue: 180,
}

const TAG_GAP_EXTRA: Partial<Record<LineAccentTag, number>> = {
  bridge: 320,
  rest: 200,
  absence: 240,
}

export type LineReadingTiming = {
  speakMs: number
  holdMs: number
  gapMs: number
  /** speak + hold + gap */
  totalMs: number
}

function graphemeCount(text: string): number {
  return [...text].length
}

function endingHoldMs(line: string): number {
  if (/[。！？」]$/.test(line)) return 200
  if (/[，；、]$/.test(line)) return 90
  if (/…$/.test(line)) return 240
  return 140
}

function endingGapMs(line: string, nextLine?: string): number {
  if (!nextLine) return 0
  if (/[。！？」]$/.test(line)) return 160
  if (/[，；]$/.test(line)) return 70
  return 110
}

function speakBounds(accent: GuideLineAccent): { min: number; max: number } {
  switch (accent) {
    case 'staccato':
      return { min: 200, max: 520 }
    case 'flow':
      return { min: 160, max: 420 }
    case 'linger':
      return { min: 380, max: 1400 }
    case 'dissolve':
      return { min: 340, max: 1200 }
    case 'whisper':
      return { min: 320, max: 1000 }
    default:
      return { min: 260, max: 960 }
  }
}

export function computeLineReadingTiming(
  line: string,
  mode: GuideRhythmMode,
  accent: GuideLineAccent,
  tag: LineAccentTag,
  nextTag: LineAccentTag | undefined,
  nextLine: string | undefined,
  reducedMotion: boolean,
): LineReadingTiming {
  if (reducedMotion) {
    const speakMs = Math.max(120, graphemeCount(line) * 40)
    return { speakMs, holdMs: 60, gapMs: 40, totalMs: speakMs + 100 }
  }

  const chars = graphemeCount(line)
  const { min, max } = speakBounds(accent)
  let speakMs = Math.round(chars * MS_PER_CHAR[mode] * SPEAK_CHAR_MUL[accent])
  speakMs = Math.min(max, Math.max(min, speakMs))

  let holdMs = Math.round(endingHoldMs(line) * HOLD_MUL[accent])
  holdMs += TAG_HOLD_EXTRA[tag] ?? 0

  let gapMs = Math.round(endingGapMs(line, nextLine) * GAP_MUL[accent])
  gapMs += TAG_GAP_EXTRA[tag] ?? 0

  if (tag === 'flow' || nextTag === 'flow') {
    gapMs = Math.round(gapMs * 0.62)
    holdMs = Math.round(holdMs * 0.72)
  }
  if (accent === 'flow' && nextTag === 'flow') {
    gapMs = Math.max(gapMs, 72)
  }
  if (accent === 'staccato' && nextTag === 'flow') {
    gapMs = Math.max(gapMs, 88)
  }

  if (nextLine && nextLine.length <= 4 && nextTag === 'flow') {
    gapMs = Math.max(gapMs, 80)
  }

  if (mode === 'body') {
    gapMs = Math.max(gapMs, accent === 'flow' || accent === 'staccato' ? 120 : 96)
    if (accent === 'staccato') {
      speakMs = Math.max(speakMs, 340)
      holdMs = Math.max(holdMs, 220)
    }
    if (accent === 'flow') {
      speakMs = Math.max(speakMs, 300)
    }
  }

  return {
    speakMs,
    holdMs,
    gapMs,
    totalMs: speakMs + holdMs + gapMs,
  }
}

/** Cumulative ms when each phrase should light (weighted by length). */
export function phraseLightScheduleMs(
  phrases: readonly string[],
  speakMs: number,
): number[] {
  if (phrases.length <= 1) return [0]

  const weights = phrases.map((phrase) => Math.max(1, graphemeCount(phrase)))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let elapsed = 0

  return weights.map((weight) => {
    const step = Math.round((weight / totalWeight) * speakMs)
    elapsed += step
    return elapsed
  })
}

export function pageStartBreathMs(
  mode: GuideRhythmMode,
  lineCount: number,
): number {
  const base = mode === 'preface' ? 380 : mode === 'ritual' ? 320 : 260
  return base + Math.min(120, lineCount * 18)
}

export function pageEndBreathMs(mode: GuideRhythmMode): number {
  return mode === 'close' ? 420 : mode === 'preface' ? 340 : mode === 'ritual' ? 300 : 260
}

export function collectLineEntries(
  lines: readonly string[],
): { line: string; lineIndex: number }[] {
  const entries: { line: string; lineIndex: number }[] = []
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex] ?? ''
    if (line.trim()) entries.push({ line, lineIndex })
  }
  return entries
}
