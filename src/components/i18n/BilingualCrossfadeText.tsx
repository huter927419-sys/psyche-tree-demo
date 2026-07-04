import { useEffect, useState } from 'react'

interface BilingualCrossfadeTextProps {
  zh: string
  en: string
  /** When set, primary language stays visible; other fades as ghost. */
  activeLocale?: 'zh' | 'en'
  className?: string
  intervalMs?: number
}

export function BilingualCrossfadeText({
  zh,
  en,
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

  const enVisible = activeLocale ? activeLocale === 'en' : showEn
  const zhVisible = activeLocale ? activeLocale === 'zh' : !showEn

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
