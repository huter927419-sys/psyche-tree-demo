import { useEffect, useState } from 'react'
import type { BookId } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getOpeningGuide } from '../../i18n/openingGuide'

/** Total on-screen time (ms) — enough to read the rite once */
const DISPLAY_MS = 2800
/** Fade-out duration (ms) */
const FADE_MS = 650

interface BookOpeningGuideProps {
  bookId: BookId
  locale: Locale
}

export function BookOpeningGuide({ bookId, locale }: BookOpeningGuideProps) {
  const [phase, setPhase] = useState<'hidden' | 'enter' | 'hold' | 'exit'>('hidden')

  useEffect(() => {
    setPhase('enter')

    const holdTimer = window.setTimeout(() => setPhase('hold'), 80)
    const exitTimer = window.setTimeout(() => setPhase('exit'), DISPLAY_MS - FADE_MS)
    const hideTimer = window.setTimeout(() => setPhase('hidden'), DISPLAY_MS)

    return () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(hideTimer)
    }
  }, [bookId])

  if (phase === 'hidden') return null

  const copy = getOpeningGuide(bookId, locale)
  const isVisible = phase === 'enter' || phase === 'hold' || phase === 'exit'

  return (
    <div
      className={`book-opening-guide book-opening-guide--${phase}`}
      role="presentation"
      aria-hidden={!isVisible}
    >
      <div className="book-opening-guide-panel">
        <div className="book-opening-guide-halo" aria-hidden />
        <div className="book-opening-guide-ornament" aria-hidden>
          <span />
          <span className="book-opening-guide-diamond">◇</span>
          <span />
        </div>
        <p className="book-opening-guide-tag">{copy.tag}</p>
        <p className="book-opening-guide-title">{copy.title}</p>
        <p className="book-opening-guide-body">{copy.body}</p>
        <div className="book-opening-guide-ornament book-opening-guide-ornament--bottom" aria-hidden>
          <span />
        </div>
      </div>
    </div>
  )
}
