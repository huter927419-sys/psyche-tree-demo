export type BookId =
  | 'psyche-tree'
  | 'emotional-flow'
  | 'mind-light'
  | 'bond-thread'
  | 'flow-balance'
  | 'direction-light'

export interface BookMeta {
  id: BookId
  shelfTitle: string
  coverTitle: string
  coverSubtitle: string
  coverTagline: string
  coverHint: string
  spineLabel: string
  accent: 'gold' | 'silver'
  dimensionCount: 6
  treeProgressMax: 6
  hasAttentionChecks: true
  /** Short label for result pages */
  domainLabel: string
  integrationLabel: string
}

export interface BookDefinition {
  meta: BookMeta
  questions: import('../types').QuestionItem[]
  generatePsychologyProfile: (
    dimensions: import('../types').DimensionResult[],
  ) => string
  buildPsychologyPromptInput: (
    dimensions: import('../types').DimensionResult[],
  ) => string
  generateMysticalReading: (
    dimensions: import('../types').DimensionResult[],
    psychologyProfile: string,
  ) => string
  buildMysticalPrompt: (psychologyInput: string) => string
  resultChapterLabels: [string, string, string]
}

import type { Locale } from '../i18n/locale'

const RESULT_COPY: Record<
  BookId,
  {
    zh: {
      psychologyTag: string
      psychologyTitle: string
      psychologyHint: string
      mysticalTag: string
      mysticalTitle: string
      mysticalHint: string
    }
    en: {
      psychologyTag: string
      psychologyTitle: string
      psychologyHint: string
      mysticalTag: string
      mysticalTitle: string
      mysticalHint: string
    }
    ja: {
      psychologyTag: string
      psychologyTitle: string
      psychologyHint: string
      mysticalTag: string
      mysticalTitle: string
      mysticalHint: string
    }
  }
> = {
  'psyche-tree': {
    zh: {
      psychologyTag: '自我底层',
      psychologyTitle: '心象画像',
      psychologyHint: '六印照见自我之一面——整象六卷之一，不含评判，只是雾中一页。',
      mysticalTag: '树象整合',
      mysticalTitle: '根息神谕',
      mysticalHint: '以根、界石与湖镜串联自我面向，如树影在雾中缓缓显形。',
    },
    en: {
      psychologyTag: 'Self base',
      psychologyTitle: 'Inner portrait',
      psychologyHint:
        'Six seals mirror one facet of the whole—one face of six, no judgment, only this page in mist.',
      mysticalTag: 'Tree integration',
      mysticalTitle: 'Root oracle',
      mysticalHint:
        'Root, boundary stone, and still lake weave the self, as tree-shadow forms in mist.',
    },
    ja: {
      psychologyTag: '自我の底层',
      psychologyTitle: '心象の像',
      psychologyHint:
        '六印は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、霧の中の一頁のみ。',
      mysticalTag: '樹象の統合',
      mysticalTitle: '根息神託',
      mysticalHint:
        '根、界石、湖鏡が自我の面向をつなぎ、樹影が霧の中でゆっくり姿を現す。',
    },
  },
  'emotional-flow': {
    zh: {
      psychologyTag: '情感底层',
      psychologyTitle: '情感画像',
      psychologyHint: '六脉照见情感之一面——整象六卷之一，不含评判，只是此刻映痕。',
      mysticalTag: '河象整合',
      mysticalTitle: '映心神谕',
      mysticalHint: '以河、潮、镜、泉串联情感面向，如湖心慢慢成章。',
    },
    en: {
      psychologyTag: 'Emotional base',
      psychologyTitle: 'Emotional portrait',
      psychologyHint:
        'Six currents mirror one facet of the whole—one face of six, no judgment, only this reflection.',
      mysticalTag: 'River integration',
      mysticalTitle: 'Heart oracle',
      mysticalHint:
        'River, tide, mirror, and spring weave feeling into one picture on the water.',
    },
    ja: {
      psychologyTag: '感情の底层',
      psychologyTitle: '感情の像',
      psychologyHint:
        '六脈は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、今の映痕のみ。',
      mysticalTag: '河象の統合',
      mysticalTitle: '映心神託',
      mysticalHint:
        '河、潮、鏡、泉が感情の面向をつなぎ、湖心がゆっくり章を成す。',
    },
  },
  'mind-light': {
    zh: {
      psychologyTag: '思维底层',
      psychologyTitle: '思光画像',
      psychologyHint: '六脉照见思维之一面——整象六卷之一，不含评判，只是光在雾中留痕。',
      mysticalTag: '星脉整合',
      mysticalTitle: '明思神谕',
      mysticalHint: '以星、光脉、镜、印串联思维面向，如诸脉在夜空中会合。',
    },
    en: {
      psychologyTag: 'Mind base',
      psychologyTitle: 'Mind portrait',
      psychologyHint:
        'Six lights mirror one facet of the whole—one face of six, no judgment, only traces in mist.',
      mysticalTag: 'Star integration',
      mysticalTitle: 'Mind oracle',
      mysticalHint:
        'Star, light-path, mirror, and seal weave thinking into one constellation.',
    },
    ja: {
      psychologyTag: '思考の底层',
      psychologyTitle: '思光の像',
      psychologyHint:
        '六脈は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、霧に光の痕のみ。',
      mysticalTag: '星脈の統合',
      mysticalTitle: '明思神託',
      mysticalHint:
        '星、光脈、鏡、印が思考の面向をつなぎ、諸脈が夜空で会合する。',
    },
  },
  'bond-thread': {
    zh: {
      psychologyTag: '联结底层',
      psychologyTitle: '缘丝画像',
      psychologyHint: '六丝照见联结之一面——整象六卷之一，不含评判，只是雾中一线。',
      mysticalTag: '丝象整合',
      mysticalTitle: '缘书神谕',
      mysticalHint: '以丝、桥、相望与温手串联联结，如缘分在雾中轻轻显影。',
    },
    en: {
      psychologyTag: 'Bond base',
      psychologyTitle: 'Bond portrait',
      psychologyHint:
        'Six threads mirror one facet of the whole—one face of six, no judgment, only a line in mist.',
      mysticalTag: 'Thread integration',
      mysticalTitle: 'Bond oracle',
      mysticalHint:
        'Thread, bridge, and distant stars weave how you meet and guard connection.',
    },
    ja: {
      psychologyTag: '結びの底层',
      psychologyTitle: '縁糸の像',
      psychologyHint:
        '六糸は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、霧の中の一筋のみ。',
      mysticalTag: '糸象の統合',
      mysticalTitle: '縁書神託',
      mysticalHint:
        '糸、橋、相望、温手が結びをつなぎ、縁が霧の中でやわらかく顕影する。',
    },
  },
  'flow-balance': {
    zh: {
      psychologyTag: '平衡底层',
      psychologyTitle: '流衡画像',
      psychologyHint: '六衡照见守衡之一面——整象六卷之一，不含评判，只是舟行雾中。',
      mysticalTag: '流象整合',
      mysticalTitle: '流衡神谕',
      mysticalHint: '以舟、山、流与雾串联平衡面向，如中流在不确定里找定所。',
    },
    en: {
      psychologyTag: 'Balance base',
      psychologyTitle: 'Balance portrait',
      psychologyHint:
        'Six measures mirror one facet of the whole—one face of six, no judgment, only the boat in mist.',
      mysticalTag: 'Flow integration',
      mysticalTitle: 'Balance oracle',
      mysticalHint:
        'Boat, mountain, and mist weave how you hold and move through uncertainty.',
    },
    ja: {
      psychologyTag: '平衡の底层',
      psychologyTitle: '流衡の像',
      psychologyHint:
        '六衡は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、霧の中の舟行のみ。',
      mysticalTag: '流象の統合',
      mysticalTitle: '流衡神託',
      mysticalHint:
        '舟、山、流、霧が平衡の面向をつなぎ、中流が不確かさの中で定所を見出す。',
    },
  },
  'direction-light': {
    zh: {
      psychologyTag: '方向底层',
      psychologyTitle: '向光画像',
      psychologyHint: '六向照见方向之一面——整象六卷之一，不含评判，只是光在径上留痕。',
      mysticalTag: '光象整合',
      mysticalTitle: '向光神谕',
      mysticalHint: '以光、径、步与共振串联方向面向，如行者于雾中辨认下一步。',
    },
    en: {
      psychologyTag: 'Direction base',
      psychologyTitle: 'Path portrait',
      psychologyHint:
        'Six bearings mirror one facet of the whole—one face of six, no judgment, only footprints in mist.',
      mysticalTag: 'Light integration',
      mysticalTitle: 'Path oracle',
      mysticalHint:
        'Light, path, and step weave how you orient and walk what matters.',
    },
    ja: {
      psychologyTag: '方向の底层',
      psychologyTitle: '向光の像',
      psychologyHint:
        '六向は整象の一面向を映す——六巻の一面に過ぎず、裁きなく、径上の光の痕のみ。',
      mysticalTag: '光象の統合',
      mysticalTitle: '向光神託',
      mysticalHint:
        '光、径、歩、共振が方向の面向をつなぎ、行者が霧の中で次の一歩を見分ける。',
    },
  },
}

const RESULT_LOCALE_KEY: Record<Locale, 'zh' | 'en' | 'ja'> = {
  zh: 'zh',
  en: 'en',
  ja: 'ja',
}

export function getBookResultLabels(book: BookDefinition, locale: Locale = 'zh') {
  const copy = RESULT_COPY[book.meta.id][RESULT_LOCALE_KEY[locale]]
  const closingHints: Record<Locale, string> = {
    zh: `《${book.meta.coverTitle}》已合上。雾仍将散去，光仍会再来。`,
    en: `"${book.meta.coverTitle}" is closed. Mist will lift; light will return.`,
    ja: `『${book.meta.coverTitle}』は閉じました。霧はやがて薄れ、光は再び来るでしょう。`,
  }
  const closingHint = closingHints[locale]

  return { ...copy, closingHint }
}

export type { AssessmentResult } from '../types'
