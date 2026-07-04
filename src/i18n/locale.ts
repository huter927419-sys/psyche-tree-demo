import { createContext, useContext } from 'react'

export type Locale = 'zh' | 'zhTw' | 'en' | 'ja'

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '简体',
  zhTw: '繁體',
  en: 'English',
  ja: '日本語',
}

export const LOCALE_CODES: Locale[] = ['zh', 'zhTw', 'en', 'ja']

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
} | null>(null)

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useLocaleOptional() {
  return useContext(LocaleContext)
}

export function parseLocale(value: unknown, fallback: Locale = 'zh'): Locale {
  if (value === 'en' || value === 'ja' || value === 'zh' || value === 'zhTw') {
    return value
  }
  return fallback
}

export { LocaleContext }
