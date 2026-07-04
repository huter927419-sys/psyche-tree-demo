import * as OpenCC from 'opencc-js'
import type { Locale } from './db/types.js'

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })

export function toTraditionalChinese(text: string): string {
  if (!text) return text
  return converter(text)
}

export function resolveContentLocale(locale: Locale): 'zh' | 'en' | 'ja' {
  if (locale === 'en') return 'en'
  if (locale === 'ja') return 'ja'
  return 'zh'
}

export function convertStringsDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return toTraditionalChinese(value) as T
  }
  if (typeof value === 'function') {
    const fn = value as (...args: unknown[]) => unknown
    return ((...args: unknown[]) => {
      const result = fn(...args)
      return typeof result === 'string'
        ? toTraditionalChinese(result)
        : convertStringsDeep(result)
    }) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => convertStringsDeep(item)) as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value)) {
      out[key] = convertStringsDeep(nested)
    }
    return out as T
  }
  return value
}
