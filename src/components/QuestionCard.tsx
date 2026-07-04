import type { CardOption } from '../types'
import { useLocale } from '../i18n/locale'
import { getUi } from '../i18n/ui'
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
  const { locale } = useLocale()
  const ui = getUi(locale)
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
          ? `bg-[rgba(255,255,255,0.06)] backdrop-blur-md border-[rgba(255,255,255,0.12)]
             ${selected
               ? 'border-[rgba(255,255,255,0.55)] shadow-[0_0_24px_rgba(255,255,255,0.12)] ring-1 ring-[rgba(255,255,255,0.2)]'
               : 'hover:border-[rgba(255,255,255,0.28)] hover:shadow-[0_0_16px_rgba(255,255,255,0.06)]'
             }`
          : `bg-[rgba(8,8,8,0.72)]
             ${selected
               ? 'border-[rgba(255,255,255,0.65)] shadow-[0_0_28px_rgba(255,255,255,0.18)]'
               : 'border-[rgba(200,200,200,0.18)] hover:border-[rgba(200,200,200,0.38)]'
             }`
        }
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div
        className={`relative overflow-hidden border-b ${
          isPaper
            ? 'h-28 md:h-32 border-[rgba(255,255,255,0.08)]'
            : `h-36 md:h-40 border-[rgba(200,200,200,0.08)] ${compact ? 'h-28 md:h-32' : ''}`
        }`}
      >
        <CardImage pattern={card.pattern} />
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            selected
              ? 'bg-gradient-to-t from-[rgba(255,255,255,0.12)] to-transparent opacity-100'
              : 'opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[rgba(255,255,255,0.05)] to-transparent'
          }`}
        />
        {selected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-[rgba(255,255,255,0.35)] flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.25)]">
            <span className="text-[8px] text-[rgba(255,255,255,0.85)]">{ui.cardLight}</span>
          </div>
        )}
      </div>
      <div className={compact ? 'p-2.5 md:p-3' : 'p-4 md:p-5'}>
        <h3
          className={`font-serif tracking-wide mb-1 ${
            compact ? 'text-sm md:text-base' : 'text-lg md:text-xl'
          } text-[#f0f0f0]`}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {card.label}
        </h3>
        <p
          className={`leading-relaxed ${
            compact ? 'text-[11px] md:text-xs line-clamp-2' : 'text-sm'
          } text-[rgba(200,200,200,0.62)]`}
        >
          {card.description}
        </p>
      </div>
    </button>
  )
}
