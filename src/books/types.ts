import type { QuestionItem } from '../types'
import type { DimensionResult, AssessmentResult } from '../types'

export interface BookMeta {
  id: BookId
  shelfTitle: string
  coverTitle: string
  coverSubtitle: string
  coverTagline: string
  coverHint: string
  spineLabel: string
  accent: 'gold' | 'silver'
  dimensionCount: number
  treeProgressMax: number
  hasAttentionChecks: boolean
}

export interface BookDefinition {
  meta: BookMeta
  questions: QuestionItem[]
  generatePsychologyProfile: (dimensions: DimensionResult[]) => string
  buildPsychologyPromptInput: (dimensions: DimensionResult[]) => string
  generateMysticalReading: (
    dimensions: DimensionResult[],
    psychologyProfile: string,
  ) => string
  buildMysticalPrompt: (psychologyInput: string) => string
  resultChapterLabels: [string, string, string]
}

export type BookId = 'psyche-tree' | 'emotional-flow'

import type { Locale } from '../i18n/locale'

export function getBookResultLabels(book: BookDefinition, locale: Locale = 'zh') {
  const isFlow = book.meta.id === 'emotional-flow'
  const isEn = locale === 'en'

  if (isEn) {
    return {
      psychologyTag: isFlow ? 'Emotional base' : 'Inner base',
      psychologyTitle: isFlow ? 'Emotional portrait' : 'Inner portrait',
      psychologyHint:
        'Seen in mist—without judgment, only a record of this moment.',
      mysticalTag: 'Image integration',
      mysticalTitle: 'Integration',
      mysticalHint:
        'Images weave your many facets, like mist revealing an inner landscape.',
      closingHint: `"${book.meta.coverTitle}" is closed. Mist will lift; light will return.`,
    }
  }

  return {
    psychologyTag: isFlow ? '情感底层' : '心象底层',
    psychologyTitle: isFlow ? '情感画像' : '心象画像',
    psychologyHint: '雾中照见——不含评判，只是此刻的一页记录。',
    mysticalTag: '意象整合',
    mysticalTitle: '整合描述',
    mysticalHint: '以意象串联多维感受，如雾中俯览一页内在风景。',
    closingHint: `《${book.meta.coverTitle}》已合上。雾仍将散去，光仍会再来。`,
  }
}

export type { AssessmentResult }
