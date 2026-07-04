import { memo, useEffect, useRef } from 'react'
import { shouldRunEnergySupply, type VisualTier } from '../hooks/useVisualTier'
import {
  areRootsRevealed,
  getOpacityForElement,
  isPathRevealed,
  isSephiraRevealed,
  rootPaths,
  sephirot,
  treePaths,
  type TreeVariant,
} from './tree/treeData'
import {
  isOrganicRevealed,
  organicBranches,
  organicCanopy,
  organicRoots,
  trunkPath,
} from './tree/treeOrganic'
import {
  EnergizedNode,
  EnergyFlowLine,
  EnergyFlowPath,
  getEnergyDirection,
  isPathNewlyEnergized,
  isNodeNewlyEnergized,
} from './tree/treeEnergyFlow'

interface TreeOfLifeBackgroundProps {
  revealStage?: number
  variant?: TreeVariant
  recoilKey?: number
  visualTier?: VisualTier
  readingFocus?: boolean
}

export const TreeOfLifeBackground = memo(function TreeOfLifeBackground({
  revealStage = 0,
  variant = 'explore',
  recoilKey = 0,
  visualTier = 'balanced',
  readingFocus = false,
}: TreeOfLifeBackgroundProps) {
  const isWelcome = variant === 'welcome'
  const isComplete = variant === 'complete'
  const isExplore = variant === 'explore'
  const showEnergyFlow = isWelcome || isComplete || (isExplore && revealStage > 0)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (recoilKey === 0) return
    const el = svgRef.current
    if (!el) return
    el.classList.remove('tree-organic-recoil')
    void el.getBoundingClientRect()
    el.classList.add('tree-organic-recoil')
  }, [recoilKey])

  const focusDim = readingFocus ? 0.24 : 1

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 tree-bg-root tree-bg-root--${visualTier}${isWelcome ? ' tree-bg-root--welcome' : ''}${readingFocus ? ' tree-bg-root--reading-focus' : ''}`}>
      <div className="tree-bg-base" />
      <div
        className="tree-bg-depth"
        style={{
          opacity: (isWelcome ? 0.95 : isComplete ? 1 : 0.82 + revealStage * 0.025) * focusDim,
        }}
      />

      <div
        className={`tree-crown-radiance${showEnergyFlow ? ' tree-crown-radiance--flowing' : ''}`}
        style={{
          opacity:
            (isWelcome
              ? 0.22
              : isComplete
                ? 0.85
                : 0.18 + (revealStage / 7) * 0.55) * focusDim,
        }}
      />

      {showEnergyFlow && isExplore && visualTier === 'full' && !readingFocus && (
        <div
          className="tree-sacred-illumination"
          style={{ opacity: 0.22 + (revealStage / 7) * 0.48 }}
        />
      )}

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: focusDim,
          background: isComplete
            ? 'radial-gradient(ellipse 78% 68% at 50% 22%, rgba(255,255,255,0.16) 0%, transparent 58%)'
            : isWelcome
              ? 'radial-gradient(ellipse 72% 62% at 50% 24%, rgba(255,255,255,0.11) 0%, transparent 55%)'
              : `radial-gradient(ellipse 68% 58% at 50% ${26 - revealStage * 0.8}%, rgba(255,255,255,${0.05 + revealStage * 0.012}) 0%, transparent 54%)`,
        }}
      />

      <svg
        ref={svgRef}
        className={`absolute inset-0 w-full h-full tree-bg-svg ${
          readingFocus
            ? 'opacity-28'
            : isWelcome
              ? 'opacity-[0.72] scale-[1.06] tree-bg-svg--welcome'
              : isComplete
                ? 'opacity-90'
                : 'opacity-85'
        } ${isWelcome && visualTier === 'full' ? 'animate-breathe' : isComplete ? 'animate-breathe' : ''}${showEnergyFlow ? ' tree-bg-svg--flowing' : ''}${readingFocus ? ' tree-bg-svg--muted' : ''}`}
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id="sephiraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(240,240,240,0.2)" />
            <stop offset="100%" stopColor="rgba(240,240,240,0)" />
          </radialGradient>
          <radialGradient id="sephiraGlowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nodeAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="treeGhostBlur">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <linearGradient id="trunkFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(45,40,36,0.95)" />
            <stop offset="45%" stopColor="rgba(32,30,28,0.88)" />
            <stop offset="100%" stopColor="rgba(24,22,20,0.75)" />
          </linearGradient>
          <linearGradient id="trunkEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(200,195,185,0.15)" />
            <stop offset="50%" stopColor="rgba(240,240,240,0.28)" />
            <stop offset="100%" stopColor="rgba(200,195,185,0.15)" />
          </linearGradient>
          <radialGradient id="canopyFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(55,52,48,0.55)" />
            <stop offset="70%" stopColor="rgba(35,33,30,0.25)" />
            <stop offset="100%" stopColor="rgba(20,18,16,0)" />
          </radialGradient>
        </defs>

        {/* Organic tree — ghost outline during explore */}
        {isExplore && (
          <g className="tree-ghost-layer" opacity="0.12">
            <path d={trunkPath} fill="rgba(200,195,185,0.15)" />
            {organicRoots.map((r) => (
              <path key={`ghost-${r.id}`} d={r.d} stroke="rgba(200,195,185,0.35)" strokeWidth={r.strokeWidth * 0.5} fill="none" />
            ))}
            {organicBranches.map((b) => (
              <path key={`ghost-${b.id}`} d={b.d} stroke="rgba(200,195,185,0.3)" strokeWidth={b.strokeWidth * 0.45} fill="none" strokeLinecap="round" />
            ))}
            {organicCanopy.map((c) => (
              <ellipse key={`ghost-${c.id}`} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="rgba(200,195,185,0.08)" transform={c.rotate ? `rotate(${c.rotate} ${c.cx} ${c.cy})` : undefined} />
            ))}
          </g>
        )}

        {/* Trunk */}
        <path
          d={trunkPath}
          fill="url(#trunkFill)"
          stroke="url(#trunkEdge)"
          strokeWidth="0.8"
          opacity={
            isOrganicRevealed(revealStage, 1, variant)
              ? isWelcome ? 0.75 : isComplete ? 0.88 : 0.82
              : isExplore ? 0.08 : 0.5
          }
          style={{ transition: 'opacity 1.4s ease' }}
        />

        {/* Roots */}
        <g>
          {organicRoots.map((r) => {
            const revealed = isOrganicRevealed(revealStage, r.revealStage, variant)
            return (
              <path
                key={r.id}
                d={r.d}
                fill="none"
                stroke={revealed ? 'rgba(200,200,200,0.45)' : 'rgba(200,200,200,0.12)'}
                strokeWidth={r.strokeWidth}
                strokeLinecap="round"
                style={{ transition: 'all 1.2s ease' }}
              />
            )
          })}
        </g>

        {/* Branches */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          {organicBranches.map((b) => {
            const revealed = isOrganicRevealed(revealStage, b.revealStage, variant)
            const isNew = isExplore && revealed && b.revealStage === revealStage
            return (
              <path
                key={b.id}
                d={b.d}
                stroke={
                  revealed
                    ? `rgba(200,190,170,${b.strokeWidth > 2 ? 0.62 : 0.45})`
                    : 'rgba(200,200,200,0.08)'
                }
                strokeWidth={b.strokeWidth}
                className={isNew ? 'tree-path-reveal' : revealed ? 'tree-path-lit' : ''}
                style={{ transition: 'all 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            )
          })}
        </g>

        {/* Canopy foliage */}
        <g>
          {organicCanopy.map((c) => {
            const revealed = isOrganicRevealed(revealStage, c.revealStage, variant)
            return (
              <ellipse
                key={c.id}
                cx={c.cx}
                cy={c.cy}
                rx={c.rx}
                ry={c.ry}
                fill={revealed ? 'url(#canopyFill)' : 'rgba(200,200,200,0.04)'}
                stroke={revealed ? 'rgba(180,175,165,0.22)' : 'rgba(200,200,200,0.06)'}
                strokeWidth="0.6"
                transform={c.rotate ? `rotate(${c.rotate} ${c.cx} ${c.cy})` : undefined}
                style={{ transition: 'all 1.6s ease' }}
              />
            )
          })}
        </g>

        {/* Ghost kabbalah — subtle inner geometry */}
        {isExplore && (
          <g
            className="tree-ghost-layer"
            opacity="0.08"
            {...(visualTier === 'full' ? { filter: 'url(#treeGhostBlur)' } : {})}
          >
            {rootPaths.map((d, i) => (
              <path key={`ghost-root-${i}`} d={d} stroke="rgba(200,200,200,0.5)" strokeWidth="0.5" />
            ))}
            {treePaths.map((p, i) => {
              const a = sephirot[p.from]
              const b = sephirot[p.to]
              return (
                <line
                  key={`ghost-path-${i}`}
                  x1={a.cx}
                  y1={a.cy}
                  x2={b.cx}
                  y2={b.cy}
                  stroke="rgba(200,200,200,0.35)"
                  strokeWidth="0.4"
                />
              )
            })}
            {sephirot.map((s) => (
              <circle
                key={`ghost-${s.id}`}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                stroke="rgba(200,200,200,0.4)"
                strokeWidth="0.5"
              />
            ))}
          </g>
        )}

        {/* Roots */}
        <g>
          {rootPaths.map((d, i) => {
            const revealed = areRootsRevealed(revealStage, variant)
            const op = getOpacityForElement(revealed, variant)
            return (
              <path
                key={`root-${i}`}
                d={d}
                stroke={
                  revealed
                    ? `rgba(255,255,255,${op.stroke * 0.5})`
                    : `rgba(200,200,200,${op.stroke * 0.4})`
                }
                strokeWidth={revealed ? 0.9 : 0.5}
                style={{ transition: 'all 1.2s ease' }}
              />
            )
          })}
        </g>

        {/* Sacred paths — inner light network on the tree */}
        <g opacity={isExplore ? 0.45 : 0.7}>
          {treePaths.map((path, i) => {
            const a = sephirot[path.from]
            const b = sephirot[path.to]
            const revealed = isPathRevealed(path, revealStage, variant)
            const op = getOpacityForElement(revealed, variant)
            const isNew =
              isExplore &&
              revealed &&
              a.revealStage === revealStage &&
              b.revealStage === revealStage

            return (
              <line
                key={`path-${i}`}
                x1={a.cx}
                y1={a.cy}
                x2={b.cx}
                y2={b.cy}
                stroke={
                  revealed
                    ? `rgba(255,255,255,${Math.max(op.stroke * 0.55, 0.35)})`
                    : `rgba(200,200,200,${op.stroke})`
                }
                strokeWidth={revealed ? 1.1 : 0.4}
                className={isNew ? 'tree-path-reveal' : revealed ? 'tree-path-lit' : ''}
                style={{ transition: 'all 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            )
          })}
        </g>

        {/* Sephirot — circular nodes energize as light arrives */}
        {sephirot.map((s, i) => {
          const revealed = isSephiraRevealed(s, revealStage, variant)
          const op = getOpacityForElement(revealed, variant)
          const newlyEnergized =
            isExplore && isNodeNewlyEnergized(s, revealStage)

          return (
            <EnergizedNode
              key={s.id}
              sephira={s}
              index={i}
              revealed={revealed}
              newlyEnergized={newlyEnergized}
              isComplete={isComplete}
              isWelcome={isWelcome}
              visualTier={visualTier}
              op={op}
            />
          )
        })}

        {isWelcome && (
          <ellipse
            cx="400"
            cy="440"
            rx="320"
            ry="380"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.6"
            strokeDasharray="4 10"
          />
        )}

        {showEnergyFlow && (
          <g className="tree-energy-layer">
            {(isWelcome || isComplete || isOrganicRevealed(revealStage, 1, variant)) && (
              <EnergyFlowPath
                d={trunkPath}
                strokeWidth={1.2}
                delay={0}
                newlyEnergized={isExplore && revealStage === 1}
                supplyEnabled={shouldRunEnergySupply(1, revealStage, variant, visualTier)}
                reverse
              />
            )}
            {organicRoots.map((r, i) => {
              const revealed =
                isWelcome || isComplete || isOrganicRevealed(revealStage, r.revealStage, variant)
              return (
                <EnergyFlowPath
                  key={`energy-root-${r.id}`}
                  d={r.d}
                  strokeWidth={Math.max(r.strokeWidth * 0.65, 0.75)}
                  delay={0.12 + i * 0.2}
                  newlyEnergized={isExplore && revealStage === r.revealStage}
                  supplyEnabled={shouldRunEnergySupply(
                    r.revealStage,
                    revealStage,
                    variant,
                    visualTier,
                  )}
                  active={revealed}
                />
              )
            })}
            {organicBranches.map((b, i) => {
              const revealed =
                isWelcome || isComplete || isOrganicRevealed(revealStage, b.revealStage, variant)
              return (
                <EnergyFlowPath
                  key={`energy-branch-${b.id}`}
                  d={b.d}
                  strokeWidth={Math.max(b.strokeWidth * 0.5, 0.65)}
                  delay={0.3 + i * 0.14}
                  newlyEnergized={isExplore && revealStage === b.revealStage}
                  supplyEnabled={shouldRunEnergySupply(
                    b.revealStage,
                    revealStage,
                    variant,
                    visualTier,
                  )}
                  active={revealed}
                />
              )
            })}
            {rootPaths.map((d, i) => {
              const revealed = isWelcome || isComplete || areRootsRevealed(revealStage, variant)
              return (
                <EnergyFlowPath
                  key={`energy-kroot-${i}`}
                  d={d}
                  strokeWidth={0.85}
                  delay={0.45 + i * 0.16}
                  newlyEnergized={isExplore && revealStage === 1}
                  supplyEnabled={shouldRunEnergySupply(1, revealStage, variant, visualTier)}
                  active={revealed}
                />
              )
            })}
            {treePaths.map((path, i) => {
              const a = sephirot[path.from]
              const b = sephirot[path.to]
              const revealed =
                isWelcome || isComplete || isPathRevealed(path, revealStage, variant)
              const pathStage = Math.max(a.revealStage, b.revealStage)
              const { from, to } = getEnergyDirection(a, b)
              return (
                <EnergyFlowLine
                  key={`energy-path-${i}`}
                  from={from}
                  to={to}
                  strokeWidth={1.25}
                  delay={0.2 + i * 0.08}
                  newlyEnergized={
                    isExplore && isPathNewlyEnergized(path, sephirot, revealStage)
                  }
                  supplyEnabled={shouldRunEnergySupply(
                    pathStage,
                    revealStage,
                    variant,
                    visualTier,
                  )}
                  active={revealed}
                />
              )
            })}
          </g>
        )}
      </svg>

      {/* Soft vignette — keeps tree readable behind the book */}
      <div
        className="absolute inset-0 transition-opacity duration-700 tree-vignette"
        style={{
          background: isWelcome
            ? 'radial-gradient(ellipse 88% 78% at 50% 48%, transparent 32%, rgba(5,6,8,0.42) 100%)'
            : isComplete
              ? 'radial-gradient(ellipse 90% 80% at 50% 42%, transparent 38%, rgba(5,6,8,0.36) 100%)'
              : 'radial-gradient(ellipse 94% 86% at 50% 46%, transparent 42%, rgba(5,6,8,0.34) 100%)',
        }}
      />
      <div className="tree-bg-grain" />
    </div>
  )
})

export function countCompletedDimensions(
  currentIndex: number,
  answers: Record<string, string[]>,
  questions: Array<{ type: string; id: string; dimensionIndex?: number }>,
  maxStage = 6,
): number {
  let completed = 0
  for (let i = 0; i < currentIndex; i += 1) {
    const q = questions[i]
    if (
      q.type === 'dimension' &&
      (q.dimensionIndex ?? 0) <= 6 &&
      (answers[q.id]?.length ?? 0) > 0
    ) {
      completed += 1
    }
  }

  const current = questions[currentIndex]
  if (
    current?.type === 'dimension' &&
    (current.dimensionIndex ?? 0) <= 6 &&
    (answers[current.id]?.length ?? 0) > 0
  ) {
    completed += 1
  }

  return Math.min(completed, maxStage)
}
