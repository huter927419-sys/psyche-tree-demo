import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { toTraditionalChinese } from '../../i18n/traditionalChinese'

interface BilingualCrossfadeTextProps {
  zh: string
  en: string
  ja?: string
  /** When set, primary language stays visible; others fade as ghost. */
  activeLocale?: Locale
  className?: string
  intervalMs?: number
}

export function BilingualCrossfadeText({
  zh,
  en,
  ja,
  activeLocale,
  className = '',
  intervalMs = 5200,
}: BilingualCrossfadeTextProps) {
  const [showEn, setShowEn] = useState(false)

  useEffect(() => {
    if (activeLocale) return
    const timer = window.setInterval(() => setShowEn((v) => !v), intervalMs)
    return () => window.clearInterval(timer)
  }, [activeLocale, intervalMs])

  if (activeLocale === 'ja' && ja) {
    return (
      <span className={`bilingual-crossfade ${className}`}>
        <span className="bilingual-crossfade-line bilingual-crossfade-line--ja is-active">
          {ja}
        </span>
      </span>
    )
  }

  if (activeLocale === 'zhTw') {
    return (
      <span className={`bilingual-crossfade ${className}`}>
        <span className="bilingual-crossfade-line bilingual-crossfade-line--zh is-active">
          {toTraditionalChinese(zh)}
        </span>
      </span>
    )
  }

  const enVisible = activeLocale ? activeLocale === 'en' : showEn
  const zhVisible =
    activeLocale ? activeLocale === 'zh' : !showEn

  return (
    <span className={`bilingual-crossfade ${className}`}>
      <span
        className={`bilingual-crossfade-line bilingual-crossfade-line--zh${zhVisible ? ' is-active' : ''}`}
        aria-hidden={!zhVisible}
      >
        {zh}
      </span>
      <span
        className={`bilingual-crossfade-line bilingual-crossfade-line--en${enVisible ? ' is-active' : ''}`}
        aria-hidden={!enVisible}
      >
        {en}
      </span>
    </span>
  )
}
