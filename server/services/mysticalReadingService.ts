import { callDeepSeekMysticalReading } from '../deepseek.js'
import {
  applyTestMysticalFallback,
  type ReadingResolveOptions,
} from '../readingTestFallback.js'
import {
  completeMysticalReadingForLocale,
  failReading,
  findAssessmentById,
  finalizeMysticalReading,
  getMysticalReadingForLocale,
  getMysticalSourceForLocale,
  hasMysticalReadingForLocale,
  storedMysticalReadingLocale,
  tryBeginReading,
} from '../db/repositories/assessments.js'
import { READING_LOCALES } from '../db/readingLocales.js'
import type { BookAssessmentRow, Locale } from '../db/types.js'

export interface MysticalReadingResult {
  reading: string
  source: 'deepseek' | 'fallback' | 'cached'
  model?: string | null
  status: 'completed' | 'processing'
  locale?: Locale
}

async function generateMysticalReadingForLocale(
  row: BookAssessmentRow,
  locale: Locale,
  apiKey: string,
  model: string,
): Promise<string> {
  return callDeepSeekMysticalReading(
    row.psychology_prompt_input,
    apiKey,
    model,
    row.book_id,
    locale,
  )
}

async function ensureAllMysticalReadings(
  assessmentId: string,
  apiKey: string,
  model: string,
): Promise<BookAssessmentRow> {
  const row = findAssessmentById(assessmentId)!
  const missing = READING_LOCALES.filter(
    (locale) => !hasMysticalReadingForLocale(row, locale),
  )

  if (missing.length > 0) {
    await Promise.all(
      missing.map(async (locale) => {
        const reading = await generateMysticalReadingForLocale(
          row,
          locale,
          apiKey,
          model,
        )
        completeMysticalReadingForLocale(
          assessmentId,
          locale,
          reading,
          'deepseek',
          model,
        )
      }),
    )
  }

  finalizeMysticalReading(assessmentId)
  return findAssessmentById(assessmentId)!
}

/**
 * Generate or return mystical readings for ONE assessment row.
 * First request fires zh, zhTw, en, and ja prompts in parallel and saves all four;
 * later locale switches use cache.
 */
export async function resolveMysticalReading(
  assessmentId: string,
  apiKey: string,
  model: string,
  requestedLocale: Locale,
  options: ReadingResolveOptions = {},
): Promise<MysticalReadingResult> {
  const current = findAssessmentById(assessmentId)
  if (!current) {
    throw new Error('ASSESSMENT_NOT_FOUND')
  }

  if (options.testFallback && !hasMysticalReadingForLocale(current, requestedLocale)) {
    const row = applyTestMysticalFallback(assessmentId, current.book_id)
    return {
      reading: getMysticalReadingForLocale(row, requestedLocale)!,
      source: 'fallback',
      model: null,
      status: 'completed',
      locale: requestedLocale,
    }
  }

  if (hasMysticalReadingForLocale(current, requestedLocale)) {
    return {
      reading: getMysticalReadingForLocale(current, requestedLocale)!,
      source: 'cached',
      model: current.mystical_reading_model,
      status: 'completed',
      locale: requestedLocale,
    }
  }

  if (current.mystical_reading_status === 'processing') {
    return {
      reading: getMysticalReadingForLocale(current, requestedLocale) ?? '',
      source: 'cached',
      model: current.mystical_reading_model,
      status: 'processing',
      locale: requestedLocale,
    }
  }

  const locked = tryBeginReading(assessmentId)
  if (!locked) {
    throw new Error('ASSESSMENT_NOT_FOUND')
  }

  const latest = findAssessmentById(assessmentId)!
  if (hasMysticalReadingForLocale(latest, requestedLocale)) {
    return {
      reading: getMysticalReadingForLocale(latest, requestedLocale)!,
      source: 'cached',
      model: latest.mystical_reading_model,
      status: 'completed',
      locale: requestedLocale,
    }
  }

  if (latest.mystical_reading_status === 'processing' && !apiKey) {
    return {
      reading: '',
      source: 'cached',
      status: 'processing',
      locale: requestedLocale,
    }
  }

  if (latest.mystical_reading_status !== 'processing') {
    throw new Error('READING_LOCK_FAILED')
  }

  if (!apiKey) {
    failReading(assessmentId, 'MISSING_API_KEY')
    throw new Error('MISSING_API_KEY')
  }

  try {
    const row = await ensureAllMysticalReadings(assessmentId, apiKey, model)
    return {
      reading: getMysticalReadingForLocale(row, requestedLocale)!,
      source: getMysticalSourceForLocale(row, requestedLocale) ?? 'deepseek',
      model,
      status: 'completed',
      locale: requestedLocale,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'MYSTICAL_READING_FAILED'
    failReading(assessmentId, message)
    throw error
  }
}

export function toAssessmentDto(row: BookAssessmentRow) {
  return {
    id: row.id,
    journeyId: row.journey_id,
    bookId: row.book_id,
    locale: row.locale,
    psychologyProfile: row.psychology_profile,
    dimensions: JSON.parse(row.dimensions_json),
    answers: JSON.parse(row.answers_json),
    attentionPassed: row.attention_passed === 1,
    attentionFailures: JSON.parse(row.attention_failures_json),
    mysticalReading: getMysticalReadingForLocale(row, row.locale),
    mysticalReadingZh: getMysticalReadingForLocale(row, 'zh'),
    mysticalReadingZhTw: getMysticalReadingForLocale(row, 'zhTw'),
    mysticalReadingEn: getMysticalReadingForLocale(row, 'en'),
    mysticalReadingSource: row.mystical_reading_source,
    mysticalReadingJa: getMysticalReadingForLocale(row, 'ja'),
    mysticalReadingSourceZh: getMysticalSourceForLocale(row, 'zh'),
    mysticalReadingSourceZhTw: getMysticalSourceForLocale(row, 'zhTw'),
    mysticalReadingSourceEn: getMysticalSourceForLocale(row, 'en'),
    mysticalReadingSourceJa: getMysticalSourceForLocale(row, 'ja'),
    mysticalReadingModel: row.mystical_reading_model,
    mysticalReadingStatus: row.mystical_reading_status,
    mysticalReadingLocale: storedMysticalReadingLocale(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
