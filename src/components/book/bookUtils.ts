import type { Locale } from '../../i18n/locale'

const CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾']

export function toChinesePage(n: number): string {
  if (n <= 10) return CN_NUM[n] ?? String(n)
  return String(n)
}

export function formatPageLabel(
  current: number,
  total: number,
  locale: Locale = 'zh',
): string {
  if (locale === 'en' || locale === 'ja') {
    return `${current} / ${total}`
  }
  return `${toChinesePage(current)} / ${toChinesePage(total)}`
}

export const FLIP_DURATION_MS = 1050
