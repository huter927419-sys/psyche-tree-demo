import type { Locale } from '../i18n/locale'
import type { BookDefinition, BookId } from './types'
import { createBondThreadBook } from './bond-thread/book'
import { createDirectionLightBook } from './direction-light/book'
import { createEmotionalFlowBook } from './emotional-flow/book'
import { createFlowBalanceBook } from './flow-balance/book'
import { createMindLightBook } from './mind-light/book'
import { createPsycheTreeBook } from './psyche-tree/book'

const BOOK_IDS: BookId[] = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

const factories: Record<BookId, (locale: Locale) => BookDefinition> = {
  'psyche-tree': createPsycheTreeBook,
  'emotional-flow': createEmotionalFlowBook,
  'mind-light': createMindLightBook,
  'bond-thread': createBondThreadBook,
  'flow-balance': createFlowBalanceBook,
  'direction-light': createDirectionLightBook,
}

export function getBook(id: BookId, locale: Locale = 'zh'): BookDefinition {
  return factories[id](locale)
}

export function getBooks(locale: Locale = 'zh'): BookDefinition[] {
  return BOOK_IDS.map((id) => getBook(id, locale))
}

export const books = getBooks('zh')

export type { BookDefinition, BookId }
