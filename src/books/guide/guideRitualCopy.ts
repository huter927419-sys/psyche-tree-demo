import type { Locale } from '../../i18n/locale'
import { localizeChineseCopy } from '../../i18n/traditionalChinese'

export type GuideRitualCopy = {
  bridgeSeal: string
  bridgeKicker: string
  afterglowSeal: string
  afterglowKicker: string
  afterglowFoot: string
  portalDone: string
  portalKicker: string
  prefaceKicker: string
  prefaceNoteMark: string
  eyeCueSrHorizontal: string
  eyeCueSrVertical: string
  eyeCueMain: string
  eyeCueSubRight: string
  eyeCueSubBelow: string
  motifFallbackAria: string
}

const zhRitual: GuideRitualCopy = {
  bridgeSeal: '移',
  bridgeKicker: '时移',
  afterglowSeal: '尽',
  afterglowKicker: '此篇已尽',
  afterglowFoot: '余韵',
  portalDone: '篇章已毕',
  portalKicker: '下一篇',
  prefaceKicker: '序',
  prefaceNoteMark: '片',
  eyeCueSrHorizontal: '左页已读，移目右页',
  eyeCueSrVertical: '左页已读，移目下页',
  eyeCueMain: '移目',
  eyeCueSubRight: '右页',
  eyeCueSubBelow: '下页',
  motifFallbackAria: '篇章意境',
}

const enRitual: GuideRitualCopy = {
  bridgeSeal: '→',
  bridgeKicker: 'Time shift',
  afterglowSeal: '◦',
  afterglowKicker: 'Chapter ends',
  afterglowFoot: 'Echo',
  portalDone: 'Chapter done',
  portalKicker: 'Next chapter',
  prefaceKicker: 'Prologue',
  prefaceNoteMark: '·',
  eyeCueSrHorizontal: 'Left page read; shift your gaze to the right',
  eyeCueSrVertical: 'Left page read; shift your gaze below',
  eyeCueMain: 'Shift gaze',
  eyeCueSubRight: 'right page',
  eyeCueSubBelow: 'next page',
  motifFallbackAria: 'Chapter mood',
}

const jaRitual: GuideRitualCopy = {
  bridgeSeal: '移',
  bridgeKicker: '時移',
  afterglowSeal: '尽',
  afterglowKicker: '此篇いま尽く',
  afterglowFoot: '余韻',
  portalDone: '篇章はここまで',
  portalKicker: '次の一篇',
  prefaceKicker: '序',
  prefaceNoteMark: '片',
  eyeCueSrHorizontal: '左頁を読み終えた。右頁へ目を移す',
  eyeCueSrVertical: '左頁を読み終えた。下の頁へ目を移す',
  eyeCueMain: '目を移す',
  eyeCueSubRight: '右頁',
  eyeCueSubBelow: '下頁',
  motifFallbackAria: '篇章の意境',
}

const ritualByContentLocale = {
  zh: zhRitual,
  en: enRitual,
  ja: jaRitual,
} as const

export function getGuideRitualCopy(locale: Locale): GuideRitualCopy {
  if (locale === 'en') return enRitual
  if (locale === 'ja') return jaRitual
  return localizeChineseCopy(locale, zhRitual)
}

export function portalRitualLines(
  _index: number,
  title: string,
  ritual: GuideRitualCopy,
): readonly string[] {
  return [ritual.portalDone, ritual.portalKicker, `《${title}》`]
}

export function getRitualForContentLocale(
  contentLocale: 'zh' | 'en' | 'ja',
): GuideRitualCopy {
  return ritualByContentLocale[contentLocale]
}
