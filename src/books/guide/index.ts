import type { Locale } from '../../i18n/locale'
import { convertStringsDeep, resolveContentLocale } from '../../i18n/traditionalChinese'
import { getGuideContent } from './content'
import type { GuideContent } from './types'

export type { GuideContent, GuidePageBlock, GuideSpread } from './types'
export {
  clearGuideVolumeHandoff,
  getGuideShelfState,
  getGuideSpreadIndex,
  isGuideVolumeHandoffPending,
  markGuideCompleted,
  markGuideOpened,
  saveGuideSpreadIndex,
  shouldShowGuideFirstVisitHint,
  type GuideShelfState,
} from './storage'

export function getLocalizedGuideContent(locale: Locale): GuideContent {
  const key = resolveContentLocale(locale)
  const base = getGuideContent(key)
  if (locale === 'zhTw') {
    return convertStringsDeep(base)
  }
  return base
}
