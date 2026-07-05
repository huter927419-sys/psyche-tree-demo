import type { ReactNode } from 'react'

export type BookJourneyMode =
  | 'pickup'
  | 'compact'
  | 'expanding'
  | 'expanded'
  | 'closing'

interface BookJourneyStageProps {
  mode: BookJourneyMode
  /** Keep vertical center when interior (reader) mounts — e.g. 同观 cover → reading. */
  keepCentered?: boolean
  /** Session-specific layout tokens (guide = matched cover/reader box). */
  variant?: 'default' | 'guide'
  children: ReactNode
}

export function BookJourneyStage({
  mode,
  keepCentered = false,
  variant = 'default',
  children,
}: BookJourneyStageProps) {
  return (
    <div
      className={`book-journey-viewport${keepCentered ? ' book-journey-viewport--keep-center' : ''}`}
    >
      <div
        className={`book-journey-scaler book-journey-scaler--${mode}${variant === 'guide' ? ' book-journey-scaler--guide' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}
