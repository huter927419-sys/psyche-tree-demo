import type { Locale } from '../../i18n/locale'
import type { DimensionQuestion, QuestionItem } from '../../types'
import type { BookDefinition, BookMeta } from '../types'
import { BOOK_EN_STRINGS } from '../en/bookStrings'
import { buildEnPack } from '../en/buildEnPack'
import { BOOK_JA_STRINGS } from '../ja/bookStrings'
import { buildJaPack } from '../ja/buildJaPack'
import {
  buildPsychologyPromptInput,
  generateMysticalFromSymbols,
  generatePsychologyProfile,
  type LevelDescriptions,
} from './profileHelpers'
import {
  buildBookQuestionFlow,
  defaultAttention,
  defaultAttentionEn,
  defaultAttentionJa,
} from './questionFlow'

type DimInput = Omit<DimensionQuestion, 'type'>

export interface BookContent {
  dimensions: DimInput[]
  integration: DimInput
  attentionCardId: string
  attentionCardLabel: string
  psychDescriptions: LevelDescriptions
  mysticalSymbols: LevelDescriptions
  openings: string[]
  closings: string[]
  mysticalPromptTemplate: string
}

export interface LocalizedBookPack {
  meta: BookMeta
  content: BookContent
  attentionCardLabelEn?: string
  resultChapterLabels: [string, string, string]
  mysticalPromptTemplateEn?: string
  enPack?: {
    meta: BookMeta
    content: BookContent
    resultChapterLabels: [string, string, string]
  }
  jaPack?: {
    meta: BookMeta
    content: BookContent
    resultChapterLabels: [string, string, string]
  }
}

function buildQuestions(
  content: BookContent,
  locale: Locale,
  attentionLabelEn?: string,
): QuestionItem[] {
  const attention =
    locale === 'en'
      ? defaultAttentionEn(
          content.attentionCardId,
          attentionLabelEn ?? content.attentionCardLabel,
        )
      : locale === 'ja'
        ? defaultAttentionJa(content.attentionCardId, content.attentionCardLabel)
        : defaultAttention(content.attentionCardId, content.attentionCardLabel)
  return buildBookQuestionFlow(
    content.dimensions,
    content.integration,
    attention,
  )
}

function profileLocale(locale: Locale): 'zh' | 'en' | 'ja' {
  if (locale === 'en') return 'en'
  if (locale === 'ja') return 'ja'
  return 'zh'
}

function createFromPack(pack: LocalizedBookPack, locale: Locale): BookDefinition {
  const enStrings = BOOK_EN_STRINGS[pack.meta.id]
  const jaStrings = BOOK_JA_STRINGS[pack.meta.id]
  const enPack =
    pack.enPack ??
    (enStrings ? buildEnPack(pack, enStrings) : undefined)
  const jaPack =
    pack.jaPack ??
    (jaStrings ? buildJaPack(pack, jaStrings) : undefined)
  const useEn = locale === 'en' && enPack
  const useJa = locale === 'ja' && jaPack
  const activePack = useEn ? enPack! : useJa ? jaPack! : pack
  const meta = activePack.meta
  const content = activePack.content
  const template = content.mysticalPromptTemplate
  const labels = activePack.resultChapterLabels

  return {
    meta,
    questions: buildQuestions(
      content,
      locale,
      useEn ? pack.attentionCardLabelEn : undefined,
    ),
    generatePsychologyProfile: (dims) =>
      generatePsychologyProfile(
        dims,
        content.psychDescriptions,
        profileLocale(locale),
      ),
    buildPsychologyPromptInput: (dims) =>
      buildPsychologyPromptInput(
        dims,
        content.psychDescriptions,
        profileLocale(locale),
      ),
    generateMysticalReading: (dims) =>
      generateMysticalFromSymbols(
        dims,
        content.mysticalSymbols,
        content.openings,
        content.closings,
      ),
    buildMysticalPrompt: (input) => template.replace('[PSYCHOLOGY]', input),
    resultChapterLabels: labels,
  }
}

export function createLocalizedBook(pack: LocalizedBookPack) {
  return (locale: Locale): BookDefinition => createFromPack(pack, locale)
}
