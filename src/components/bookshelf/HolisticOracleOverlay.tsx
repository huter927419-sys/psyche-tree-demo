import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { ORACLE_FACET_ICONS, OracleFacetIcon } from './oracleFacetIcons'

const SYMBOL_REVEAL_MS = 1800

interface HolisticOracleOverlayProps {
  open: boolean
  locale: Locale
  reading: string
  onClosed: () => void
}

export function HolisticOracleOverlay({
  open,
  locale,
  reading,
  onClosed,
}: HolisticOracleOverlayProps) {
  const ui = getUi(locale)
  const [symbolsDone, setSymbolsDone] = useState(false)

  useEffect(() => {
    if (!open) {
      setSymbolsDone(false)
      return
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setSymbolsDone(true)
      return
    }

    setSymbolsDone(false)
    const timer = window.setTimeout(() => {
      setSymbolsDone(true)
    }, SYMBOL_REVEAL_MS)

    return () => window.clearTimeout(timer)
  }, [open, reading])

  if (!open) return null

  return (
    <div
      className="holistic-oracle-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={ui.ultimateOracleAria}
    >
      <button
        type="button"
        className="holistic-oracle-backdrop"
        aria-label={ui.ultimateOracleClose}
        onClick={onClosed}
      />

      <div className={`holistic-oracle-panel holistic-oracle-panel--${locale}`}>
        <header className="holistic-oracle-header">
          <p className="holistic-oracle-eyebrow">{ui.holisticTag}</p>
          <p className="holistic-oracle-chapter">{ui.holisticChapterLabel}</p>
          <button
            type="button"
            className="holistic-oracle-close"
            onClick={onClosed}
            aria-label={ui.ultimateOracleClose}
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <div
          className={`holistic-oracle-symbols${symbolsDone ? ' holistic-oracle-symbols--settled' : ''}`}
          aria-hidden
        >
          {ORACLE_FACET_ICONS.map((id, index) => (
            <div
              key={id}
              className="holistic-oracle-symbol-slot"
              style={{ animationDelay: `${index * 0.14}s` }}
            >
              <OracleFacetIcon id={id} />
            </div>
          ))}
        </div>

        <div
          className={`holistic-oracle-reading-wrap${symbolsDone ? ' holistic-oracle-reading-wrap--visible' : ''}`}
        >
          <h2 className="holistic-oracle-title">{ui.holisticTitle}</h2>
          <p className="holistic-oracle-hint">{ui.holisticHint}</p>
          <p className="holistic-oracle-hint mt-2 opacity-80">{ui.oracleContemplationNote}</p>
          <p className="holistic-oracle-reading whitespace-pre-line">{reading}</p>
        </div>

        <div className="holistic-oracle-actions">
          <button
            type="button"
            className="book-nav-btn book-nav-btn-ghost holistic-oracle-close-btn"
            onClick={onClosed}
          >
            {ui.ultimateOracleClose}
          </button>
        </div>
      </div>
    </div>
  )
}
