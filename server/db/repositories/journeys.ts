import { randomUUID } from 'node:crypto'
import { getDb } from '../client.js'
import type { BookAssessmentRow, JourneyRow, Locale, ReadingSource } from '../types.js'
import { findUserByEmail, upsertUserByEmail } from './users.js'
import { getMysticalReadingForLocale } from './assessments.js'
import {
  allReadingsComplete,
  holisticReadingColumn,
} from '../readingLocales.js'

function journeyReading(journey: JourneyRow, locale: Locale): string | null | undefined {
  if (locale === 'zh') return journey.holistic_reading_zh
  if (locale === 'en') return journey.holistic_reading_en
  return journey.holistic_reading_ja
}

function journeySource(journey: JourneyRow, locale: Locale): ReadingSource | null | undefined {
  if (locale === 'zh') return journey.holistic_reading_source_zh
  if (locale === 'en') return journey.holistic_reading_source_en
  return journey.holistic_reading_source_ja
}

export const BOOK_IDS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
] as const

const BOOK_FACET_ZH: Record<string, string> = {
  'psyche-tree': '心象·自我',
  'emotional-flow': '映心·情感',
  'mind-light': '明思·思维',
  'bond-thread': '缘书·联结',
  'flow-balance': '流衡·守变',
  'direction-light': '向光·方向',
}

const BOOK_FACET_JA: Record<string, string> = {
  'psyche-tree': '心象・自己',
  'emotional-flow': '映心・感情',
  'mind-light': '明思・思考',
  'bond-thread': '縁書・結び',
  'flow-balance': '流衡・守り',
  'direction-light': '向光・方向',
}

const BOOK_FACET_EN: Record<string, string> = {
  'psyche-tree': 'Mindscape · Self',
  'emotional-flow': 'Heart Mirror · Feeling',
  'mind-light': 'Mind Light · Thought',
  'bond-thread': 'Bond Book · Connection',
  'flow-balance': 'Flow Balance · Adaptation',
  'direction-light': 'Path Light · Direction',
}

export function findLatestJourneyForUser(userId: string): JourneyRow | undefined {
  return getDb()
    .prepare(
      `SELECT * FROM journeys WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
    )
    .get(userId) as JourneyRow | undefined
}

export function createJourney(email: string, locale: Locale): JourneyRow {
  const user = upsertUserByEmail(email)
  const existing = findLatestJourneyForUser(user.id)
  if (existing) return existing

  const db = getDb()
  const id = randomUUID()

  try {
    db.prepare(`INSERT INTO journeys (id, user_id, locale) VALUES (?, ?, ?)`).run(
      id,
      user.id,
      locale,
    )
    return db.prepare('SELECT * FROM journeys WHERE id = ?').get(id) as JourneyRow
  } catch (error) {
    const retry = findLatestJourneyForUser(user.id)
    if (retry) return retry
    throw error
  }
}

export function findJourneyById(id: string): JourneyRow | undefined {
  return getDb().prepare('SELECT * FROM journeys WHERE id = ?').get(id) as
    | JourneyRow
    | undefined
}

export function listAssessmentsForJourney(
  journeyId: string,
): BookAssessmentRow[] {
  return getDb()
    .prepare(
      `SELECT * FROM book_assessments WHERE journey_id = ? ORDER BY created_at ASC`,
    )
    .all(journeyId) as BookAssessmentRow[]
}

/** True when every catalog book has an assessment — order of completion does not matter. */
export function isJourneyAllBooksComplete(journeyId: string): boolean {
  const rows = getDb()
    .prepare(`SELECT book_id FROM book_assessments WHERE journey_id = ?`)
    .all(journeyId) as { book_id: string }[]
  const completedIds = new Set(rows.map((row) => row.book_id))
  return BOOK_IDS.every((bookId) => completedIds.has(bookId))
}

export function refreshJourneyCompletion(journeyId: string) {
  const db = getDb()
  const completed = isJourneyAllBooksComplete(journeyId)
  db.prepare(
    `UPDATE journeys
     SET status = ?,
         completed_at = CASE WHEN ? THEN datetime('now') ELSE completed_at END,
         updated_at = datetime('now')
     WHERE id = ?`,
  ).run(completed ? 'completed' : 'in_progress', completed ? 1 : 0, journeyId)
}

export function getJourneyWithAssessmentsByEmail(email: string) {
  const user = findUserByEmail(email)
  if (!user) return null
  const journey = findLatestJourneyForUser(user.id)
  if (!journey) return null
  return getJourneyWithAssessments(journey.id)
}

export function getJourneyWithAssessments(journeyId: string) {
  const journey = findJourneyById(journeyId)
  if (!journey) return null
  const assessments = listAssessmentsForJourney(journeyId)
  return { journey, assessments }
}

const HOLISTIC_SECTION: Record<
  Locale,
  { portrait: string; oracle: string; missingBook: string; missingOracle: string }
> = {
  zh: {
    portrait: '底层画像',
    oracle: '已示神谕',
    missingBook: '（尚未探索）',
    missingOracle: '（该卷神谕尚未显现，请仅依底层画像，且勿与之后示出的单卷神谕相矛盾）',
  },
  en: {
    portrait: 'Underlying portrait',
    oracle: 'Oracle already given',
    missingBook: '(not yet explored)',
    missingOracle:
      '(Volume oracle not yet revealed—honor the portrait and stay consistent with any volume oracle shown later)',
  },
  ja: {
    portrait: '底层像',
    oracle: '既示の神託',
    missingBook: '（未踏の巻）',
    missingOracle:
      '（この巻の神託は未示——底层像のみに従い、後に示される巻別神託と矛盾しないこと）',
  },
}

function formatHolisticBookSection(
  facetTitle: string,
  row: BookAssessmentRow | undefined,
  locale: Locale,
): string {
  const section = HOLISTIC_SECTION[locale]
  const header =
    locale === 'en'
      ? `[${facetTitle}]`
      : locale === 'ja'
        ? `［${facetTitle}］`
        : `【${facetTitle}】`

  if (!row) {
    return `${header}\n${section.missingBook}`
  }

  const volumeOracle = getMysticalReadingForLocale(row, locale)
  const oracleBlock = volumeOracle?.trim()
    ? volumeOracle.trim()
    : section.missingOracle

  return `${header}\n${section.portrait}：\n${row.psychology_prompt_input}\n\n${section.oracle}：\n${oracleBlock}`
}

export function buildHolisticPromptInput(
  journeyId: string,
  displayLocale?: Locale,
): string {
  const data = getJourneyWithAssessments(journeyId)
  if (!data) throw new Error('JOURNEY_NOT_FOUND')

  const byBook = new Map(data.assessments.map((a) => [a.book_id, a]))
  const locale = displayLocale ?? data.journey.locale
  const labels =
    locale === 'en' ? BOOK_FACET_EN : locale === 'ja' ? BOOK_FACET_JA : BOOK_FACET_ZH

  return BOOK_IDS.map((bookId) =>
    formatHolisticBookSection(labels[bookId] ?? bookId, byBook.get(bookId), locale),
  ).join('\n\n')
}

export function storedHolisticReadingLocale(journey: JourneyRow): Locale {
  if (journey.holistic_reading_zh && !journey.holistic_reading_en) return 'zh'
  if (journey.holistic_reading_en && !journey.holistic_reading_zh) return 'en'
  return journey.holistic_reading_locale ?? journey.locale
}

export function getHolisticReadingForLocale(
  journey: JourneyRow,
  locale: Locale,
): string | null {
  const reading = journeyReading(journey, locale)
  if (reading) return reading
  const legacyLocale = journey.holistic_reading_locale ?? journey.locale
  if (journey.holistic_reading && legacyLocale === locale) {
    return journey.holistic_reading
  }
  return null
}

export function getHolisticSourceForLocale(
  journey: JourneyRow,
  locale: Locale,
): ReadingSource | null {
  const source = journeySource(journey, locale)
  if (source) return source
  const legacyLocale = journey.holistic_reading_locale ?? journey.locale
  if (journey.holistic_reading_source && legacyLocale === locale) {
    return journey.holistic_reading_source
  }
  return null
}

export function hasHolisticReadingForLocale(
  journey: JourneyRow,
  locale: Locale,
): boolean {
  return getHolisticReadingForLocale(journey, locale) !== null
}

export function bothHolisticReadingsComplete(journey: JourneyRow): boolean {
  return allReadingsComplete((locale) => hasHolisticReadingForLocale(journey, locale))
}

/** @deprecated no longer resets bilingual readings */
export function resetHolisticReading(_journeyId: string) {}

export function saveHolisticPromptInputForLocale(
  journeyId: string,
  locale: Locale,
  prompt: string,
) {
  const col = holisticReadingColumn(locale, 'prompt')
  getDb()
    .prepare(
      `UPDATE journeys SET ${col} = ?, holistic_prompt_input = ?, updated_at = datetime('now') WHERE id = ?`,
    )
    .run(prompt, prompt, journeyId)
}

export function tryBeginHolisticReading(journeyId: string): JourneyRow | null {
  const existing = findJourneyById(journeyId)
  if (!existing) return null
  if (existing.holistic_reading_status === 'processing') return existing
  if (bothHolisticReadingsComplete(existing)) return existing

  const db = getDb()
  db.prepare(
    `UPDATE journeys SET
      holistic_reading_status = 'processing',
      holistic_reading_error = NULL,
      updated_at = datetime('now')
     WHERE id = ?
       AND status = 'completed'
       AND holistic_reading_status IN ('pending', 'failed', 'completed')`,
  ).run(journeyId)
  return findJourneyById(journeyId) ?? null
}

export function completeHolisticReadingForLocale(
  journeyId: string,
  locale: Locale,
  reading: string,
  source: ReadingSource,
  model: string | null,
) {
  const readingCol = holisticReadingColumn(locale, 'reading')
  const sourceCol = holisticReadingColumn(locale, 'source')

  getDb()
    .prepare(
      `UPDATE journeys SET
        ${readingCol} = ?,
        ${sourceCol} = ?,
        holistic_reading = ?,
        holistic_reading_source = ?,
        holistic_reading_model = ?,
        holistic_reading_locale = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(reading, source, reading, source, model, locale, journeyId)
}

export function finalizeHolisticReading(journeyId: string) {
  getDb()
    .prepare(
      `UPDATE journeys SET
        holistic_reading_status = 'completed',
        holistic_reading_error = NULL,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(journeyId)
}

/** @deprecated use completeHolisticReadingForLocale */
export function completeHolisticReading(
  journeyId: string,
  reading: string,
  source: ReadingSource,
  model: string | null,
  readingLocale: Locale,
) {
  completeHolisticReadingForLocale(journeyId, readingLocale, reading, source, model)
  finalizeHolisticReading(journeyId)
}

export function failHolisticReading(journeyId: string, error: string) {
  getDb()
    .prepare(
      `UPDATE journeys SET
        holistic_reading_status = 'failed',
        holistic_reading_error = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(error.slice(0, 500), journeyId)
}

export function saveHolisticFallback(journeyId: string, reading: string, locale: Locale) {
  completeHolisticReadingForLocale(journeyId, locale, reading, 'fallback', null)
  finalizeHolisticReading(journeyId)
}
