import type { CardOption } from '../../types'
import type { BookDefinition } from '../types'

export function findCardInBook(cardId: string, book: BookDefinition) {
  for (const q of book.questions) {
    if (q.type !== 'dimension') continue
    const match = q.cards.find((c: CardOption) => c.id === cardId)
    if (match) return { card: match, dimension: q }
  }
  return null
}

export function findCardInBooks(
  cardId: string,
  books: BookDefinition[],
) {
  for (const book of books) {
    const found = findCardInBook(cardId, book)
    if (found) return found
  }
  return null
}
