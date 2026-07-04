import type { Sephira, TreePath } from './treeData'

export interface Point {
  x: number
  y: number
}

/** Energy rises from earth (roots) toward crown — lower revealStage first, then lower Y. */
export function getEnergyDirection(
  a: Pick<Sephira, 'cx' | 'cy' | 'revealStage'>,
  b: Pick<Sephira, 'cx' | 'cy' | 'revealStage'>,
): { from: Point; to: Point } {
  const aFirst =
    a.revealStage < b.revealStage ||
    (a.revealStage === b.revealStage && a.cy > b.cy)

  return aFirst
    ? { from: { x: a.cx, y: a.cy }, to: { x: b.cx, y: b.cy } }
    : { from: { x: b.cx, y: b.cy }, to: { x: a.cx, y: a.cy } }
}

export function isPathNewlyEnergized(
  path: TreePath,
  sephirot: Sephira[],
  revealStage: number,
): boolean {
  const a = sephirot[path.from]
  const b = sephirot[path.to]
  const need = Math.max(a.revealStage, b.revealStage)
  return revealStage === need && a.revealStage <= revealStage && b.revealStage <= revealStage
}

export function isNodeNewlyEnergized(sephira: Sephira, revealStage: number): boolean {
  return sephira.revealStage === revealStage && sephira.revealStage <= revealStage
}

interface EnergyFlowLineProps {
  from: Point
  to: Point
  strokeWidth?: number
  delay?: number
  newlyEnergized?: boolean
  supplyEnabled?: boolean
  active?: boolean
}

export function EnergyFlowLine({
  from,
  to,
  strokeWidth = 1.4,
  delay = 0,
  newlyEnergized = false,
  supplyEnabled = true,
  active = true,
}: EnergyFlowLineProps) {
  if (!active) return null

  return (
    <>
      {newlyEnergized && (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="rgba(255,255,255,0.98)"
          strokeWidth={strokeWidth + 0.8}
          strokeLinecap="round"
          pathLength={100}
          className="tree-energy-fill tree-energy-fill--new"
          style={{ animationDelay: `${delay}s` }}
        />
      )}
      {supplyEnabled && (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          className="tree-energy-supply"
          style={{ animationDelay: `${(newlyEnergized ? 1.4 : 0) + delay}s` }}
        />
      )}
    </>
  )
}

interface EnergyFlowPathProps {
  d: string
  strokeWidth: number
  delay?: number
  newlyEnergized?: boolean
  supplyEnabled?: boolean
  reverse?: boolean
  active?: boolean
}

export function EnergyFlowPath({
  d,
  strokeWidth,
  delay = 0,
  newlyEnergized = false,
  supplyEnabled = true,
  reverse = false,
  active = true,
}: EnergyFlowPathProps) {
  if (!active) return null

  return (
    <>
      {newlyEnergized && (
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.98)"
          strokeWidth={strokeWidth + 0.6}
          strokeLinecap="round"
          pathLength={100}
          className={`tree-energy-fill tree-energy-fill--new${reverse ? ' tree-energy-fill--reverse' : ''}`}
          style={{ animationDelay: `${delay}s` }}
        />
      )}
      {supplyEnabled && (
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          className={`tree-energy-supply${reverse ? ' tree-energy-supply--reverse' : ''}`}
          style={{ animationDelay: `${(newlyEnergized ? 1.5 : 0) + delay}s` }}
        />
      )}
    </>
  )
}

import type { VisualTier } from '../../hooks/useVisualTier'

interface EnergizedNodeProps {
  sephira: Sephira
  index: number
  revealed: boolean
  newlyEnergized: boolean
  isComplete: boolean
  visualTier: VisualTier
  op: { stroke: number; fill: number; glow: number }
}

export function EnergizedNode({
  sephira,
  index,
  revealed,
  newlyEnergized,
  isComplete,
  visualTier,
  op,
}: EnergizedNodeProps) {
  const pulseClass = newlyEnergized
    ? 'tree-node-charging'
    : revealed
      ? 'tree-node-energized'
      : 'tree-node-dormant'
  const animateAura = visualTier === 'full' && (newlyEnergized || index === 0)
  const showRingSupply = visualTier === 'full' && newlyEnergized

  return (
    <g className={pulseClass} style={{ transition: 'opacity 1.2s ease' }}>
      {revealed && (
        <>
          <circle
            cx={sephira.cx}
            cy={sephira.cy}
            r={sephira.r * (visualTier === 'minimal' ? 3.2 : 4.2)}
            fill="url(#nodeAura)"
            opacity={newlyEnergized ? 0.9 : op.glow * 0.75}
            className={animateAura ? 'tree-node-aura-pulse' : undefined}
          />
          {visualTier !== 'minimal' && (
            <circle
              cx={sephira.cx}
              cy={sephira.cy}
              r={sephira.r * 2.4}
              fill={isComplete ? 'url(#sephiraGlowGold)' : 'url(#sephiraGlow)'}
              opacity={op.glow * 0.85}
            />
          )}
        </>
      )}
      <circle
        cx={sephira.cx}
        cy={sephira.cy}
        r={sephira.r}
        stroke={`rgba(255,255,255,${revealed ? Math.max(op.stroke, 0.78) : op.stroke * 0.35})`}
        strokeWidth={index === 0 ? 1.5 : 1.1}
        fill={`rgba(255,255,255,${revealed ? Math.max(op.fill, 0.22) : op.fill})`}
        className="tree-node-core"
      />
      {revealed && visualTier !== 'minimal' && (
        <circle
          cx={sephira.cx}
          cy={sephira.cy}
          r={sephira.r * 0.42}
          fill="rgba(255,255,255,0.88)"
          className="tree-node-inner-light"
        />
      )}
      {showRingSupply && (
        <circle
          cx={sephira.cx}
          cy={sephira.cy}
          r={sephira.r * 3.4}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.5"
          pathLength={100}
          className="tree-node-ring-supply"
        />
      )}
      {revealed && index === 0 && visualTier !== 'minimal' && (
        <circle
          cx={sephira.cx}
          cy={sephira.cy}
          r={5}
          fill="rgba(255,255,255,0.8)"
          className={visualTier === 'full' ? 'tree-node-crown-beacon' : undefined}
        />
      )}
    </g>
  )
}
