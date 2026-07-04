import { randomUUID } from 'node:crypto'
import { getDb } from '../client.js'
import type {
  BookAssessmentRow,
  Locale,
  ReadingSource,
  ReadingStatus,
  SaveAssessmentInput,
} from '../types.js'
import { refreshJourneyCompletion } from './journeys.js'
import {
  allReadingsComplete,
  mysticalReadingColumn,
} from '../readingLocales.js'

function localeReading(row: BookAssessmentRow, locale: Locale): string | null | undefined {
  if (locale === 'zh') return row.mystical_reading_zh
  if (locale === 'en') return row.mystical_reading_en
  if (locale === 'ja') return row.mystical_reading_ja
  return row.mystical_reading_zh_tw
}

function localeSource(row: BookAssessmentRow, locale: Locale): ReadingSource | null | undefined {
  if (locale === 'zh') return row.mystical_reading_source_zh
  if (locale === 'en') return row.mystical_reading_source_en
  if (locale === 'ja') return row.mystical_reading_source_ja
  return row.mystical_reading_source_zh_tw
}

export function saveBookAssessment(
  input: SaveAssessmentInput,
): BookAssessmentRow {
  const db = getDb()
  const existing = db
    .prepare(
      `SELECT * FROM book_assessments WHERE journey_id = ? AND book_id = ?`,
    )
    .get(input.journeyId, input.bookId) as BookAssessmentRow | undefined

  const payload = {
    psychology_profile: input.psychologyProfile,
    psychology_prompt_input: input.psychologyPromptInput,
    dimensions_json: JSON.stringify(input.dimensions),
    answers_json: JSON.stringify(input.answers),
    attention_passed: input.attentionPassed ? 1 : 0,
    attention_failures_json: JSON.stringify(input.attentionFailures),
    locale: input.locale,
  }

  if (existing) {
    throw new Error('BOOK_ALREADY_COMPLETED')
  }

  const id = randomUUID()
  db.prepare(
    `INSERT INTO book_assessments (
      id, journey_id, book_id, locale,
      psychology_profile, psychology_prompt_input,
      dimensions_json, answers_json,
      attention_passed, attention_failures_json
    ) VALUES (
      @id, @journey_id, @book_id, @locale,
      @psychology_profile, @psychology_prompt_input,
      @dimensions_json, @answers_json,
      @attention_passed, @attention_failures_json
    )`,
  ).run({
    id,
    journey_id: input.journeyId,
    book_id: input.bookId,
    ...payload,
  })

  refreshJourneyCompletion(input.journeyId)
  return db.prepare('SELECT * FROM book_assessments WHERE id = ?').get(id) as BookAssessmentRow
}

export function findAssessmentById(id: string): BookAssessmentRow | undefined {
  return getDb().prepare('SELECT * FROM book_assessments WHERE id = ?').get(id) as
    | BookAssessmentRow
    | undefined
}

export function getMysticalReadingForLocale(
  row: BookAssessmentRow,
  locale: Locale,
): string | null {
  const reading = localeReading(row, locale)
  if (reading) return reading
  const legacyLocale = row.mystical_reading_locale ?? row.locale
  if (row.mystical_reading && legacyLocale === locale) return row.mystical_reading
  return null
}

export function getMysticalSourceForLocale(
  row: BookAssessmentRow,
  locale: Locale,
): ReadingSource | null {
  const source = localeSource(row, locale)
  if (source) return source
  const legacyLocale = row.mystical_reading_locale ?? row.locale
  if (row.mystical_reading_source && legacyLocale === locale) {
    return row.mystical_reading_source
  }
  return null
}

export function hasMysticalReadingForLocale(
  row: BookAssessmentRow,
  locale: Locale,
): boolean {
  return getMysticalReadingForLocale(row, locale) !== null
}

export function bothMysticalReadingsComplete(row: BookAssessmentRow): boolean {
  return allReadingsComplete((locale) => hasMysticalReadingForLocale(row, locale))
}

export function storedMysticalReadingLocale(row: BookAssessmentRow): Locale {
  if (row.mystical_reading_zh && !row.mystical_reading_en) return 'zh'
  if (row.mystical_reading_en && !row.mystical_reading_zh) return 'en'
  return row.mystical_reading_locale ?? row.locale
}

export function assertAssessmentBelongsToJourney(
  assessmentId: string,
  journeyId: string,
): BookAssessmentRow {
  const row = findAssessmentById(assessmentId)
  if (!row || row.journey_id !== journeyId) {
    throw new Error('ASSESSMENT_NOT_FOUND')
  }
  return row
}

/** Atomically mark processing — only one concurrent worker wins. */
export function tryBeginReading(assessmentId: string): BookAssessmentRow | null {
  const existing = findAssessmentById(assessmentId)
  if (!existing) return null
  if (existing.mystical_reading_status === 'processing') return existing
  if (bothMysticalReadingsComplete(existing)) return existing

  const db = getDb()
  const result = db
    .prepare(
      `UPDATE book_assessments
       SET mystical_reading_status = 'processing',
           mystical_reading_error = NULL,
           updated_at = datetime('now')
       WHERE id = ?
         AND mystical_reading_status IN ('pending', 'failed', 'completed')`,
    )
    .run(assessmentId)

  if (result.changes === 0) {
    return findAssessmentById(assessmentId) ?? null
  }

  return findAssessmentById(assessmentId) ?? null
}

export function completeMysticalReadingForLocale(
  assessmentId: string,
  locale: Locale,
  reading: string,
  source: ReadingSource,
  model: string | null,
) {
  const readingCol = mysticalReadingColumn(locale, 'reading')
  const sourceCol = mysticalReadingColumn(locale, 'source')

  getDb()
    .prepare(
      `UPDATE book_assessments SET
        ${readingCol} = ?,
        ${sourceCol} = ?,
        mystical_reading = ?,
        mystical_reading_source = ?,
        mystical_reading_model = ?,
        mystical_reading_locale = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(reading, source, reading, source, model, locale, assessmentId)
}

export function finalizeMysticalReading(assessmentId: string) {
  getDb()
    .prepare(
      `UPDATE book_assessments SET
        mystical_reading_status = 'completed',
        mystical_reading_error = NULL,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(assessmentId)
}

export function failReading(assessmentId: string, error: string) {
  getDb()
    .prepare(
      `UPDATE book_assessments SET
        mystical_reading_status = 'failed',
        mystical_reading_error = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(error.slice(0, 500), assessmentId)
}

export function saveFallbackReading(
  assessmentId: string,
  reading: string,
  locale: Locale,
) {
  completeMysticalReadingForLocale(assessmentId, locale, reading, 'fallback', null)
  finalizeMysticalReading(assessmentId)
}

export function getReadingStatus(
  assessmentId: string,
): ReadingStatus | undefined {
  const row = findAssessmentById(assessmentId)
  return row?.mystical_reading_status
}

/** @deprecated kept for callers that still import completeReading */
export function completeReading(
  assessmentId: string,
  reading: string,
  source: ReadingSource,
  model: string | null,
  readingLocale: Locale,
) {
  completeMysticalReadingForLocale(assessmentId, readingLocale, reading, source, model)
  finalizeMysticalReading(assessmentId)
}

/** @deprecated no longer resets bilingual readings */
export function resetMysticalReading(_assessmentId: string) {}
