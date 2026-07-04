import type { BookDefinition } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'

interface BookshelfProps {
  books: BookDefinition[]
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onSelect: (book: BookDefinition) => void
}

function BookshelfBookCover({
  book,
  locale,
}: {
  book: BookDefinition
  locale: Locale
}) {
  if (locale === 'zh') {
    return (
      <>
        <p className="bookshelf-book-spine-text">{book.meta.spineLabel}</p>
        <p className="bookshelf-book-cover-title">{book.meta.coverTitle}</p>
        <p className="bookshelf-book-cover-sub">{book.meta.coverSubtitle}</p>
        <p className="bookshelf-book-cover-tag">{book.meta.coverTagline}</p>
      </>
    )
  }

  const titleWords = book.meta.coverTitle.split(/\s+/).filter(Boolean)
  const monogram = titleWords.map((word) => word[0]?.toUpperCase() ?? '').join('')

  return (
    <>
      <span className="bookshelf-book-spine-mark" aria-hidden>
        {monogram}
      </span>
      <div className="bookshelf-book-cover-body">
        <div className="bookshelf-book-cover-title-en">
          {titleWords.map((word) => (
            <span key={word} className="bookshelf-book-cover-title-line">
              {word}
            </span>
          ))}
        </div>
        <span className="bookshelf-book-cover-rule" aria-hidden />
        <p className="bookshelf-book-cover-sub-en">{book.meta.coverSubtitle}</p>
        <p className="bookshelf-book-cover-tag-en">{book.meta.coverTagline}</p>
      </div>
    </>
  )
}

export function Bookshelf({
  books,
  locale,
  onLocaleChange,
  onSelect,
}: BookshelfProps) {
  const ui = getUi(locale)

  return (
    <div
      className={`bookshelf-scene min-h-screen flex flex-col items-center justify-center px-4 py-12${locale === 'en' ? ' bookshelf-scene--en' : ''}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label={ui.languageLabel}
        />
      </div>

      <p className="text-[10px] tracking-[0.55em] uppercase text-[rgba(255,255,255,0.35)] mb-4 animate-fade-in">
        {ui.shelfEyebrow}
      </p>
      <h1
        className="font-serif text-3xl md:text-4xl text-[#f0f0f0] text-center mb-3 animate-fade-in"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {ui.shelfTitle}
      </h1>
      <p className="text-sm text-[rgba(240,240,240,0.5)] text-center mb-14 max-w-md leading-relaxed animate-fade-in">
        {ui.shelfIntro}
        <br />
        {ui.shelfIntro2}
      </p>

      <div className="bookshelf-unit w-full max-w-[720px]">
        <div className="bookshelf-row">
          {books.map((book, i) => (
            <button
              key={book.meta.id}
              type="button"
              className={`bookshelf-book animate-fade-in ${book.meta.accent === 'silver' ? 'bookshelf-book-silver' : 'bookshelf-book-gold'}`}
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              onClick={() => onSelect(book)}
            >
              <div className="bookshelf-book-glow" aria-hidden />
              <div
                className={`bookshelf-book-cover${locale === 'en' ? ' bookshelf-book-cover--en' : ''}`}
              >
                <div className="bookshelf-book-texture" aria-hidden />
                <BookshelfBookCover book={book} locale={locale} />
              </div>
              <div className="bookshelf-book-pages" aria-hidden />
            </button>
          ))}
        </div>
        <div className="bookshelf-mist-platform" aria-hidden />
      </div>

      <p className="mt-12 text-xs text-[rgba(200,200,200,0.3)] tracking-[0.35em]">
        {ui.shelfFooter(books.length)}
      </p>
    </div>
  )
}
