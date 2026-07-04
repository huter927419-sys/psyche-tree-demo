import type { Locale } from '../../i18n/locale'
import { LOCALE_CODES, LOCALE_LABELS } from '../../i18n/locale'

interface LanguageToggleProps {
  locale: Locale
  onChange: (locale: Locale) => void
  label?: string
  compact?: boolean
}

export function LanguageToggle({
  locale,
  onChange,
  label,
  compact = false,
}: LanguageToggleProps) {
  return (
    <div
      className={`language-toggle${compact ? ' language-toggle-compact' : ''}`}
      role="group"
      aria-label={label ?? 'Language'}
    >
      {label && !compact && (
        <span className="language-toggle-label">{label}</span>
      )}
      {LOCALE_CODES.map((code) => (
        <button
          key={code}
          type="button"
          className={`language-toggle-btn${locale === code ? ' is-active' : ''}`}
          onClick={() => onChange(code)}
          aria-pressed={locale === code}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
