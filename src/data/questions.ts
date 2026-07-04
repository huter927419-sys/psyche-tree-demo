import { getBooks } from '../books/registry'
import { findCardInBooks } from '../books/shared/findCard'

/** @deprecated Use findCardInBook with a specific book when possible */
export function findCardById(cardId: string) {
  return findCardInBooks(cardId, getBooks('zh'))
}
