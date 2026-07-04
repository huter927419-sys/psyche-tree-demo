import type { BookId, BookMeta } from '../types'
import type { BookContent, LocalizedBookPack } from '../shared/createBook'
import type { LevelDescriptions } from '../shared/profileHelpers'
import { japaneseCard } from './cardLexicon'

export interface BookJaStrings {
  meta: Pick<
    BookMeta,
    | 'shelfTitle'
    | 'coverTitle'
    | 'coverSubtitle'
    | 'coverTagline'
    | 'coverHint'
    | 'spineLabel'
    | 'domainLabel'
    | 'integrationLabel'
  >
  dimensionTitles: [string, string, string, string, string, string]
  dimensionPrompts: [string, string, string, string, string, string]
  integrationTitle: string
  integrationPrompt: string
  attentionCardLabel: string
  psychDescriptions: LevelDescriptions
  mysticalSymbols: LevelDescriptions
  openings: string[]
  closings: string[]
  resultChapterLabels: [string, string, string]
}

function localizeContent(zh: BookContent, strings: BookJaStrings): BookContent {
  const mapCards = (cards: BookContent['dimensions'][0]['cards']) =>
    cards.map((c) => {
      const ja = japaneseCard(c.pattern, c.label, c.description)
      return { ...c, label: ja.label, description: ja.description }
    })

  return {
    dimensions: zh.dimensions.map((d, i) => ({
      ...d,
      title: strings.dimensionTitles[i],
      prompt: strings.dimensionPrompts[i],
      cards: mapCards(d.cards),
    })),
    integration: {
      ...zh.integration,
      title: strings.integrationTitle,
      prompt: strings.integrationPrompt,
      cards: mapCards(zh.integration.cards),
    },
    attentionCardId: zh.attentionCardId,
    attentionCardLabel: strings.attentionCardLabel,
    psychDescriptions: strings.psychDescriptions,
    mysticalSymbols: strings.mysticalSymbols,
    openings: strings.openings,
    closings: strings.closings,
    mysticalPromptTemplate: '',
  }
}

export function buildJaPack(
  pack: LocalizedBookPack,
  strings: BookJaStrings,
): {
  meta: BookMeta
  content: BookContent
  resultChapterLabels: [string, string, string]
} {
  const meta: BookMeta = {
    ...pack.meta,
    ...strings.meta,
  }
  return {
    meta,
    content: localizeContent(pack.content, strings),
    resultChapterLabels: strings.resultChapterLabels,
  }
}

export function ensureJaPack(pack: LocalizedBookPack, strings: BookJaStrings) {
  return { ...pack, jaPack: buildJaPack(pack, strings) }
}

export type { BookId }
