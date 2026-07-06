import type { BookDefinition } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { volumeCoverArtId } from '../../books/volumeCovers'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { BookCoverArt } from './BookCoverArt'

interface BookMobileCoverProps {
  book: BookDefinition
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onOpen: () => void
  onBack: () => void
  opening?: boolean
  reviewMode?: boolean
}

export function BookMobileCover({
  book,
  locale,
  onLocaleChange,
  onOpen,
  onBack,
  opening = false,
  reviewMode = false,
}: BookMobileCoverProps) {
  const ui = getUi(locale)
  const accentClass =
    book.meta.accent === 'silver' ? 'book-mobile-cover--silver' : 'book-mobile-cover--gold'

  const coverArtId = volumeCoverArtId(book.meta.id) ?? book.meta.id

  return (
    <div className={`guide-mobile guide-mobile--cover book-mobile-cover ${accentClass}`}>
      <header className="guide-mobile-header">
        <button
          type="button"
          onClick={onBack}
          className="book-nav-btn book-nav-btn-ghost text-xs shrink-0"
        >
          {ui.backToShore}
        </button>
        <LanguageToggle locale={locale} onChange={onLocaleChange} label="" compact />
      </header>

      <div className="guide-mobile-cover-main">
        <p className="guide-mobile-cover-eyebrow">
          {book.meta.coverSubtitle}
          <span className="guide-mobile-cover-tag">{book.meta.coverTagline}</span>
        </p>

        <div className="guide-mobile-cover-art book-mobile-cover-art">
          <BookCoverArt coverId={coverArtId} variant="hero" />
          <div className="guide-mobile-cover-frame" aria-hidden />
          <div className="book-mobile-cover-titles">
            <h2
              className={
                locale === 'en'
                  ? 'bookshelf-book-cover-title-en book-mobile-cover-title-en'
                  : 'bookshelf-book-cover-title--zh bookshelf-book-cover-title--mystic book-mobile-cover-title-zh'
              }
            >
              {book.meta.coverTitle}
            </h2>
            <p
              className={
                locale === 'en'
                  ? 'bookshelf-book-cover-sub-en book-mobile-cover-sub'
                  : 'bookshelf-book-cover-sub--zh book-mobile-cover-sub'
              }
            >
              {book.meta.coverSubtitle}
            </p>
          </div>
        </div>

        <div className="guide-mobile-cover-copy">
          <p className="guide-mobile-cover-lead">
            {reviewMode ? ui.coverReviewHint : ui.coverOpenHint}
          </p>
          {!reviewMode && (
            <p className="guide-mobile-cover-detail">{book.meta.coverHint}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          disabled={opening}
          className="book-nav-btn book-nav-btn-primary guide-mobile-cover-open disabled:opacity-50"
        >
          {opening ? ui.coverOpening : reviewMode ? ui.coverReview : ui.coverOpen}
        </button>
      </div>
    </div>
  )
}
