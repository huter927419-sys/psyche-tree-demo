import { useEffect, useState } from 'react'
import { AMBIENT_PHRASES } from '../../i18n/treeLabels'
import { BilingualCrossfadeText } from './BilingualCrossfadeText'

interface AmbientPhraseLayerProps {
  /** When false, timers stop and layer hides (saves work during quiz). */
  active?: boolean
  subdued?: boolean
}

export function AmbientPhraseLayer({
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

  return (
    <div
      className={`ambient-phrase-layer${subdued ? ' ambient-phrase-layer--subdued' : ''}`}
      aria-hidden
    >
      <BilingualCrossfadeText
        key={index}
        zh={phrase.zh}
        en={phrase.en}
        className="ambient-phrase-text"
        intervalMs={3400}
      />
    </div>
  )
}
