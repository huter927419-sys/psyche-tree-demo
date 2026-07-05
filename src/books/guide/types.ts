export interface GuideQuote {
  source: string
  text: string
}

export interface GuideShoreQuestions {
  reality: string
  introspection: string
}

export interface GuideVolumeMeaning {
  label: string
  lines: readonly string[]
}

export type GuidePageBlock =
  | { kind: 'part'; text: string }
  | { kind: 'hook'; lines: readonly string[] }
  | { kind: 'phenomenon'; lines: readonly string[]; section?: 'guide' }
  | { kind: 'turn'; lines: readonly string[] }
  | {
      kind: 'tongguanEast'
      quote: GuideQuote
    }
  | {
      kind: 'tongguanModern'
      quote: GuideQuote
      footer: readonly string[]
    }
  | { kind: 'shoreView'; lines: readonly string[] }
  | {
      kind: 'shoreQuestion'
      axisLabel: string
      text: string
    }
  | { kind: 'breath'; label: string; lines: readonly string[] }
  | { kind: 'volumeMeaning'; label: string; lines: readonly string[] }
  | { kind: 'close'; lines: readonly string[] }
  | { kind: 'lines'; lines: readonly string[] }
  | { kind: 'pause'; text: string }

export interface GuideSpread {
  left: readonly GuidePageBlock[]
  right: readonly GuidePageBlock[]
}

export interface GuideChapterDef {
  part: string
  hook: readonly string[]
  phenomenon: { left: readonly string[]; right?: readonly string[] }
  turn: readonly string[]
  tongguan: {
    east: GuideQuote
    modern: GuideQuote
    footer: readonly string[]
  }
  shoreView: readonly string[]
  shoreQuestions: GuideShoreQuestions
  shoreQuestionLabels: { reality: string; introspection: string }
  breath: { label: string; lines: readonly string[] }
  volumeMeaning: GuideVolumeMeaning
  close: readonly string[]
}

export interface GuideContent {
  spreads: readonly GuideSpread[]
  enterSpreadIndex: number
}
