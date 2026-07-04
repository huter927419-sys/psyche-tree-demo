import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import {
  getTrilingualCoreProposition,
  getTrilingualReturnToTree,
} from '../../i18n/volumeRiteTrilingual'
import {
  RiteTrilingualStepBody,
  RiteTrilingualText,
} from '../rite/RiteTrilingualText'

interface ReturnToTreeOverlayProps {
  open: boolean
  locale: Locale
  onComplete: () => void
}

type Phase = 'rite' | 'proposition' | 'closing'

export function ReturnToTreeOverlay({
  open,
  locale,
  onComplete,
}: ReturnToTreeOverlayProps) {
  const ui = getUi(locale)
  const rite = getTrilingualReturnToTree()
  const proposition = getTrilingualCoreProposition()
  const [phase, setPhase] = useState<Phase>('rite')
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setPhase('rite')
      setStepIndex(0)
    }
  }, [open])

  if (!open) return null

  const steps = rite.steps
  const currentStep = steps[stepIndex]

  const handleNext = () => {
    if (phase === 'rite') {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1)
      } else {
        setPhase('proposition')
      }
      return
    }
    if (phase === 'proposition') {
      setPhase('closing')
      return
    }
    onComplete()
  }

  const handlePrev = () => {
    if (phase === 'closing') {
      setPhase('proposition')
      return
    }
    if (phase === 'proposition') {
      setPhase('rite')
      setStepIndex(steps.length - 1)
      return
    }
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const prevDisabled = phase === 'rite' && stepIndex === 0

  const localeClass =
    locale === 'en' ? 'en' : locale === 'ja' ? 'ja' : locale === 'zhTw' ? 'zh-tw' : 'zh'

  return (
    <div
      className={`return-tree-overlay return-tree-overlay--${localeClass}`}
      role="dialog"
      aria-modal="true"
      aria-label={ui.returnToTreeAria}
    >
      <div className="return-tree-panel">
        <header className="return-tree-header">
          <RiteTrilingualText locale={locale} value={rite.tag} variant="label" />
          <RiteTrilingualText locale={locale} value={rite.title} variant="title" />
          <RiteTrilingualText locale={locale} value={rite.subtitle} variant="label" />
        </header>

        <div className="return-tree-body">
          {phase === 'closing' ? (
            <RiteTrilingualText locale={locale} value={rite.closing} />
          ) : phase === 'proposition' ? (
            <div className="return-tree-proposition">
              <p className="return-tree-proposition-label">{ui.corePropositionLabel}</p>
              <RiteTrilingualText locale={locale} value={proposition.main} variant="title" />
              <RiteTrilingualText locale={locale} value={proposition.sub} />
            </div>
          ) : (
            currentStep && (
              <>
                <RiteTrilingualText locale={locale} value={currentStep.sectionLabel} variant="label" />
                <RiteTrilingualStepBody locale={locale} step={currentStep} />
              </>
            )
          )}
        </div>

        <footer className="return-tree-footer">
          <button
            type="button"
            className="book-nav-btn book-nav-btn-ghost"
            onClick={handlePrev}
            disabled={prevDisabled}
          >
            {ui.volumeRitePrev}
          </button>
          <button
            type="button"
            className="book-nav-btn book-nav-btn-primary"
            onClick={handleNext}
          >
            {phase === 'closing' ? ui.returnToTreeContinue : ui.volumeRiteNext}
          </button>
        </footer>
      </div>
    </div>
  )
}
