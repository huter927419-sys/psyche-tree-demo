import type { ElementType } from 'react'

interface MysticTitleProps {
  text: string
  className?: string
  as?: ElementType
}

/** Per-glyph spans so zh-Hant cover titles (e.g. 緣書, 同觀) resolve brush fonts per character. */
export function MysticTitle({ text, className, as: Tag = 'p' }: MysticTitleProps) {
  const chars = [...text]

  return (
    <Tag className={className}>
      {chars.map((char, index) => (
        <span key={`${index}-${char}`} className="mystic-title-char">
          {char}
        </span>
      ))}
    </Tag>
  )
}
