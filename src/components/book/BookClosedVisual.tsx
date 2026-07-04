import type { BookDefinition } from '../../books/types'
import type { Locale } from '../../i18n/locale'

interface BookClosedVisualProps {
  book: BookDefinition
  locale?: Locale
  size?: 'default' | 'hero'
  /** opening = cover swings open; closing = cover folds shut */
  motion?: 'idle' | 'opening' | 'closing'
  compact?: boolean
}

export function BookClosedVisual({
  book,
  locale = 'zh',
  size = 'default',
  motion = 'idle',
  compact = false,
}: BookClosedVisualProps) {
  const accentClass =
    book.meta.accent === 'silver' ? 'book-cover-silver' : 'book-cover-gold'

  const motionClass =
    motion === 'opening'
      ? 'book-closed-opening'
      : motion === 'closing'
        ? 'book-closed-closing'
        : ''

  return (
    <div
      className={`book-closed-visual${size === 'hero' ? ' book-closed-visual--hero' : ''}${compact ? ' book-closed-visual-compact' : ''}`}
    >
      <div className="book-perspective mx-auto">
        <div className={`book-closed ${motionClass} ${accentClass}`}>
          <div className="book-cover-spine-side" aria-hidden />
          <div className="book-cover-face">
            <div className="book-cover-texture" aria-hidden />
            <div className="book-cover-ornament top" aria-hidden />
            <h2
              className={
                locale === 'en'
                  ? 'font-serif text-[#f0f0f0] text-center leading-snug mb-1 px-1 text-lg sm:text-xl tracking-[0.04em]'
                  : 'book-cover-title-mystic'
              }
              style={
                locale === 'en' ? { fontFamily: 'var(--font-serif)' } : undefined
              }
            >
              {locale === 'en'
                ? book.meta.coverTitle.split(/\s+/).map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))
                : book.meta.coverTitle}
            </h2>
            <p
              className="font-serif text-sm text-[rgba(240,240,240,0.55)] text-center mb-3 px-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {book.meta.coverSubtitle}
            </p>
            <div className="book-cover-divider" aria-hidden />
            <p className="text-[10px] text-[rgba(200,200,200,0.4)] text-center tracking-widest mt-4">
              {book.meta.coverTagline}
            </p>
            <div className="book-cover-ornament bottom" aria-hidden />
          </div>
          <div className="book-cover-pages-edge" aria-hidden />
        </div>
        <div className="book-shadow-plate cover" aria-hidden />
      </div>
    </div>
  )
}
