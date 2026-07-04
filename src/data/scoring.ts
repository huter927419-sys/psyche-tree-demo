import type {
  AssessmentResult,
  CardOption,
  DimensionQuestion,
  DimensionResult,
  QuestionItem,
} from '../types'
import type { BookDefinition } from '../books/types'
import { findCardInBook } from '../books/shared/findCard'
import { generatePsychologyProfile } from './psychologyProfile'
import { generateMysticalReading } from './mysticalReading'

function scoreLevel(
  average: number,
): DimensionResult['level'] {
  if (average >= 1.5) return 'high'
  if (average >= 0.5) return 'mid-high'
  if (average >= -0.5) return 'mid'
  if (average >= -1.5) return 'mid-low'
  return 'low'
}

export function computeResults(
  answers: Record<string, string[]>,
  questions: QuestionItem[],
  book?: Pick<
    BookDefinition,
    'generatePsychologyProfile' | 'generateMysticalReading'
  >,
): AssessmentResult {
  const dimensionAnswers: Record<number, CardOption[]> = {}
  const attentionFailures: string[] = []

  for (const question of questions) {
    const selectedIds = answers[question.id] ?? []

    if (question.type === 'attention') {
      const passed = selectedIds.includes(question.requiredCardId)
      if (!passed) {
        attentionFailures.push(question.prompt)
      }
      continue
    }

    const cards = selectedIds
      .map((id) => question.cards.find((c) => c.id === id))
      .filter((c): c is CardOption => Boolean(c))

    if (cards.length > 0) {
      dimensionAnswers[question.dimensionIndex] = cards
    }
  }

  const dimensionQs = questions.filter(
    (q): q is DimensionQuestion => q.type === 'dimension',
  )

  const dimensions: DimensionResult[] = dimensionQs.map((q) => {
    const selectedCards = dimensionAnswers[q.dimensionIndex] ?? []
    const averageScore =
      selectedCards.length > 0
        ? selectedCards.reduce((sum, c) => sum + c.score, 0) /
          selectedCards.length
        : 0

    return {
      dimensionIndex: q.dimensionIndex,
      title: q.title,
      averageScore,
      selectedCards,
      level: scoreLevel(averageScore),
    }
  })

  const psychologyProfile = book
    ? book.generatePsychologyProfile(dimensions)
    : generatePsychologyProfile(dimensions)
  const mysticalReading = book
    ? book.generateMysticalReading(dimensions, psychologyProfile)
    : generateMysticalReading(dimensions, psychologyProfile)

  return {
    dimensions,
    psychologyProfile,
    mysticalReading,
    attentionPassed: attentionFailures.length === 0,
    attentionFailures,
  }
}

export function getAttentionCheckCards(
  question: QuestionItem,
  book: BookDefinition,
): CardOption[] {
  if (question.type !== 'attention') return []

  const found = findCardInBook(question.requiredCardId, book)
  if (!found) return []

  const { card, dimension } = found
  const decoys = dimension.cards
    .filter((c: CardOption) => c.id !== card.id)
    .slice(0, 3)

  return shuffle([card, ...decoys])
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
