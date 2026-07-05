import { getGuideCoverBook } from '../../books/guide/meta'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { BilingualCrossfadeText } from '../i18n/BilingualCrossfadeText'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { BookClosedVisual } from '../book/BookClosedVisual'

interface GuideCoverProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onOpen: () => void
  onBack: () => void
  opening?: boolean
}

export function GuideCover({
  locale,
  onLocaleChange,
  onOpen,
  onBack,
  opening = false,
}: GuideCoverProps) {
  const ui = getUi(locale)
  const book = getGuideCoverBook(locale)

  return (
    <div className="guide-book-scene book-cover-scene book-scene flex flex-col items-center min-h-[min(88vh,920px)] px-4 py-6 md:py-8">
      <header className="book-cover-header">
        <button
          type="button"
          onClick={onBack}
          className="book-nav-btn book-nav-btn-ghost text-xs shrink-0"
        >
          {ui.backToShore}
        </button>
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label={ui.languageLabel}
          compact
        />
      </header>

      <p
        className={`book-cover-eyebrow${locale === 'en' ? ' book-cover-eyebrow--en' : ''}`}
      >
        {locale === 'en' ? (
          <>
            <span className="book-cover-eyebrow-line">{book.meta.coverSubtitle}</span>
            <span className="book-cover-eyebrow-line book-cover-eyebrow-tag">
              {book.meta.coverTagline}
            </span>
          </>
        ) : (
          <BilingualCrossfadeText
            zh={`${book.meta.coverSubtitle} · ${book.meta.coverTagline}`}
            en={`${book.meta.coverSubtitle} · ${book.meta.coverTagline}`}
            ja={`${book.meta.coverSubtitle} · ${book.meta.coverTagline}`}
            activeLocale={locale}
            intervalMs={4500}
          />
        )}
      </p>

      <div className="guide-book-anchor guide-book-anchor--closed book-cover-book-wrap">
        <BookClosedVisual
          book={book}
          locale={locale}
          size="hero"
          coverArtId="guide"
          motion={opening ? 'opening' : 'idle'}
        />
      </div>

      <div className="book-cover-copy">
        <p className="book-cover-lead">{ui.guideCoverOpenHint}</p>
        <p className="book-cover-detail">{book.meta.coverHint}</p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        className="book-nav-btn book-nav-btn-primary book-cover-open-btn disabled:opacity-50"
      >
        {opening ? ui.coverOpening : ui.guideCoverOpen}
      </button>
    </div>
  )
}
