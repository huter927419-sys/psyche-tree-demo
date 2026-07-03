import type { CardOption } from '../types'
import { CardImage } from './CardImage'

interface QuestionCardProps {
  card: CardOption
  selected: boolean
  disabled: boolean
  onToggle: () => void
  variant?: 'dark' | 'paper'
  compact?: boolean
}

export function QuestionCard({
  card,
  selected,
  disabled,
  onToggle,
  variant = 'dark',
  compact = false,
}: QuestionCardProps) {
  const isPaper = variant === 'paper'

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`
        group relative w-full text-left transition-all duration-500 overflow-hidden
        border rounded-sm
        ${isPaper
          ? `bg-[rgba(255,252,247,0.85)] border-[rgba(40,35,30,0.1)]
             ${selected
               ? 'border-[rgba(160,120,60,0.55)] shadow-[0_2px_12px_rgba(160,120,60,0.15)] ring-1 ring-[rgba(212,175,122,0.25)]'
               : 'hover:border-[rgba(40,35,30,0.22)] hover:shadow-sm'
             }`
          : `bg-[rgba(10,10,10,0.72)] backdrop-blur-md
             ${selected
               ? 'border-[rgba(212,175,122,0.65)] shadow-[0_0_28px_rgba(212,175,122,0.18)]'
               : 'border-[rgba(200,200,200,0.18)] hover:border-[rgba(200,200,200,0.38)]'
             }`
        }
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div
        className={`relative overflow-hidden border-b ${
          isPaper
            ? 'h-28 md:h-32 border-[rgba(40,35,30,0.06)]'
            : `h-36 md:h-40 border-[rgba(200,200,200,0.08)] ${compact ? 'h-28 md:h-32' : ''}`
        }`}
      >
        <CardImage pattern={card.pattern} />
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            selected
              ? isPaper
                ? 'bg-gradient-to-t from-[rgba(212,175,122,0.12)] to-transparent opacity-100'
                : 'bg-gradient-to-t from-[rgba(212,175,122,0.08)] to-transparent opacity-100'
              : 'opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[rgba(255,255,255,0.04)] to-transparent'
          }`}
        />
        {selected && isPaper && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-[rgba(160,120,60,0.4)] flex items-center justify-center">
            <span className="text-[8px] text-[rgba(120,90,40,0.8)]">印</span>
          </div>
        )}
      </div>
      <div className={compact ? 'p-2.5 md:p-3' : 'p-4 md:p-5'}>
        <h3
          className={`font-serif tracking-wide mb-1 ${
            compact ? 'text-sm md:text-base' : 'text-lg md:text-xl'
          } ${isPaper ? 'text-[#2a2520]' : 'text-[#f5f0e8]'}`}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {card.label}
        </h3>
        <p
          className={`leading-relaxed ${
            compact ? 'text-[11px] md:text-xs line-clamp-2' : 'text-sm'
          } ${isPaper ? 'text-[rgba(42,37,32,0.65)]' : 'text-[rgba(245,240,232,0.68)]'}`}
        >
          {card.description}
        </p>
      </div>
      {selected && !isPaper && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[rgba(212,175,122,0.85)] shadow-[0_0_10px_rgba(212,175,122,0.6)]" />
      )}
    </button>
  )
}
