import { STAGE_LABELS, STAGE_SHORT } from './treeLabels'

interface TreeProgressProps {
  revealStage: number
}

export function TreeProgress({ revealStage }: TreeProgressProps) {
  const label = STAGE_LABELS[revealStage]

  return (
    <div className="tree-progress-hud">
      <div className="tree-progress-dots">
        {STAGE_SHORT.map((short, i) => {
          const stage = i + 1
          const lit = revealStage >= stage
          const active = revealStage === stage
          return (
            <div
              key={short}
              className={`tree-progress-dot ${lit ? 'lit' : ''} ${active ? 'active' : ''}`}
              title={STAGE_LABELS[stage]}
            >
              <span>{short}</span>
            </div>
          )
        })}
      </div>
      {label && revealStage > 0 && (
        <p className="tree-progress-label">{label}</p>
      )}
      {revealStage === 0 && (
        <p className="tree-progress-label dim">生命之树等待你的第一页落印</p>
      )}
    </div>
  )
}
