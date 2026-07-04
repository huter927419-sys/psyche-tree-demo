import type { BookDefinition } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { BilingualCrossfadeText } from '../i18n/BilingualCrossfadeText'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { BookClosedVisual } from './BookClosedVisual'

interface BookCoverProps {
  book: BookDefinition
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onOpen: () => void
  onBack: () => void
  opening?: boolean
}

export function BookCover({
  book,
  locale,
  onLocaleChange,
  onOpen,
  onBack,
  opening = false,
}: BookCoverProps) {
  const ui = getUi(locale)
  const zhBook =
    book.meta.id === 'emotional-flow'
      ? { sub: '八维情感', tag: '照见此刻感受' }
      : { sub: '七维内观', tag: '树影逐层展开' }
  const enBook =
    book.meta.id === 'emotional-flow'
      ? { sub: 'Eight dimensions', tag: 'See what you feel now' }
      : { sub: 'Seven inner dimensions', tag: 'Shadows of the tree unfold' }

  return (
    <div className="book-cover-scene book-scene flex flex-col items-center justify-center min-h-[min(88vh,920px)] px-4 py-6 md:py-8">
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
            <span className="book-cover-eyebrow-line">{enBook.sub}</span>
            <span className="book-cover-eyebrow-line book-cover-eyebrow-tag">
              {enBook.tag}
            </span>
          </>
        ) : (
          <BilingualCrossfadeText
            zh={`${zhBook.sub} · ${zhBook.tag}`}
            en={`${enBook.sub} · ${enBook.tag}`}
            activeLocale={locale}
            intervalMs={4500}
          />
        )}
      </p>

      <div className="book-cover-book-wrap">
        <BookClosedVisual
          book={book}
          locale={locale}
          size="hero"
          motion={opening ? 'opening' : 'idle'}
        />
      </div>

      <div className="book-cover-copy">
        <p className="book-cover-lead">{ui.coverOpenHint}</p>
        <p className="book-cover-detail">{book.meta.coverHint}</p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        className="book-nav-btn book-nav-btn-primary book-cover-open-btn disabled:opacity-50"
      >
        {opening ? ui.coverOpening : ui.coverOpen}
      </button>
    </div>
  )
}
