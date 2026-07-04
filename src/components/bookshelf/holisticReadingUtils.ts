import type { Locale } from '../../i18n/locale'
import type { JourneyDto } from '../../services/journeyApi'

export function pickHolisticReadingForLocale(
  snapshot: JourneyDto | null | undefined,
  targetLocale: Locale,
): { reading: string | null; fallback: boolean } {
  if (!snapshot) return { reading: null, fallback: false }
  const byLocale: Record<
    Locale,
    { reading?: string | null; source?: string | null }
  > = {
    zh: {
      reading: snapshot.holistic.readingZh,
      source: snapshot.holistic.sourceZh,
    },
    zhTw: {
      reading: snapshot.holistic.readingZhTw,
      source: snapshot.holistic.sourceZhTw,
    },
    en: {
      reading: snapshot.holistic.readingEn,
      source: snapshot.holistic.sourceEn,
    },
    ja: {
      reading: snapshot.holistic.readingJa,
      source: snapshot.holistic.sourceJa,
    },
  }
  const entry = byLocale[targetLocale]
  if (entry.reading) {
    return { reading: entry.reading, fallback: entry.source === 'fallback' }
  }
  if (snapshot.holistic.reading) {
    return {
      reading: snapshot.holistic.reading,
      fallback: snapshot.holistic.source === 'fallback',
    }
  }
  return { reading: null, fallback: false }
}
