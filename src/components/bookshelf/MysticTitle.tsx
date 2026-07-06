import type { ElementType } from 'react'

interface MysticTitleProps {
  text: string
  className?: string
  as?: ElementType
}

/** Inline glyphs for per-character brush font fallback on horizontal titles. */
export function MysticTitle({ text, className, as: Tag = 'p' }: MysticTitleProps) {
  const chars = [...text]

  return (
    <Tag dir="ltr" className={className}>
      {chars.map((char, index) => (
        <span key={`${index}-${char}`} className="mystic-title-glyph">
          {char}
        </span>
      ))}
    </Tag>
  )
}
