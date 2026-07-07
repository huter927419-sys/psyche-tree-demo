import type {
  GuideContent,
  GuidePageBlock,
  GuidePrefaceDef,
  GuideSectionDef,
  GuideSpread,
} from './types'

const LINES_PER_PANEL = 4

/**
 * 配图位设计（每篇最多四现，不重复堆砌）
 * 1. 入画 — 篇首左页 hero
 * 2. 伴读 — 篇首后固定一页 companion（仅一次）
 * 3. 时移 — 桥页右页 ghost
 * 4. 收篇 — 有余韵时下篇 preview；末篇仅 SVG 余韵
 * 正文空页 — 意境 SVG，不再重复 PNG
 */

function vignetteBlock(lines: string[], sectionId: string) {
  return {
    kind: 'lines' as const,
    lines,
    variant: 'vignette' as const,
    sectionId,
  }
}

function motifBlock(
  sectionId: string,
  variant: 'ambient' | 'echo' = 'ambient',
  showCaption = true,
): GuidePageBlock {
  return { kind: 'storyMotif', sectionId, variant, showCaption }
}

function visualPanel(
  illustrationId: string,
  sectionId: string,
  tone: 'companion' | 'echo',
): GuidePageBlock {
  return { kind: 'visualPanel', illustrationId, sectionId, tone }
}

function linesMatch(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((line, index) => line === b[index])
}

function bridgeSpread(
  bridge: readonly string[],
  sectionId: string,
  illustrationId: string,
): GuideSpread {
  return {
    left: [{ kind: 'storyBridge', lines: bridge, sectionId }],
    right: [{ kind: 'illustration', id: illustrationId, tone: 'ghost' }],
  }
}

function tailSpread(
  sectionId: string,
  afterglow: readonly string[],
  next?: {
    index: number
    title: string
    id: string
    illustrationId: string
  },
): GuideSpread {
  const right: GuidePageBlock[] = next
    ? [
        {
          kind: 'storyPortal',
          index: next.index,
          title: next.title,
          sectionId: next.id,
          previewIllustrationId: next.illustrationId,
        },
      ]
    : [motifBlock(sectionId, 'echo')]
  return {
    left: [{ kind: 'storyAfterglow', lines: afterglow, sectionId }],
    right,
  }
}

function proseSide(lines: string[], section: GuideSectionDef): GuidePageBlock[] {
  if (lines.length === 0) {
    return [motifBlock(section.id)]
  }
  return [vignetteBlock(lines, section.id)]
}

function companionSpread(section: GuideSectionDef): GuideSpread {
  return {
    left: [motifBlock(section.id, 'ambient', false)],
    right: [visualPanel(section.illustrationId, section.id, 'companion')],
  }
}

export function prefaceToSpreads(preface: GuidePrefaceDef): GuideSpread[] {
  return [
    {
      left: [{ kind: 'illustration', id: preface.illustrationId, tone: 'hero' }],
      right: [
        {
          kind: 'prefacePlate',
          frame: preface.frame,
          whisper: preface.whisper,
        },
      ],
    },
    {
      left: [{ kind: 'prefaceNote', lines: preface.note }],
      right: [visualPanel('02-six-facets', 'preface', 'companion')],
    },
  ]
}

export function sectionToSpreads(
  section: GuideSectionDef,
  options: {
    sectionIndex: number
    next?: {
      index: number
      title: string
      id: string
      illustrationId: string
    }
  },
): GuideSpread[] {
  const spreads: GuideSpread[] = [
    {
      left: [{ kind: 'illustration', id: section.illustrationId, tone: 'hero' }],
      right: [
        {
          kind: 'storyOpening',
          index: options.sectionIndex,
          into: section.into,
          title: section.title,
        },
      ],
    },
  ]

  if (section.lines.length > 0) {
    spreads.push(companionSpread(section))
  }

  let index = 0
  while (index < section.lines.length) {
    const token = section.lines[index]
    if (token === 'pause') {
      const bridge = section.bridge ?? ['……']
      spreads.push(bridgeSpread(bridge, section.id, section.illustrationId))
      index += 1

      const pending: string[] = []
      while (
        index < section.lines.length &&
        section.lines[index] !== 'pause' &&
        pending.length < bridge.length
      ) {
        pending.push(section.lines[index] as string)
        index += 1
      }
      if (!linesMatch(bridge, pending)) {
        index -= pending.length
      }
      continue
    }

    const leftLines: string[] = []
    while (
      index < section.lines.length &&
      section.lines[index] !== 'pause' &&
      leftLines.length < LINES_PER_PANEL
    ) {
      leftLines.push(section.lines[index] as string)
      index += 1
    }

    const rightLines: string[] = []
    while (
      index < section.lines.length &&
      section.lines[index] !== 'pause' &&
      rightLines.length < LINES_PER_PANEL
    ) {
      rightLines.push(section.lines[index] as string)
      index += 1
    }

    spreads.push({
      left: proseSide(leftLines, section),
      right: proseSide(rightLines, section),
    })
  }

  if (section.afterglow?.length) {
    spreads.push(tailSpread(section.id, section.afterglow, options.next))
  }

  return spreads
}

export function buildGuideFromSections(
  preface: GuidePrefaceDef,
  sections: readonly GuideSectionDef[],
  enterLines: readonly string[],
): GuideContent {
  const spreads: GuideSpread[] = [
    ...prefaceToSpreads(preface),
    ...sections.flatMap((section, index) =>
      sectionToSpreads(section, {
        sectionIndex: index + 1,
        next:
          index < sections.length - 1
            ? {
                index: index + 2,
                title: sections[index + 1]!.title,
                id: sections[index + 1]!.id,
                illustrationId: sections[index + 1]!.illustrationId,
              }
            : undefined,
      }),
    ),
    {
      left: [{ kind: 'illustration' as const, id: 'v-enter', tone: 'hero' as const }],
      right: [{ kind: 'close' as const, variant: 'enter' as const, lines: enterLines }],
    },
  ]
  return {
    spreads,
    enterSpreadIndex: spreads.length - 1,
  }
}
