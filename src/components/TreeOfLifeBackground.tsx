import { useEffect, useRef } from 'react'
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

interface TreeOfLifeBackgroundProps {
  revealStage?: number
  variant?: TreeVariant
  recoilKey?: number
}

export function TreeOfLifeBackground({
  revealStage = 0,
  variant = 'explore',
  recoilKey = 0,
}: TreeOfLifeBackgroundProps) {
  const isWelcome = variant === 'welcome'
  const isComplete = variant === 'complete'
  const isExplore = variant === 'explore'
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (recoilKey === 0) return
    const el = svgRef.current
    if (!el) return
    el.classList.remove('tree-organic-recoil')
    void el.getBoundingClientRect()
    el.classList.add('tree-organic-recoil')
  }, [recoilKey])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: isComplete
            ? 'radial-gradient(ellipse 85% 75% at 50% 38%, rgba(212,175,122,0.22) 0%, transparent 68%)'
            : isWelcome
              ? 'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(212,175,122,0.15) 0%, transparent 62%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 42%, rgba(212,175,122,0.1) 0%, transparent 58%)',
        }}
      />

      <svg
        ref={svgRef}
        className={`absolute inset-0 w-full h-full tree-bg-svg ${
          isWelcome ? 'opacity-95 scale-[1.08]' : isComplete ? 'opacity-90' : 'opacity-85'
        } ${isWelcome || isComplete ? 'animate-breathe' : ''}`}
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id="sephiraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245,240,232,0.45)" />
            <stop offset="100%" stopColor="rgba(245,240,232,0)" />
          </radialGradient>
          <radialGradient id="sephiraGlowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,175,122,0.5)" />
            <stop offset="100%" stopColor="rgba(212,175,122,0)" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
            <stop offset="50%" stopColor="rgba(245,240,232,0.28)" />
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
                stroke={revealed ? 'rgba(180,165,140,0.55)' : 'rgba(200,200,200,0.12)'}
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
          <g className="tree-ghost-layer" opacity="0.08" filter="url(#treeGhostBlur)">
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
                    ? `rgba(212,175,122,${op.stroke * 0.5})`
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
                    ? `rgba(212,175,122,${Math.max(op.stroke * 0.55, 0.35)})`
                    : `rgba(200,200,200,${op.stroke})`
                }
                strokeWidth={revealed ? 1.1 : 0.4}
                className={isNew ? 'tree-path-reveal' : revealed ? 'tree-path-lit' : ''}
                style={{ transition: 'all 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            )
          })}
        </g>

        {/* Sephirot */}
        {sephirot.map((s, i) => {
          const revealed = isSephiraRevealed(s, revealStage, variant)
          const op = getOpacityForElement(revealed, variant)
          const isNew = isExplore && s.revealStage === revealStage && revealed

          return (
            <g
              key={s.id}
              className={isNew ? 'tree-node-bloom' : ''}
              style={{ transition: 'opacity 1.2s ease' }}
            >
              {revealed && (
                <circle
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r * 2.8}
                  fill={isComplete ? 'url(#sephiraGlowGold)' : 'url(#sephiraGlow)'}
                  opacity={op.glow}
                  filter="url(#softGlow)"
                />
              )}
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                stroke={`rgba(245,240,232,${revealed ? Math.max(op.stroke, 0.65) : op.stroke})`}
                strokeWidth={i === 0 ? 1.4 : 1}
                fill={`rgba(245,240,232,${op.fill})`}
              />
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                stroke={`rgba(212,175,122,${revealed ? op.stroke * 0.55 : op.stroke * 0.3})`}
                strokeWidth={0.5}
              />
              {revealed && i === 0 && (
                <circle
                  cx={s.cx}
                  cy={s.cy}
                  r={5}
                  fill="rgba(212,175,122,0.7)"
                  className="animate-pulse-soft"
                />
              )}
            </g>
          )
        })}

        {isWelcome && (
          <ellipse
            cx="400"
            cy="440"
            rx="320"
            ry="380"
            stroke="rgba(212,175,122,0.12)"
            strokeWidth="0.6"
            strokeDasharray="4 10"
          />
        )}
      </svg>

      {/* Lighter vignette — organic tree stays visible behind book */}
      <div
        className="absolute inset-0 transition-opacity duration-700 tree-vignette"
        style={{
          background: isWelcome
            ? 'radial-gradient(ellipse 88% 78% at 50% 48%, transparent 30%, rgba(10,10,10,0.38) 100%)'
            : isComplete
              ? 'radial-gradient(ellipse 92% 82% at 50% 45%, transparent 36%, rgba(10,10,10,0.32) 100%)'
              : 'radial-gradient(ellipse 94% 86% at 50% 46%, transparent 40%, rgba(10,10,10,0.28) 100%)',
        }}
      />
    </div>
  )
}

export function countCompletedDimensions(
  currentIndex: number,
  answers: Record<string, string[]>,
  questions: Array<{ type: string; id: string }>,
): number {
  let completed = 0
  for (let i = 0; i < currentIndex; i += 1) {
    const q = questions[i]
    if (q.type === 'dimension' && (answers[q.id]?.length ?? 0) > 0) {
      completed += 1
    }
  }

  const current = questions[currentIndex]
  if (
    current?.type === 'dimension' &&
    (answers[current.id]?.length ?? 0) > 0
  ) {
    completed += 1
  }

  return Math.min(completed, 7)
}
