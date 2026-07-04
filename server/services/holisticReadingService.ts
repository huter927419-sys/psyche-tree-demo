import { callDeepSeekHolisticReading } from '../deepseek.js'
import {
  buildHolisticPromptInput,
  completeHolisticReadingForLocale,
  failHolisticReading,
  findJourneyById,
  finalizeHolisticReading,
  getHolisticReadingForLocale,
  getHolisticSourceForLocale,
  getJourneyWithAssessments,
  hasHolisticReadingForLocale,
  saveHolisticPromptInputForLocale,
  storedHolisticReadingLocale,
  tryBeginHolisticReading,
} from '../db/repositories/journeys.js'
import { READING_LOCALES } from '../db/readingLocales.js'
import type { JourneyRow, Locale } from '../db/types.js'
import { resolveMysticalReading } from './mysticalReadingService.js'

export interface HolisticReadingResult {
  reading: string
  source: 'deepseek' | 'fallback' | 'cached'
  model?: string | null
  status: 'completed' | 'processing'
  locale?: Locale
}

async function ensureVolumeOraclesForHolistic(
  journeyId: string,
  locale: Locale,
  apiKey: string,
  model: string,
): Promise<void> {
  const data = getJourneyWithAssessments(journeyId)
  if (!data) throw new Error('JOURNEY_NOT_FOUND')

  await Promise.all(
    data.assessments.map((row) =>
      resolveMysticalReading(row.id, apiKey, model, locale),
    ),
  )
}

async function generateHolisticReadingForLocale(
  journeyId: string,
  locale: Locale,
  apiKey: string,
  model: string,
): Promise<string> {
  await ensureVolumeOraclesForHolistic(journeyId, locale, apiKey, model)
  const promptInput = buildHolisticPromptInput(journeyId, locale)
  saveHolisticPromptInputForLocale(journeyId, locale, promptInput)
  return callDeepSeekHolisticReading(promptInput, apiKey, model, locale)
}

async function ensureAllHolisticReadings(
  journeyId: string,
  apiKey: string,
  model: string,
): Promise<JourneyRow> {
  let journey = findJourneyById(journeyId)!
  const missing = READING_LOCALES.filter(
    (locale) => !hasHolisticReadingForLocale(journey, locale),
  )

  if (missing.length > 0) {
    await Promise.all(
      missing.map(async (locale) => {
        const reading = await generateHolisticReadingForLocale(
          journeyId,
          locale,
          apiKey,
          model,
        )
        completeHolisticReadingForLocale(
          journeyId,
          locale,
          reading,
          'deepseek',
          model,
        )
      }),
    )
  }

  finalizeHolisticReading(journeyId)
  return findJourneyById(journeyId)!
}

export async function resolveHolisticReading(
  journeyId: string,
  apiKey: string,
  model: string,
  requestedLocale: Locale,
): Promise<HolisticReadingResult> {
  const journey = findJourneyById(journeyId)
  if (!journey) {
    throw new Error('JOURNEY_NOT_FOUND')
  }

  if (journey.status !== 'completed') {
    throw new Error('JOURNEY_INCOMPLETE')
  }

  if (hasHolisticReadingForLocale(journey, requestedLocale)) {
    return {
      reading: getHolisticReadingForLocale(journey, requestedLocale)!,
      source: 'cached',
      model: journey.holistic_reading_model,
      status: 'completed',
      locale: requestedLocale,
    }
  }

  if (journey.holistic_reading_status === 'processing') {
    return {
      reading: getHolisticReadingForLocale(journey, requestedLocale) ?? '',
      source: 'cached',
      status: 'processing',
      locale: requestedLocale,
    }
  }

  const locked = tryBeginHolisticReading(journeyId)
  if (!locked) {
    throw new Error('JOURNEY_NOT_FOUND')
  }

  const latest = findJourneyById(journeyId)!
  if (hasHolisticReadingForLocale(latest, requestedLocale)) {
    return {
      reading: getHolisticReadingForLocale(latest, requestedLocale)!,
      source: 'cached',
      model: latest.holistic_reading_model,
      status: 'completed',
      locale: requestedLocale,
    }
  }

  if (latest.holistic_reading_status !== 'processing') {
    throw new Error('READING_LOCK_FAILED')
  }

  if (!apiKey) {
    failHolisticReading(journeyId, 'MISSING_API_KEY')
    throw new Error('MISSING_API_KEY')
  }

  try {
    const row = await ensureAllHolisticReadings(journeyId, apiKey, model)
    return {
      reading: getHolisticReadingForLocale(row, requestedLocale)!,
      source: getHolisticSourceForLocale(row, requestedLocale) ?? 'deepseek',
      model,
      status: 'completed',
      locale: requestedLocale,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'HOLISTIC_READING_FAILED'
    failHolisticReading(journeyId, message)
    throw error
  }
}

export function toHolisticDto(journey: JourneyRow) {
  return {
    status: journey.holistic_reading_status,
    reading: getHolisticReadingForLocale(journey, journey.locale),
    readingZh: getHolisticReadingForLocale(journey, 'zh'),
    readingZhTw: getHolisticReadingForLocale(journey, 'zhTw'),
    readingEn: getHolisticReadingForLocale(journey, 'en'),
    readingJa: getHolisticReadingForLocale(journey, 'ja'),
    source: journey.holistic_reading_source,
    sourceZh: getHolisticSourceForLocale(journey, 'zh'),
    sourceZhTw: getHolisticSourceForLocale(journey, 'zhTw'),
    sourceEn: getHolisticSourceForLocale(journey, 'en'),
    sourceJa: getHolisticSourceForLocale(journey, 'ja'),
    model: journey.holistic_reading_model,
    readingLocale: storedHolisticReadingLocale(journey),
  }
}
