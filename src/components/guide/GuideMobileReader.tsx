import { useRef, type ReactNode } from 'react'
import type { Locale } from '../../i18n/locale'
import { formatPageLabel } from '../book/bookUtils'
import { LanguageToggle } from '../i18n/LanguageToggle'

interface GuideMobileReaderProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onClose: () => void
  backLabel: string
  chapterLabel?: string
  pageNumber: number
  totalPages: number
  contentVisible: boolean
  left: ReactNode
  right: ReactNode
  footer: ReactNode
  onPrev: () => void
  onNext: () => void
  prevDisabled: boolean
  nextDisabled: boolean
  prevAria: string
  nextAria: string
  busy: boolean
}

const SWIPE_THRESHOLD_PX = 48

export function GuideMobileReader({
  locale,
  onLocaleChange,
  onClose,
  backLabel,
  chapterLabel,
  pageNumber,
  totalPages,
  contentVisible,
  left,
  right,
  footer,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevAria,
  nextAria,
  busy,
}: GuideMobileReaderProps) {
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || busy) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStartX.current
    const dy = touch.clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0 && !nextDisabled) onNext()
    if (dx > 0 && !prevDisabled) onPrev()
  }

  return (
    <div className="guide-mobile">
      <header className="guide-mobile-header">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="book-nav-btn book-nav-btn-ghost text-xs shrink-0 disabled:opacity-30"
        >
          {backLabel}
        </button>
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label=""
          compact
        />
      </header>

      {chapterLabel && (
        <p className="guide-mobile-chapter">{chapterLabel}</p>
      )}

      <div
        className={`guide-mobile-body${contentVisible ? '' : ' guide-mobile-body--fading'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <article className="guide-mobile-sheet">
          <div className="guide-mobile-flow">
            {left}
            {right}
          </div>
        </article>

        <button
          type="button"
          className="guide-mobile-edge guide-mobile-edge--prev"
          aria-label={prevAria}
          disabled={prevDisabled || busy}
          onClick={onPrev}
        />
        <button
          type="button"
          className="guide-mobile-edge guide-mobile-edge--next"
          aria-label={nextAria}
          disabled={nextDisabled || busy}
          onClick={onNext}
        />
      </div>

      <footer className="guide-mobile-footer">
        <p className="guide-mobile-page-label">
          {formatPageLabel(pageNumber, totalPages, locale)}
        </p>
        {footer}
      </footer>
    </div>
  )
}
