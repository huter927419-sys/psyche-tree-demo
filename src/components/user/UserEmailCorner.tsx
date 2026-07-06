import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'

interface UserEmailCornerProps {
  email: string | null
  userId: string | null
  locale: Locale
  onLogout: () => void
  className?: string
}

export function UserEmailCorner({
  email,
  userId,
  locale,
  onLogout,
  className = '',
}: UserEmailCornerProps) {
  if (!email) return null

  const ui = getUi(locale)

  return (
    <div className={`app-user-email${className ? ` ${className}` : ''}`}>
      <span className="app-user-email-label">{ui.userEmailLabel}</span>
      <span className="app-user-email-value" title={email}>
        {email}
      </span>
      {userId && (
        <>
          <span className="app-user-email-label">{ui.userIdLabel}</span>
          <span className="app-user-email-id" title={userId}>
            {userId.slice(0, 8)}
          </span>
        </>
      )}
      <button
        type="button"
        className="app-user-email-logout"
        onClick={onLogout}
        title={ui.userLogoutHint}
        aria-label={ui.userLogoutHint}
      >
        {ui.userLogout}
      </button>
    </div>
  )
}
