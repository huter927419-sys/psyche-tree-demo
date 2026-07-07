import type { GuideRitualCopy } from '../../books/guide/guideRitualCopy'

export function GuideSpreadEyeCue({
  visible,
  orientation = 'horizontal',
  ritual,
}: {
  visible: boolean
  orientation?: 'horizontal' | 'vertical'
  ritual: GuideRitualCopy
}) {
  if (!visible) return null

  const isVertical = orientation === 'vertical'

  return (
    <div
      className={`guide-spread-eye-cue guide-spread-eye-cue--${orientation}`}
      aria-live="polite"
    >
      <span className="guide-spread-eye-cue-sr">
        {isVertical ? ritual.eyeCueSrVertical : ritual.eyeCueSrHorizontal}
      </span>
      <div className="guide-spread-eye-cue-track" aria-hidden>
        <span className="guide-spread-eye-cue-node guide-spread-eye-cue-node--from" />
        <span className="guide-spread-eye-cue-beam" />
        <span className="guide-spread-eye-cue-travel" />
        <span className="guide-spread-eye-cue-node guide-spread-eye-cue-node--to" />
      </div>
      <p className="guide-spread-eye-cue-copy" aria-hidden>
        <span className="guide-spread-eye-cue-main">{ritual.eyeCueMain}</span>
        <span className="guide-spread-eye-cue-sep"> · </span>
        <span className="guide-spread-eye-cue-sub">
          {isVertical ? ritual.eyeCueSubBelow : ritual.eyeCueSubRight}
        </span>
      </p>
    </div>
  )
}
