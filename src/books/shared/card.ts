import type { CardOption } from '../../types'

export function card(
  id: string,
  label: string,
  description: string,
  score: CardOption['score'],
  pattern: string,
): CardOption {
  return { id, label, description, score, pattern }
}
