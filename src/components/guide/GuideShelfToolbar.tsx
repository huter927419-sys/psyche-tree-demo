import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'

interface GuideShelfToolbarProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onBack: () => void
  backDisabled?: boolean
}

export function GuideShelfToolbar({
  locale,
  onLocaleChange,
  onBack,
  backDisabled = false,
}: GuideShelfToolbarProps) {
  const ui = getUi(locale)

  return (
    <header className="guide-shelf-toolbar">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className="book-nav-btn book-nav-btn-ghost text-xs shrink-0 disabled:opacity-30"
      >
        {ui.backToShore}
      </button>
      <LanguageToggle
        locale={locale}
        onChange={onLocaleChange}
        label={ui.languageLabel}
        compact
      />
    </header>
  )
}
