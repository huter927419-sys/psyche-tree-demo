import type { GuideChapterDef, GuideContent, GuideSpread } from './types'

export function chapterToSpreads(chapter: GuideChapterDef): GuideSpread[] {
  const phenomenonRight = chapter.phenomenon.right ?? []

  return [
    {
      left: [{ kind: 'part', text: chapter.part }],
      right: [{ kind: 'hook', lines: chapter.hook }],
    },
    {
      left: [{ kind: 'phenomenon', lines: chapter.phenomenon.left }],
      right: phenomenonRight.length
        ? [{ kind: 'phenomenon', lines: phenomenonRight }]
        : [{ kind: 'pause', text: '……' }],
    },
    {
      left: [{ kind: 'turn', lines: chapter.turn }],
      right: chapter.turnIllustrationId
        ? [{ kind: 'illustration', id: chapter.turnIllustrationId }]
        : [{ kind: 'pause', text: '……' }],
    },
    {
      left: [
        {
          kind: 'tongguanEast',
          quote: chapter.tongguan.east,
        },
      ],
      right: [
        {
          kind: 'tongguanModern',
          quote: chapter.tongguan.modern,
          footer: chapter.tongguan.footer,
        },
      ],
    },
    {
      left: [{ kind: 'shoreView', lines: chapter.shoreView }],
      right: [{ kind: 'pause', text: '……' }],
    },
    {
      left: [
        {
          kind: 'shoreQuestion',
          axisLabel: chapter.shoreQuestionLabels.reality,
          text: chapter.shoreQuestions.reality,
        },
      ],
      right: [
        {
          kind: 'shoreQuestion',
          axisLabel: chapter.shoreQuestionLabels.introspection,
          text: chapter.shoreQuestions.introspection,
        },
      ],
    },
    {
      left: [
        {
          kind: 'breath',
          label: chapter.breath.label,
          lines: chapter.breath.lines,
        },
      ],
      right: [{ kind: 'pause', text: '……' }],
    },
    {
      left: [
        {
          kind: 'volumeMeaning',
          label: chapter.volumeMeaning.label,
          lines: chapter.volumeMeaning.lines,
        },
      ],
      right: [{ kind: 'pause', text: '……' }],
    },
    {
      left: [{ kind: 'close', lines: chapter.close }],
      right: chapter.closeIllustrationId
        ? [{ kind: 'illustration', id: chapter.closeIllustrationId }]
        : [{ kind: 'pause', text: '……' }],
    },
  ]
}

export function buildGuideContent(
  preface: readonly GuideSpread[],
  chapters: readonly GuideChapterDef[],
  epilogue: readonly GuideSpread[],
): GuideContent {
  const spreads = [
    ...preface,
    ...chapters.flatMap(chapterToSpreads),
    ...epilogue,
  ]
  return {
    spreads,
    enterSpreadIndex: spreads.length - 1,
  }
}
