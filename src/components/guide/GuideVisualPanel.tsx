import { GuideIllustration } from './GuideIllustration'

export type GuideVisualTone = 'companion' | 'echo'

/** Companion slot — PNG only; SVG stays on breath / bridge pages. */
export function GuideVisualPanel({
  illustrationId,
  tone,
  spreadIndex,
  ready,
}: {
  illustrationId: string
  sectionId: string
  tone: GuideVisualTone
  spreadIndex: number
  ready?: boolean
  onIllustrationMotionComplete?: () => void
}) {
  return (
    <div className={`guide-visual-panel guide-visual-panel--${tone}`}>
      <div className="guide-visual-panel-art">
        <GuideIllustration
          id={illustrationId}
          spreadIndex={spreadIndex}
          tone={tone}
          ready={ready}
        />
      </div>
    </div>
  )
}
