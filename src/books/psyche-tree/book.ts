import type { Locale } from '../../i18n/locale'
import type { BookDefinition } from '../types'
import { getPsycheTreeQuestions } from '../../data/questions'
import {
  buildPsychologyPromptInput,
  generatePsychologyProfile,
} from '../../data/psychologyProfile'
import {
  buildMysticalPrompt,
  generateMysticalReading,
} from '../../data/mysticalReading'

const zhMeta = {
  id: 'psyche-tree' as const,
  shelfTitle: '心象',
  coverTitle: '心象',
  coverSubtitle: '七维内观',
  coverTagline: '树影逐层展开',
  coverHint:
    '每一页是一道向内的问题；翻页之间，身后的树影逐层展开，不含评判。',
  spineLabel: '心象',
  accent: 'gold' as const,
  dimensionCount: 7,
  treeProgressMax: 7,
  hasAttentionChecks: true,
}

const enMeta = {
  ...zhMeta,
  shelfTitle: 'Mindscape',
  coverTitle: 'Mindscape',
  spineLabel: 'Mindscape',
  coverSubtitle: 'Seven inner dimensions',
  coverTagline: 'Shadows of the tree unfold',
  coverHint:
    'Each page is an inward question; as you turn, the tree behind you unfolds without judgment.',
}

export function createPsycheTreeBook(locale: Locale): BookDefinition {
  return {
    meta: locale === 'en' ? enMeta : zhMeta,
    questions: getPsycheTreeQuestions(locale),
    generatePsychologyProfile: (dims) => generatePsychologyProfile(dims, locale),
    buildPsychologyPromptInput: (dims) => buildPsychologyPromptInput(dims, locale),
    generateMysticalReading: (dims, profile) =>
      generateMysticalReading(dims, profile, locale),
    buildMysticalPrompt: (input) => buildMysticalPrompt(input, locale),
    resultChapterLabels:
      locale === 'en'
        ? ['Final · Inner portrait', 'Final · Integration', 'Back · Close']
        : ['终章 · 心象画像', '终章 · 整合描述', '封底 · 合卷'],
  }
}

export const psycheTreeBook = createPsycheTreeBook('zh')
