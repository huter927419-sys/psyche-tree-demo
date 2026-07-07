/**
 * 展页顿悟 — 读毕后留一息，让读者感受、呼吸、思考。
 * 不是每页都长停，关键处才多停。
 */
import type { GuidePageBlock, GuideSpread } from './types'
import { classifySpreadRestKind } from './guideSpreadRest'

const REFLECT_MS = {
  normal: 920,
  bridge: 1680,
  chapterTail: 2200,
  chapterGate: 2600,
  opening: 1180,
  preface: 1320,
  enter: 2800,
} as const

const REFLECT_REDUCED_MS = {
  normal: 480,
  bridge: 880,
  chapterTail: 1200,
  chapterGate: 1400,
  opening: 620,
  preface: 680,
  enter: 1500,
} as const

function isBeatLine(line: string): boolean {
  return line.length <= 4 && !/[，。！？」]/.test(line)
}

function collectReadableLines(blocks: readonly GuidePageBlock[]): string[] {
  const lines: string[] = []
  for (const block of blocks) {
    switch (block.kind) {
      case 'lines':
        if (block.variant === 'vignette') lines.push(...block.lines)
        break
      case 'storyOpening':
        if (block.into) lines.push(...block.into)
        lines.push(`《${block.title}》`)
        break
      case 'storyBridge':
      case 'storyAfterglow':
      case 'prefaceNote':
        lines.push(...block.lines)
        break
      case 'prefacePlate':
        lines.push(...block.frame)
        if (block.whisper) lines.push(...block.whisper)
        break
      case 'storyPortal':
        lines.push('篇章已毕', '下一篇', `《${block.title}》`)
        break
      case 'close':
        if (block.variant === 'enter') lines.push(...block.lines)
        break
      default:
        break
    }
  }
  return lines
}

function spreadReadableLines(spread: GuideSpread): string[] {
  return [...collectReadableLines(spread.left), ...collectReadableLines(spread.right)]
}

/** 展页读毕后的顿悟停息（reflect 阶段） */
export function spreadReflectMs(
  spread: GuideSpread,
  reducedMotion = false,
): number {
  const kind = classifySpreadRestKind(spread)
  const table = reducedMotion ? REFLECT_REDUCED_MS : REFLECT_MS
  let ms = table[kind] ?? table.normal

  const readable = spreadReadableLines(spread)
  const lastLine = readable[readable.length - 1]
  const lastTwo = readable.slice(-2)

  if (lastLine && isBeatLine(lastLine)) {
    ms += reducedMotion ? 280 : 560
  }
  if (lastLine && /^「/.test(lastLine)) {
    ms += reducedMotion ? 200 : 420
  }
  if (lastTwo.some((line) => /^(很多年以后|五年以后|几年以后|三年以后|后来|有一天|那天)/.test(line))) {
    ms += reducedMotion ? 240 : 480
  }
  if (readable.some((line) => line === 'pause' || line === '……')) {
    ms += reducedMotion ? 180 : 360
  }

  return ms
}
