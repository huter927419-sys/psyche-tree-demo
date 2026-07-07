/**
 * 叙事重音 — 按「句」而非「字」施加节奏；常速连读，关键句才放慢。
 */
import {
  LINE_ANIM_MS,
  LINE_STEP_MS,
  type GuideRhythmMode,
} from './guideTextRhythm'
import { collectLineEntries, computeLineReadingTiming, pageEndBreathMs } from './guideReadingTiming'

export type GuideContentLocale = 'zh' | 'en' | 'ja'

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

const TIME_MARK_RE: Record<GuideContentLocale, RegExp> = {
  zh: /^(那一年|很多年以后|五年以后|几年以后|三年以后|后来|有一天|那天)/,
  en: /^(That year\.|Many years later\.|Five years later\.|A few years later\.|Three years later\.|Later\.|One day\.|That night\.|Midnight\.)/,
  ja: /^(あの年。|年月を経て。|五年後。|数年後。|三年後。|のち。|ある日。|その夜。|真夜中。)/,
}

const DIALOGUE_RE: Record<GuideContentLocale, RegExp> = {
  zh: /^「/,
  en: /^"/,
  ja: /^「/,
}

function isBeatLine(line: string, contentLocale: GuideContentLocale): boolean {
  const maxLen = contentLocale === 'en' ? 28 : 4
  const punctRe = contentLocale === 'en' ? /[,.!?"]/ : /[，。！？」]/
  return line.length <= maxLen && !punctRe.test(line)
}

function matchesTrace(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') return /leave a trace/i.test(line)
  if (contentLocale === 'ja') return /痕を残す/.test(line)
  return /留痕/.test(line)
}

function matchesParallel(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') return /^Some stop at/.test(line)
  if (contentLocale === 'ja') return /^ある者は/.test(line)
  return /^有人停在/.test(line)
}

function matchesMeal(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') return /three bowls of rice|three bowls/i.test(line)
  if (contentLocale === 'ja') return /三杯/.test(line)
  return /回家吃饭|三碗饭/.test(line)
}

function matchesLingerQuestion(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') return /no one can answer/i.test(line)
  if (contentLocale === 'ja') return /答えられない/.test(line)
  return /无法回答/.test(line)
}

function matchesAbsence(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') {
    return line === 'No.' || /often thought of it at dusk/i.test(line)
  }
  if (contentLocale === 'ja') {
    return line === 'いいえ。' || /夕暮れ時によく思い出した/.test(line)
  }
  return line === '没有。' || line === '却常在天黑时想起。'
}

function matchesRest(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') return /is enough\.$/.test(line)
  if (contentLocale === 'ja') return /足りる。$/.test(line)
  return /也足。$/.test(line)
}

function matchesVanish(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') {
    return /walked away|was gone|no longer|never heard|mist not yet|quietly walked/i.test(
      line,
    )
  }
  if (contentLocale === 'ja') {
    return /遠ざか|消え|もう聞か|霧はまだ深くない|見えなく/.test(line)
  }
  return /已经走远|已经不见了|没有再|不再听见|不见了|雾尚未深/.test(line)
}

function matchesLingerSoft(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') {
    return /gently|slowly|paused|stood there|a long while|long time|quietly|only one|congratulations/i.test(
      line,
    )
  }
  if (contentLocale === 'ja') {
    return /そっと|ゆっくり|しばらく|長く|静かに|だけ|おめでとう/.test(line)
  }
  return /轻轻|缓缓|停了一会|停了很久|一直没有动|看了很久|很久|悄悄|下意识|唯独|只有一句|恭喜/.test(
    line,
  )
}

function matchesRitual(line: string, contentLocale: GuideContentLocale): boolean {
  if (contentLocale === 'en') {
    return /not for yourself|cannot be read in one volume|cannot be known from one face|cannot be fixed in one moment/i.test(
      line,
    )
  }
  if (contentLocale === 'ja') {
    return /自分のためではない|一巻では尽きぬ|一面では知れぬ|一時では定まらぬ/.test(line)
  }
  return /不是为了自己|人不可一卷而尽|心不可一面而明|命不可一时而定/.test(line)
}

export function storyLineClassForTiming(
  line: string,
  contentLocale: GuideContentLocale = 'zh',
): string {
  if (TIME_MARK_RE[contentLocale].test(line)) {
    return 'guide-story-line guide-story-line--time'
  }
  if (DIALOGUE_RE[contentLocale].test(line)) {
    return 'guide-story-line guide-story-line--dialogue'
  }
  if (isBeatLine(line, contentLocale)) {
    return 'guide-story-line guide-story-line--beat'
  }
  return 'guide-story-line'
}

export function resolveLineAccentTag(
  line: string,
  lineClass: string,
  blockKind?: GuideAccentBlockKind,
  _lineIndex?: number,
  priorTag?: LineAccentTag,
  contentLocale: GuideContentLocale = 'zh',
): LineAccentTag {
  if (blockKind === 'bridge') return 'bridge'
  if (blockKind === 'prefaceWhisper') return 'whisper'
  if (blockKind === 'afterglow') return 'vanish'
  if (blockKind === 'close' && matchesTrace(line, contentLocale)) return 'ritual'

  if (lineClass.includes('--time')) return 'timeMark'
  if (lineClass.includes('--dialogue')) return 'dialogue'

  if (lineClass.includes('--beat')) {
    return 'staccato'
  }

  if (matchesParallel(line, contentLocale)) {
    if (priorTag === 'parallel') return 'flow'
    return 'parallel'
  }

  if (matchesMeal(line, contentLocale)) return 'meal'
  if (matchesLingerQuestion(line, contentLocale)) return 'linger'
  if (matchesAbsence(line, contentLocale)) return 'absence'
  if (matchesRest(line, contentLocale)) return 'rest'
  if (matchesVanish(line, contentLocale)) return 'vanish'
  if (matchesLingerSoft(line, contentLocale)) return 'linger'
  if (blockKind === 'openingTitle') return 'ritual'
  if (matchesRitual(line, contentLocale)) return 'ritual'

  return 'default'
}

export function resolveLineAccent(
  line: string,
  lineClass: string,
  blockKind?: GuideAccentBlockKind,
  tag?: LineAccentTag,
  priorTag?: LineAccentTag,
  contentLocale: GuideContentLocale = 'zh',
): GuideLineAccent {
  const resolvedTag =
    tag ??
    resolveLineAccentTag(line, lineClass, blockKind, undefined, priorTag, contentLocale)

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
  contentLocale: GuideContentLocale = 'zh',
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
