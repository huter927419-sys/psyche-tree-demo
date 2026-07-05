import type { Locale } from '../../i18n/locale'

interface BookshelfVolumeCoverProps {
  locale: Locale
  title: string
  subtitle: string
  tagline: string
}

export function BookshelfVolumeCover({
  locale,
  title,
  subtitle,
  tagline,
}: BookshelfVolumeCoverProps) {
  if (locale === 'zh' || locale === 'zhTw' || locale === 'ja') {
    return (
      <div className="bookshelf-book-cover-body bookshelf-book-cover-body--zh">
        <p className="bookshelf-book-cover-title--zh bookshelf-book-cover-title--mystic">
          {title}
        </p>
        <span className="bookshelf-book-cover-rule" aria-hidden />
        <div className="bookshelf-book-cover-meta--zh">
          <p className="bookshelf-book-cover-sub--zh">{subtitle}</p>
          <p className="bookshelf-book-cover-tag--zh">{tagline}</p>
        </div>
      </div>
    )
  }

  const titleWords = title.split(/\s+/).filter(Boolean)
  const monogram = titleWords.map((word) => word[0]?.toUpperCase() ?? '').join('')

  return (
    <div className="bookshelf-book-cover-body bookshelf-book-cover-body--en">
      <span className="bookshelf-book-spine-mark" aria-hidden>
        {monogram}
      </span>
      <div className="bookshelf-book-cover-main--en">
        <div className="bookshelf-book-cover-title-en">
          {titleWords.map((word) => (
            <span key={word} className="bookshelf-book-cover-title-line">
              {word}
            </span>
          ))}
        </div>
        <span className="bookshelf-book-cover-rule" aria-hidden />
        <div className="bookshelf-book-cover-meta--en">
          <p className="bookshelf-book-cover-sub-en">{subtitle}</p>
          <p className="bookshelf-book-cover-tag-en">{tagline}</p>
        </div>
      </div>
    </div>
  )
}
