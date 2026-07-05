import type { IncomingMessage } from 'node:http'
import { getHeader } from './api/http.js'
import { READING_LOCALES } from './db/readingLocales.js'
import {
  completeMysticalReadingForLocale,
  finalizeMysticalReading,
  findAssessmentById,
} from './db/repositories/assessments.js'
import {
  completeHolisticReadingForLocale,
  finalizeHolisticReading,
  findJourneyById,
} from './db/repositories/journeys.js'
import type { Locale } from './db/types.js'

export type ReadingResolveOptions = {
  testFallback?: boolean
}

export function isReadingTestFallbackEnabled(
  req?: IncomingMessage,
  ctxDefault = false,
): boolean {
  if (ctxDefault) return true
  if (process.env.PSYCHE_READING_TEST_FALLBACK === '1') return true
  if (req && getHeader(req, 'x-psyche-reading-test-fallback') === '1') {
    return true
  }
  return false
}

export function testMysticalReading(locale: Locale, bookId: string): string {
  return `[QA fallback · ${bookId} · ${locale}] 雾中照见——测试神谕，仅供本地 verify 加速。

【雾中一步】留一息空，向心湖说一字真名，不必解释。`
}

export function testHolisticReading(locale: Locale): string {
  return `[QA fallback · holistic · ${locale}] 六向归一，树影为镜——测试整象神谕。

【整树之微行】六向如枝，先让根息沉一寸，再择一向轻触即可。`
}

export function applyTestMysticalFallback(assessmentId: string, bookId: string) {
  for (const locale of READING_LOCALES) {
    completeMysticalReadingForLocale(
      assessmentId,
      locale,
      testMysticalReading(locale, bookId),
      'fallback',
      null,
    )
  }
  finalizeMysticalReading(assessmentId)
  return findAssessmentById(assessmentId)!
}

export function applyTestHolisticFallback(journeyId: string) {
  for (const locale of READING_LOCALES) {
    completeHolisticReadingForLocale(
      journeyId,
      locale,
      testHolisticReading(locale),
      'fallback',
      null,
    )
  }
  finalizeHolisticReading(journeyId)
  return findJourneyById(journeyId)!
}
