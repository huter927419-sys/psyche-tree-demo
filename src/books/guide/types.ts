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
  | { kind: 'shoreView'; lines: readonly string[]; tone?: 'epigraph' }
  | {
      kind: 'shoreQuestion'
      axisLabel: string
      text: string
    }
  | { kind: 'breath'; label: string; lines: readonly string[] }
  | { kind: 'volumeMeaning'; label: string; lines: readonly string[] }
  | { kind: 'close'; lines: readonly string[]; variant?: 'enter' }
  | { kind: 'lines'; lines: readonly string[]; variant?: 'vignette' | 'preface' | 'enter'; sectionId?: string }
  | { kind: 'storyOpening'; index: number; into?: readonly string[]; title: string; sectionId: string }
  | { kind: 'storyBridge'; lines: readonly string[]; sectionId: string }
  | { kind: 'storyAfterglow'; lines: readonly string[]; sectionId: string }
  | { kind: 'storyPortal'; index: number; title: string; sectionId: string; previewIllustrationId: string }
  | {
      kind: 'storyMotif'
      sectionId: string
      variant?: 'ambient' | 'echo'
      showCaption?: boolean
    }
  | { kind: 'prefacePlate'; frame: readonly string[]; whisper?: readonly string[] }
  | { kind: 'prefaceNote'; lines: readonly string[] }
  | { kind: 'visualPanel'; illustrationId: string; sectionId: string; tone: 'companion' | 'echo' }
  | { kind: 'sectionTitle'; title: string }
  | { kind: 'interval' }
  | { kind: 'pause'; text: string }
  | { kind: 'illustration'; id: string; tone?: 'hero' | 'ghost' | 'companion' | 'echo' }

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
  /** Optional ink illustration on the turn-spread pause page (right) */
  turnIllustrationId?: string
  /** Optional ink illustration on the close-spread pause page (right) */
  closeIllustrationId?: string
}

export interface GuidePrefaceDef {
  illustrationId: string
  /** 开篇定调 — 如「各停一处」 */
  frame: readonly string[]
  /** 极淡的岸语，无栏目标 */
  whisper?: readonly string[]
  /** 读法提示 */
  note: readonly string[]
}

export interface GuideSectionDef {
  id: string
  title: string
  illustrationId: string
  /** 入篇 — 插图页上的故事引子，先于篇名 */
  into?: readonly string[]
  /** 时间跳跃 — 对应 lines 里的 pause，单独成页并跳过正文重复行 */
  bridge?: readonly string[]
  /** 篇末余韵 — 故事.echo，非程式收束 */
  afterglow?: readonly string[]
  lines: readonly (string | 'pause')[]
}

export interface GuideSource {
  preface: GuidePrefaceDef
  sections: readonly GuideSectionDef[]
}

export interface GuideContent {
  spreads: readonly GuideSpread[]
  enterSpreadIndex: number
}
