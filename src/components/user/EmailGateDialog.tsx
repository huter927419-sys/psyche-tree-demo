import { useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { createJourney } from '../../services/journeyApi'

interface EmailGateDialogProps {
  open: boolean
  locale: Locale
  onClose: () => void
  onReady: (payload: { email: string; userId: string }) => void
}

export function EmailGateDialog({
  open,
  locale,
  onClose,
  onReady,
}: EmailGateDialogProps) {
  const ui = getUi(locale)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await createJourney(email, locale)
      onReady({
        email: data.email,
        userId: data.userId,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : ui.emailGateFail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="email-gate-overlay" role="dialog" aria-modal="true">
      <div className="email-gate-panel">
        <p className="email-gate-eyebrow">{ui.emailGateEyebrow}</p>
        <h2 className="email-gate-title">{ui.emailGateTitle}</h2>
        <p className="email-gate-hint">{ui.emailGateHint}</p>
        <label className="email-gate-label" htmlFor="journey-email">
          {ui.emailLabel}
        </label>
        <input
          id="journey-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-gate-input"
          placeholder={ui.emailPlaceholder}
        />
        {error && <p className="email-gate-error">{error}</p>}
        <div className="email-gate-actions">
          <button
            type="button"
            className="book-nav-btn book-nav-btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            {ui.emailGateCancel}
          </button>
          <button
            type="button"
            className="book-nav-btn book-nav-btn-primary"
            onClick={() => void submit()}
            disabled={loading || !email.trim()}
          >
            {loading ? ui.emailGateSaving : ui.emailGateContinue}
          </button>
        </div>
      </div>
    </div>
  )
}
