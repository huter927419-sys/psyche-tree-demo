import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { AMBIENT_PHRASES } from '../../i18n/treeLabels'

interface AmbientPhraseLayerProps {
  locale: Locale
  /** When false, timers stop and layer hides (saves work during quiz). */
  active?: boolean
  subdued?: boolean
}

export function AmbientPhraseLayer({
  locale,
  active = true,
  subdued = false,
}: AmbientPhraseLayerProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % AMBIENT_PHRASES.length),
      6800,
    )
    return () => window.clearInterval(timer)
  }, [active])

  if (!active) return null

  const phrase = AMBIENT_PHRASES[index]
  const text = phrase[locale]

  return (
    <div
      className={`ambient-phrase-layer${subdued ? ' ambient-phrase-layer--subdued' : ''}`}
      aria-hidden
    >
      <span className="ambient-phrase-text">{text}</span>
    </div>
  )
}
