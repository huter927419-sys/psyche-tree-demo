import type { Locale } from './types.js'

export const READING_LOCALES: Locale[] = ['zh', 'zhTw', 'en', 'ja']

const LOCALE_COLUMN_SUFFIX: Record<Locale, string> = {
  zh: 'zh',
  zhTw: 'zh_tw',
  en: 'en',
  ja: 'ja',
}

export function mysticalReadingColumn(
  locale: Locale,
  field: 'reading' | 'source',
): string {
  const suffix = LOCALE_COLUMN_SUFFIX[locale]
  return field === 'reading'
    ? `mystical_reading_${suffix}`
    : `mystical_reading_source_${suffix}`
}

export function holisticReadingColumn(
  locale: Locale,
  field: 'reading' | 'source' | 'prompt',
): string {
  const suffix = LOCALE_COLUMN_SUFFIX[locale]
  if (field === 'prompt') {
    return `holistic_prompt_input_${suffix}`
  }
  return field === 'reading'
    ? `holistic_reading_${suffix}`
    : `holistic_reading_source_${suffix}`
}

export function allReadingsComplete(
  hasForLocale: (locale: Locale) => boolean,
): boolean {
  return READING_LOCALES.every(hasForLocale)
}
