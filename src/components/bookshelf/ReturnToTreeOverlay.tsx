import { useEffect, useState } from 'react'
import type { Locale } from '../../i18n/locale'
import { getCoreProposition, getReturnToTreeRite } from '../../i18n/volumeRite'
import { getUi } from '../../i18n/ui'

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
  const rite = getReturnToTreeRite(locale)
  const proposition = getCoreProposition(locale)
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

  return (
    <div
      className={`return-tree-overlay return-tree-overlay--${locale}`}
      role="dialog"
      aria-modal="true"
      aria-label={ui.returnToTreeAria}
    >
      <div className="return-tree-panel">
        <header className="return-tree-header">
          <p className="return-tree-tag">{rite.tag}</p>
          <h2 className="return-tree-title">{rite.title}</h2>
          <p className="return-tree-subtitle">{rite.subtitle}</p>
        </header>

        <div className="return-tree-body">
          {phase === 'closing' ? (
            <p className="return-tree-closing">{rite.closing}</p>
          ) : phase === 'proposition' ? (
            <div className="return-tree-proposition">
              <p className="return-tree-proposition-label">{ui.corePropositionLabel}</p>
              <p className="return-tree-proposition-main">{proposition.main}</p>
              <p className="return-tree-proposition-sub">{proposition.sub}</p>
            </div>
          ) : (
            currentStep && (
              <>
                <p className="return-tree-section">{currentStep.sectionLabel}</p>
                {currentStep.paragraphs.map((line, i) => (
                  <p key={i} className="return-tree-line">
                    {line}
                  </p>
                ))}
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
