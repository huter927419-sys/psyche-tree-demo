import type { AssessmentResult } from '../types'
import type { BookId } from '../books/types'
import type { Locale } from '../i18n/locale'
import { getJourneySession } from './journeyApi'

export interface SavedAssessment {
  id: string
  bookId: BookId
  mysticalReadingStatus: string
  journeyStatus: string
  assessmentsCompleted: number
}

function journeyHeaders(journeyId: string) {
  return {
    'Content-Type': 'application/json',
    'X-Journey-Id': journeyId,
  }
}

export async function saveBookAssessmentWithAnswers(
  journeyId: string,
  bookId: BookId,
  locale: Locale,
  result: AssessmentResult,
  psychologyPromptInput: string,
  answers: Record<string, string[]>,
): Promise<SavedAssessment> {
  const response = await fetch(`/api/journeys/${journeyId}/assessments`, {
    method: 'POST',
    headers: journeyHeaders(journeyId),
    body: JSON.stringify({
      bookId,
      locale,
      psychologyProfile: result.psychologyProfile,
      psychologyPromptInput,
      dimensions: result.dimensions.map((d) => ({
        dimensionIndex: d.dimensionIndex,
        title: d.title,
        averageScore: d.averageScore,
        level: d.level,
        selectedCardIds: d.selectedCards.map((c) => c.id),
      })),
      answers,
      attentionPassed: result.attentionPassed,
      attentionFailures: result.attentionFailures,
    }),
  })

  const data = (await response.json()) as {
    assessment?: { id: string; bookId: BookId; mysticalReadingStatus: string }
    error?: string
  }

  if (!response.ok) {
    throw new Error(data.error ?? '保存答题结果失败')
  }

  return {
    id: data.assessment!.id,
    bookId: data.assessment!.bookId,
    mysticalReadingStatus: data.assessment!.mysticalReadingStatus,
    journeyStatus: (data as { journeyStatus?: string }).journeyStatus ?? 'in_progress',
    assessmentsCompleted:
      (data as { assessmentsCompleted?: number }).assessmentsCompleted ?? 0,
  }
}

const POLL_MS = 1200
const MAX_POLLS = 90

export async function fetchMysticalReadingForAssessment(
  assessmentId: string,
  locale: Locale,
): Promise<{
  reading: string
  source?: string
  readingZh?: string | null
  readingEn?: string | null
  readingJa?: string | null
}> {
  const { journeyId } = getJourneySession()
  if (!journeyId) {
    throw new Error('缺少 journey 会话')
  }

  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    const response = await fetch(
      `/api/assessments/${assessmentId}/mystical-reading`,
      {
        method: 'POST',
        headers: journeyHeaders(journeyId),
        body: JSON.stringify({ locale }),
      },
    )

    const data = (await response.json()) as {
      reading?: string
      readingZh?: string | null
      readingEn?: string | null
      readingJa?: string | null
      status?: string
      source?: string
      error?: string
    }

    if (response.status === 202 || data.status === 'processing') {
      await new Promise((r) => window.setTimeout(r, POLL_MS))
      continue
    }

    if (!response.ok) {
      throw new Error(data.error ?? '生成解读失败')
    }

    if (data.reading) {
      return {
        reading: data.reading,
        source: data.source,
        readingZh: data.readingZh,
        readingEn: data.readingEn,
        readingJa: data.readingJa,
      }
    }
  }

  throw new Error('解读生成超时')
}

export async function saveFallbackReading(
  assessmentId: string,
  reading: string,
  locale: Locale,
): Promise<void> {
  const { journeyId } = getJourneySession()
  if (!journeyId) return

  await fetch(`/api/assessments/${assessmentId}/mystical-reading/fallback`, {
    method: 'POST',
    headers: journeyHeaders(journeyId),
    body: JSON.stringify({ reading, locale }),
  })
}
