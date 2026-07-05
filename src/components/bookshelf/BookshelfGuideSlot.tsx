import type { CSSProperties } from 'react'
import type { GuideShelfState } from '../../books/guide'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { BookshelfVolumeCover } from './BookshelfVolumeCover'
import { BookCoverArt } from '../book/BookCoverArt'

interface BookshelfGuideSlotProps {
  locale: Locale
  shelfState: GuideShelfState
  showFirstVisitHint: boolean
  onOpen: () => void
}

export function BookshelfGuideSlot({
  locale,
  shelfState,
  showFirstVisitHint,
  onOpen,
}: BookshelfGuideSlotProps) {
  const ui = getUi(locale)
  const unread = shelfState === 'unread'

  return (
    <div className="bookshelf-guide-block animate-fade-in">
      <button
        type="button"
        className={`bookshelf-book bookshelf-book-gold animate-fade-in${unread ? ' bookshelf-book--beacon' : ''}`}
        style={
          {
            '--fade-in-delay': '0.08s',
            '--book-tilt': '-12deg',
            '--book-depth': '6px',
          } as CSSProperties
        }
        onClick={onOpen}
        aria-label={ui.guideCoverTitle}
      >
        <div className="bookshelf-book-glow" aria-hidden />
        <div className="bookshelf-book-volume">
          <div className="bookshelf-book-spine-face" aria-hidden />
          <div
            className={`bookshelf-book-cover bookshelf-book-cover--art${locale === 'en' ? ' bookshelf-book-cover--en' : ''}`}
          >
            <BookCoverArt coverId="guide" variant="shelf" />
            <div className="bookshelf-book-texture" aria-hidden />
            <div className="bookshelf-book-cover-sheen" aria-hidden />
            <BookshelfVolumeCover
              locale={locale}
              title={ui.guideCoverTitle}
              subtitle={ui.guideCoverSubtitle}
              tagline={ui.guideCoverShelfTagline}
            />
          </div>
          <div className="bookshelf-book-pages" aria-hidden>
            <span className="bookshelf-book-pages-edge" aria-hidden />
          </div>
          <div className="bookshelf-book-top-face" aria-hidden />
        </div>
        <div className="bookshelf-book-cast-shadow" aria-hidden />
      </button>

      {showFirstVisitHint && (
        <p className="bookshelf-guide-first-hint">{ui.guideFirstVisitHint}</p>
      )}
    </div>
  )
}
