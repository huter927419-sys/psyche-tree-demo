import type { ReactNode } from 'react'

export type BookJourneyMode =
  | 'pickup'
  | 'compact'
  | 'expanding'
  | 'expanded'
  | 'closing'

interface BookJourneyStageProps {
  mode: BookJourneyMode
  children: ReactNode
}

export function BookJourneyStage({ mode, children }: BookJourneyStageProps) {
  return (
    <div className="book-journey-viewport">
      <div className={`book-journey-scaler book-journey-scaler--${mode}`}>
        {children}
      </div>
    </div>
  )
}
