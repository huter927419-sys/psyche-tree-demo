import type { Locale } from '../../i18n/locale'
import {
  primaryTrilingualText,
  type TrilingualString,
} from '../../i18n/volumeRiteTrilingual'
import { localizeChineseCopy } from '../../i18n/traditionalChinese'

interface RiteTrilingualTextProps {
  locale: Locale
  value: TrilingualString
  /** section labels use smaller primary styling */
  variant?: 'body' | 'label' | 'title'
}

export function RiteTrilingualText({
  locale,
  value,
  variant = 'body',
}: RiteTrilingualTextProps) {
  const primary = primaryTrilingualText(locale, value)
  const zhDisplay = localizeChineseCopy(locale, value.zh)

  return (
    <div className={`rite-trilingual rite-trilingual--${variant}`}>
      <p
        className="rite-trilingual-primary"
        lang={locale === 'en' ? 'en' : locale === 'ja' ? 'ja' : 'zh-CN'}
      >
        {primary}
      </p>
      {locale !== 'zh' && locale !== 'zhTw' && zhDisplay !== primary && (
        <p className="rite-trilingual-gloss rite-trilingual-gloss--zh" lang="zh-CN">
          {zhDisplay}
        </p>
      )}
      {locale !== 'en' && value.en && value.en !== primary && (
        <p className="rite-trilingual-gloss rite-trilingual-gloss--en" lang="en">
          {value.en}
        </p>
      )}
      {locale !== 'ja' && value.ja && value.ja !== primary && (
        <p className="rite-trilingual-gloss rite-trilingual-gloss--ja" lang="ja">
          {value.ja}
        </p>
      )}
    </div>
  )
}

interface RiteTrilingualStepBodyProps {
  locale: Locale
  step: {
    title?: TrilingualString
    paragraphs: TrilingualString[]
  }
}

export function RiteTrilingualStepBody({ locale, step }: RiteTrilingualStepBodyProps) {
  return (
    <>
      {step.title && (
        <RiteTrilingualText locale={locale} value={step.title} variant="title" />
      )}
      {step.paragraphs.map((paragraph, i) => (
        <RiteTrilingualText key={i} locale={locale} value={paragraph} />
      ))}
    </>
  )
}
