import { buildGuideFromSections } from './sectionTemplate'
import { enGuideEnterLines, enGuidePreface, enGuideSections } from './content.en'
import { jaGuideEnterLines, jaGuidePreface, jaGuideSections } from './content.ja'
import { zhGuideEnterLines, zhGuidePreface, zhGuideSections } from './content.zh'
import type { GuideContent, GuideSource } from './types'

export type { GuideSource } from './types'

const sourceByLocale = {
  zh: { preface: zhGuidePreface, sections: zhGuideSections },
  en: { preface: enGuidePreface, sections: enGuideSections },
  ja: { preface: jaGuidePreface, sections: jaGuideSections },
} as const satisfies Record<'zh' | 'en' | 'ja', GuideSource>

const contentByLocale = {
  zh: buildGuideFromSections(
    zhGuidePreface,
    zhGuideSections,
    zhGuideEnterLines,
  ),
  en: buildGuideFromSections(
    enGuidePreface,
    enGuideSections,
    enGuideEnterLines,
  ),
  ja: buildGuideFromSections(
    jaGuidePreface,
    jaGuideSections,
    jaGuideEnterLines,
  ),
} as const

export function getGuideSource(contentLocale: 'zh' | 'en' | 'ja'): GuideSource {
  return sourceByLocale[contentLocale]
}

export function getGuideContent(contentLocale: 'zh' | 'en' | 'ja'): GuideContent {
  return contentByLocale[contentLocale]
}
