interface BookCoverArtProps {
  coverId: string
  /** shelf = narrow spine card; hero = full closed-book face */
  variant?: 'shelf' | 'hero'
}

interface BookPageCoverWatermarkProps {
  coverId: string
  side: 'left' | 'right'
}

const COVER_VERSION = 7

export function coverArtSrc(coverId: string): string {
  return `/covers/${coverId}.png?v=${COVER_VERSION}`
}

export function BookPageCoverWatermark({ coverId, side }: BookPageCoverWatermarkProps) {
  return (
    <>
      <img
        src={coverArtSrc(coverId)}
        alt=""
        className={`book-page-cover-watermark book-page-cover-watermark--${side}`}
        loading="lazy"
        draggable={false}
        aria-hidden
      />
      <div className="book-page-cover-watermark-veil" aria-hidden />
    </>
  )
}

export function BookCoverArt({ coverId, variant = 'hero' }: BookCoverArtProps) {
  return (
    <>
      <img
        src={coverArtSrc(coverId)}
        alt=""
        className="book-cover-art-img"
        loading="lazy"
        draggable={false}
      />
      <div
        className={`book-cover-art-overlay book-cover-art-overlay--${variant}`}
        aria-hidden
      />
    </>
  )
}
