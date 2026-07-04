import type { Locale } from './types.js'

export const READING_LOCALES: Locale[] = ['zh', 'en', 'ja']

export function mysticalReadingColumn(
  locale: Locale,
  field: 'reading' | 'source',
): string {
  const suffix = locale
  return field === 'reading'
    ? `mystical_reading_${suffix}`
    : `mystical_reading_source_${suffix}`
}

export function holisticReadingColumn(
  locale: Locale,
  field: 'reading' | 'source' | 'prompt',
): string {
  if (field === 'prompt') {
    return `holistic_prompt_input_${locale}`
  }
  return field === 'reading'
    ? `holistic_reading_${locale}`
    : `holistic_reading_source_${locale}`
}

export function allReadingsComplete(
  hasForLocale: (locale: Locale) => boolean,
): boolean {
  return READING_LOCALES.every(hasForLocale)
}
