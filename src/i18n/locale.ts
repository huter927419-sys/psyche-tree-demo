import { createContext, useContext } from 'react'

export type Locale = 'zh' | 'en' | 'ja'

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
}

export const LOCALE_CODES: Locale[] = ['zh', 'en', 'ja']

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

export { LocaleContext }
