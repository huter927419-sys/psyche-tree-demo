import type { ElementType } from 'react'

interface MysticTitleProps {
  text: string
  className?: string
  as?: ElementType
}

/**
 * Inline per-glyph spans for zh-Hant font fallback (e.g. 緣, 觀).
 * Parent must use horizontal-tb — never pair with vertical-rl + inline-block.
 */
export function MysticTitle({ text, className, as: Tag = 'p' }: MysticTitleProps) {
  const chars = [...text]

  return (
    <Tag className={className}>
      {chars.map((char, index) => (
        <span key={`${index}-${char}`} className="mystic-title-glyph">
          {char}
        </span>
      ))}
    </Tag>
  )
}
