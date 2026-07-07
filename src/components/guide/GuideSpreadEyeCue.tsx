export function GuideSpreadEyeCue({
  visible,
  orientation = 'horizontal',
}: {
  visible: boolean
  orientation?: 'horizontal' | 'vertical'
}) {
  if (!visible) return null

  const isVertical = orientation === 'vertical'

  return (
    <div
      className={`guide-spread-eye-cue guide-spread-eye-cue--${orientation}`}
      aria-live="polite"
    >
      <span className="guide-spread-eye-cue-sr">
        {isVertical ? '左页已读，移目下页' : '左页已读，移目右页'}
      </span>
      <div className="guide-spread-eye-cue-track" aria-hidden>
        <span className="guide-spread-eye-cue-node guide-spread-eye-cue-node--from" />
        <span className="guide-spread-eye-cue-beam" />
        <span className="guide-spread-eye-cue-travel" />
        <span className="guide-spread-eye-cue-node guide-spread-eye-cue-node--to" />
      </div>
      <p className="guide-spread-eye-cue-copy" aria-hidden>
        <span className="guide-spread-eye-cue-main">移目</span>
        <span className="guide-spread-eye-cue-sep"> · </span>
        <span className="guide-spread-eye-cue-sub">
          {isVertical ? '下页' : '右页'}
        </span>
      </p>
    </div>
  )
}
