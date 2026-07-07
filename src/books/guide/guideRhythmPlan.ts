import {
  resolveLineAccent,
  resolveLineAccentTag,
  segmentAccentRhythmDurationMs,
  type GuideAccentBlockKind,
  type GuideContentLocale,
  type LineAccentTag,
} from './guideTextAccents'
import { collectLineEntries, computeLineReadingTiming, pageEndBreathMs } from './guideReadingTiming'
import type { GuideRhythmMode } from './guideTextRhythm'

export type GuideRhythmLinePlan = {
  line: string
  lineIndex: number
  lineClass: string
  accent: ReturnType<typeof resolveLineAccent>
  tag: LineAccentTag
  delayMs: number
  /** Active read — sweep / phrase reveal */
  speakMs: number
  /** Line stays bright after fully read */
  holdMs: number
  /** Breath before the next line */
  gapMs: number
  /** speak + hold + gap */
  totalMs: number
  /** @deprecated use speakMs — kept for CSS var compatibility */
  durationMs: number
  /** @deprecated use holdMs + gapMs */
  pauseAfterMs: number
}

export function buildRhythmLinePlan(
  lines: readonly string[],
  mode: GuideRhythmMode,
  getLineClass: (line: string, index: number) => string,
  blockKind: GuideAccentBlockKind | undefined,
  reducedMotion: boolean,
  contentLocale: GuideContentLocale = 'zh',
): GuideRhythmLinePlan[] {
  const plan: GuideRhythmLinePlan[] = []
  let delayCursor = 0
  let priorTag: LineAccentTag = 'default'
  const entries = collectLineEntries(lines)

  for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
    const { line, lineIndex } = entries[entryIndex]!
    const next = entries[entryIndex + 1]
    const lineClass = getLineClass(line, lineIndex)
    const tag = resolveLineAccentTag(
      line,
      lineClass,
      blockKind,
      lineIndex,
      priorTag,
      contentLocale,
    )
    const accent = resolveLineAccent(
      line,
      lineClass,
      blockKind,
      tag,
      priorTag,
      contentLocale,
    )
    const nextTag =
      next !== undefined
        ? resolveLineAccentTag(
            next.line,
            getLineClass(next.line, next.lineIndex),
            blockKind,
            next.lineIndex,
            tag,
            contentLocale,
          )
        : undefined

    const timing = computeLineReadingTiming(
      line,
      mode,
      accent,
      tag,
      nextTag,
      next?.line,
      reducedMotion,
    )

    priorTag = tag

    plan.push({
      line,
      lineIndex,
      lineClass,
      accent,
      tag,
      delayMs: delayCursor,
      speakMs: timing.speakMs,
      holdMs: timing.holdMs,
      gapMs: timing.gapMs,
      totalMs: timing.totalMs,
      durationMs: timing.speakMs,
      pauseAfterMs: timing.holdMs + timing.gapMs,
    })

    delayCursor += timing.totalMs
  }

  return plan
}

export function planSegmentDurationMs(
  plan: readonly GuideRhythmLinePlan[],
  mode: GuideRhythmMode,
  reducedMotion: boolean,
): number {
  if (plan.length === 0) return 0
  const last = plan[plan.length - 1]!
  const tail = reducedMotion ? 120 : pageEndBreathMs(mode)
  return last.delayMs + last.speakMs + last.holdMs + tail
}

export function countRhythmLines(lines: readonly string[]): number {
  return lines.filter((line) => line.trim().length > 0).length
}

export { segmentAccentRhythmDurationMs }
