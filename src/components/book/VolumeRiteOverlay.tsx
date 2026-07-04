import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import type { RiteStep, VolumeEntryRite } from '../../i18n/volumeRite'

interface VolumeRiteOverlayProps {
  open: boolean
  locale: Locale
  mode: 'entry' | 'exit'
  entryRite?: VolumeEntryRite
  exitSteps?: RiteStep[]
  onComplete: () => void
}

function renderStepBody(step: RiteStep) {
  return (
    <>
      {step.title && <p className="volume-rite-step-title">{step.title}</p>}
      {step.paragraphs.map((line, i) => (
        <p key={i} className="volume-rite-line">
          {line}
        </p>
      ))}
    </>
  )
}

export function VolumeRiteOverlay({
  open,
  locale,
  mode,
  entryRite,
  exitSteps = [],
  onComplete,
}: VolumeRiteOverlayProps) {
  const ui = getUi(locale)
  const steps =
    mode === 'entry' ? (entryRite?.steps ?? []) : exitSteps
  const [stepIndex, setStepIndex] = useState(0)
  const [journal, setJournal] = useState('')

  useEffect(() => {
    if (open) {
      setStepIndex(0)
      setJournal('')
    }
  }, [open, mode])

  if (!open || steps.length === 0) return null

  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1
  const showJournal = Boolean(step.journalPrompt)

  const handleNext = () => {
    if (isLast) {
      onComplete()
      setStepIndex(0)
      setJournal('')
      return
    }
    setStepIndex((i) => i + 1)
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  return (
    <div
      className={`volume-rite-overlay volume-rite-overlay--${mode} volume-rite-overlay--${locale}`}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'entry' ? ui.volumeRiteEntryAria : ui.volumeRiteExitAria}
    >
      <div className="volume-rite-panel">
        <header className="volume-rite-header">
          {mode === 'entry' && entryRite && (
            <>
              <p className="volume-rite-volume">{entryRite.volumeTitle}</p>
              <p className="volume-rite-facet">{entryRite.facetLabel}</p>
            </>
          )}
          {mode === 'exit' && (
            <p className="volume-rite-volume">{ui.volumeRiteExitLabel}</p>
          )}
        </header>

        <div className="volume-rite-body">
          <p className="volume-rite-section">{step.sectionLabel}</p>
          {renderStepBody(step)}
          {showJournal && (
            <label className="volume-rite-journal">
              <span className="volume-rite-journal-prompt">{step.journalPrompt}</span>
              <textarea
                className="volume-rite-journal-input"
                rows={3}
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder={ui.volumeRiteJournalOptional}
              />
            </label>
          )}
        </div>

        <div className="volume-rite-progress" aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`volume-rite-dot${i === stepIndex ? ' volume-rite-dot--active' : ''}${i < stepIndex ? ' volume-rite-dot--done' : ''}`}
            />
          ))}
        </div>

        <footer className="volume-rite-footer">
          <button
            type="button"
            className="book-nav-btn book-nav-btn-ghost"
            onClick={handlePrev}
            disabled={stepIndex === 0}
          >
            {ui.volumeRitePrev}
          </button>
          <button
            type="button"
            className="book-nav-btn book-nav-btn-primary"
            onClick={handleNext}
          >
            {isLast
              ? mode === 'entry'
                ? ui.volumeRiteBegin
                : ui.volumeRiteSeeResult
              : ui.volumeRiteNext}
          </button>
        </footer>
      </div>
    </div>
  )
}
