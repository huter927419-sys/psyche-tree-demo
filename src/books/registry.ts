import type { Locale } from '../i18n/locale'
import type { BookDefinition, BookId } from './types'
import { createEmotionalFlowBook } from './emotional-flow/book'
import { createPsycheTreeBook } from './psyche-tree/book'

export function getBook(id: BookId, locale: Locale = 'zh'): BookDefinition {
  return id === 'emotional-flow'
    ? createEmotionalFlowBook(locale)
    : createPsycheTreeBook(locale)
}

export function getBooks(locale: Locale = 'zh'): BookDefinition[] {
  return [getBook('psyche-tree', locale), getBook('emotional-flow', locale)]
}

export const books = getBooks('zh')

export type { BookDefinition, BookId }
