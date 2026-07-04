import { useCallback, useEffect, useRef, useState } from 'react'

interface QuestionSealRevealProps {
  mark: string
  label: string
  prompt: string
  hint: string
  ariaLabel: string
  autoHideMs?: number
}

export function QuestionSealReveal({
  mark,
  label,
  prompt,
  hint,
  ariaLabel,
  autoHideMs = 4200,
}: QuestionSealRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const hideTimer = useRef<number | null>(null)
  const unmountTimer = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    if (unmountTimer.current !== null) {
      window.clearTimeout(unmountTimer.current)
      unmountTimer.current = null
    }
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const reveal = () => {
    clearTimers()
    setMounted(true)
    requestAnimationFrame(() => setActive(true))

    hideTimer.current = window.setTimeout(() => {
      setActive(false)
      unmountTimer.current = window.setTimeout(() => {
        setMounted(false)
        unmountTimer.current = null
      }, 550)
    }, autoHideMs)
  }

  return (
    <div className="book-question-seal">
      <button
        type="button"
        className="book-question-seal-trigger"
        onClick={reveal}
        aria-expanded={mounted && active}
        aria-label={ariaLabel}
      >
        <span className="book-question-seal-mark">{mark}</span>
        <span className="book-question-seal-hint">{hint}</span>
      </button>

      {mounted && (
        <div
          className={`book-question-seal-panel${active ? ' is-visible' : ''}`}
          role="region"
          aria-label={label}
        >
          <p className="book-question-scenario-label">{label}</p>
          <p className="book-question-scenario">{prompt}</p>
        </div>
      )}
    </div>
  )
}
