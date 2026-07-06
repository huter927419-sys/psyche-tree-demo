import { PictureImage } from '../media/PictureImage'

interface BookCoverArtProps {
  coverId: string
  /** shelf = narrow spine card; hero = full closed-book face */
  variant?: 'shelf' | 'hero'
}

interface BookPageCoverWatermarkProps {
  coverId: string
  side: 'left' | 'right'
}

const COVER_VERSION = 8

export function coverArtBase(coverId: string): string {
  return `/covers/${coverId}`
}

export function coverArtSrc(coverId: string): string {
  return `${coverArtBase(coverId)}.png?v=${COVER_VERSION}`
}

export function BookPageCoverWatermark({ coverId, side }: BookPageCoverWatermarkProps) {
  return (
    <>
      <PictureImage
        base={coverArtBase(coverId)}
        version={COVER_VERSION}
        alt=""
        className={`book-page-cover-watermark book-page-cover-watermark--${side}`}
        loading="lazy"
        decoding="async"
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
      <PictureImage
        base={coverArtBase(coverId)}
        version={COVER_VERSION}
        alt=""
        className="book-cover-art-img"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div
        className={`book-cover-art-overlay book-cover-art-overlay--${variant}`}
        aria-hidden
      />
    </>
  )
}
