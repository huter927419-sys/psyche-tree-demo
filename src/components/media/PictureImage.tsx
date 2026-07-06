import { forwardRef } from 'react'
import type { ImgHTMLAttributes } from 'react'

interface PictureImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Path without extension, e.g. `/guide/01-shore-near` */
  base: string
  version?: number
  /** When false, only serve PNG (e.g. missing webp). */
  webp?: boolean
}

export const PictureImage = forwardRef<HTMLImageElement, PictureImageProps>(
  function PictureImage(
    { base, version = 1, webp = true, alt = '', ...imgProps },
    ref,
  ) {
    const query = version > 0 ? `?v=${version}` : ''

    if (!webp) {
      return <img ref={ref} src={`${base}.png${query}`} alt={alt} {...imgProps} />
    }

    return (
      <picture>
        <source srcSet={`${base}.webp${query}`} type="image/webp" />
        <img ref={ref} src={`${base}.png${query}`} alt={alt} {...imgProps} />
      </picture>
    )
  },
)

/** Warm browser cache — prefers WebP when available. */
export function prefetchImage(base: string, version = 1): void {
  if (typeof window === 'undefined') return
  const query = version > 0 ? `?v=${version}` : ''
  const img = new Image()
  img.decoding = 'async'
  img.src = `${base}.webp${query}`
  img.onerror = () => {
    const fallback = new Image()
    fallback.decoding = 'async'
    fallback.src = `${base}.png${query}`
  }
}
