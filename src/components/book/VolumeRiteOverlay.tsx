import { useEffect, useState } from 'react'
import type { BookId } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { ENTRY_BREATH_INTERVAL_MS } from '../../i18n/volumeRite'
import {
  getTrilingualEntryRite,
  getTrilingualExitRite,
  type TrilingualStep,
} from '../../i18n/volumeRiteTrilingual'
import {
  RiteTrilingualStepBody,
  RiteTrilingualText,
} from '../rite/RiteTrilingualText'

interface VolumeRiteOverlayProps {
  open: boolean
  locale: Locale
  bookId: BookId
  mode: 'entry' | 'exit'
  onComplete: () => void
}

export function VolumeRiteOverlay({
  open,
  locale,
  bookId,
  mode,
  onComplete,
}: VolumeRiteOverlayProps) {
  const ui = getUi(locale)
  const entryRite = mode === 'entry' ? getTrilingualEntryRite(bookId) : null
  const exitSteps: TrilingualStep[] =
    mode === 'exit' ? getTrilingualExitRite(bookId) : []
  const steps = mode === 'entry' ? (entryRite?.steps ?? []) : exitSteps
  const [stepIndex, setStepIndex] = useState(0)
  const [journal, setJournal] = useState('')
  const [breathReady, setBreathReady] = useState(true)

  useEffect(() => {
    if (open) {
      setStepIndex(0)
      setJournal('')
      setBreathReady(mode !== 'entry')
    }
  }, [open, mode, bookId])

  useEffect(() => {
    if (!open || mode !== 'entry' || stepIndex !== 0) {
      setBreathReady(true)
      return
    }
    setBreathReady(false)
    const timer = window.setTimeout(() => setBreathReady(true), ENTRY_BREATH_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [open, mode, stepIndex, bookId])

  if (!open || steps.length === 0) return null

  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1
  const showJournal = Boolean(step.journalPrompt)
  const onBreathIntervalStep = mode === 'entry' && stepIndex === 0
  const canAdvance = !onBreathIntervalStep || breathReady

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

  const localeClass =
    locale === 'en' ? 'en' : locale === 'ja' ? 'ja' : locale === 'zhTw' ? 'zh-tw' : 'zh'

  return (
    <div
      className={`volume-rite-overlay volume-rite-overlay--${mode} volume-rite-overlay--${localeClass}`}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'entry' ? ui.volumeRiteEntryAria : ui.volumeRiteExitAria}
    >
      <div className="volume-rite-panel">
        <header className="volume-rite-header">
          {mode === 'entry' && entryRite && (
            <>
              <RiteTrilingualText
                locale={locale}
                value={entryRite.volumeTitle}
                variant="label"
              />
              <RiteTrilingualText
                locale={locale}
                value={entryRite.facetLabel}
                variant="title"
              />
            </>
          )}
          {mode === 'exit' && (
            <p className="volume-rite-volume">{ui.volumeRiteExitLabel}</p>
          )}
        </header>

        <div className="volume-rite-body">
          <RiteTrilingualText locale={locale} value={step.sectionLabel} variant="label" />
          <RiteTrilingualStepBody locale={locale} step={step} />
          {onBreathIntervalStep && !breathReady && (
            <p className="volume-rite-breath-hint" aria-live="polite">
              {ui.volumeRiteBreathIntervalHint}
            </p>
          )}
          {showJournal && step.journalPrompt && (
            <label className="volume-rite-journal">
              <RiteTrilingualText locale={locale} value={step.journalPrompt} />
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
            disabled={!canAdvance}
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
