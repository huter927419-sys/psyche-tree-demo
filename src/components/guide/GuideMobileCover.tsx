import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { BookCoverArt } from '../book/BookCoverArt'

interface GuideMobileCoverProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onOpen: () => void
  onBack: () => void
  opening?: boolean
  title: string
  subtitle: string
  tagline: string
  hint: string
  lead: string
}

export function GuideMobileCover({
  locale,
  onLocaleChange,
  onOpen,
  onBack,
  opening = false,
  title,
  subtitle,
  tagline,
  hint,
  lead,
}: GuideMobileCoverProps) {
  const ui = getUi(locale)

  return (
    <div className="guide-mobile guide-mobile--cover">
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
          {subtitle}
          <span className="guide-mobile-cover-tag">{tagline}</span>
        </p>

        <div className="guide-mobile-cover-art book-mobile-cover-art">
          <BookCoverArt coverId="guide" variant="hero" />
          <div className="guide-mobile-cover-frame" aria-hidden />
          <div className="book-mobile-cover-titles">
            {locale === 'en' ? (
              <h2 className="bookshelf-book-cover-title-en book-mobile-cover-title-en">
                {title}
              </h2>
            ) : (
              <h2
                dir="ltr"
                className="bookshelf-book-cover-title--zh bookshelf-book-cover-title--mystic book-mobile-cover-title-zh"
              >
                {title}
              </h2>
            )}
            <p
              className={
                locale === 'en'
                  ? 'bookshelf-book-cover-sub-en book-mobile-cover-sub'
                  : 'bookshelf-book-cover-sub--zh book-mobile-cover-sub'
              }
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div className="guide-mobile-cover-copy">
          <p className="guide-mobile-cover-lead">{lead}</p>
          <p className="guide-mobile-cover-detail">{hint}</p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          disabled={opening}
          className="book-nav-btn book-nav-btn-primary guide-mobile-cover-open disabled:opacity-50"
        >
          {opening ? ui.coverOpening : ui.guideCoverOpen}
        </button>
      </div>
    </div>
  )
}
