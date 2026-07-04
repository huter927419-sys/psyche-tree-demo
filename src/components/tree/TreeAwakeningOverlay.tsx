import { useEffect, useState } from 'react'
import type { BookId } from '../../books/types'
import { sephirot } from './treeData'
import {
  isOrganicRevealed,
  organicBranches,
  organicCanopy,
  organicRoots,
  trunkPath,
} from './treeOrganic'
import type { Locale } from '../../i18n/locale'
import { getProgressLabels } from '../../i18n/treeLabels'
import { getUi } from '../../i18n/ui'
import { BilingualCrossfadeText } from '../i18n/BilingualCrossfadeText'

interface TreeAwakeningOverlayProps {
  stage: number | null
  bookId?: BookId | null
  locale?: Locale
  onDone?: () => void
}

const DURATION_MS = 2400

export function TreeAwakeningOverlay({
  stage,
  bookId = 'psyche-tree',
  locale = 'zh',
  onDone,
}: TreeAwakeningOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (stage === null || stage <= 0) return

    setVisible(true)
    requestAnimationFrame(() => setAnimating(true))

    const fadeTimer = window.setTimeout(() => setAnimating(false), DURATION_MS - 500)
    const hideTimer = window.setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, DURATION_MS)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [stage, onDone])

  if (!visible || stage === null) return null

  const { awakeningTag } = getProgressLabels(bookId ?? 'psyche-tree', locale)
  const enLabels = getProgressLabels(bookId ?? 'psyche-tree', 'en')
  const zhLabels = getProgressLabels(bookId ?? 'psyche-tree', 'zh')
  const jaLabels = getProgressLabels(bookId ?? 'psyche-tree', 'ja')
  const labelEn = enLabels.stageLabels[stage] ?? enLabels.fallbackLabel
  const labelZh = zhLabels.stageLabels[stage] ?? zhLabels.fallbackLabel
  const labelJa = jaLabels.stageLabels[stage] ?? jaLabels.fallbackLabel
  const litNodes = sephirot.filter((s) => s.revealStage <= stage)
  const variant = 'explore' as const

  return (
    <div
      className={`tree-awakening-overlay ${animating ? 'active' : 'fade-out'}`}
      role="presentation"
      aria-hidden
    >
      <div className="tree-awakening-pulse" />
      <div className="tree-awakening-rays" />

      <svg
        className="tree-awakening-tree"
        viewBox="0 0 800 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="awake-trunk" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(80,80,80,0.95)" />
            <stop offset="100%" stopColor="rgba(40,40,40,0.8)" />
          </linearGradient>
          <radialGradient id="awake-canopy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {isOrganicRevealed(stage, 1, variant) && (
          <path
            d={trunkPath}
            fill="url(#awake-trunk)"
            stroke="rgba(240,240,240,0.35)"
            strokeWidth="0.8"
            className="tree-awakening-node"
          />
        )}

        {organicRoots.map(
          (r) =>
            isOrganicRevealed(stage, r.revealStage, variant) && (
              <path
                key={r.id}
                d={r.d}
                stroke="rgba(180,180,180,0.5)"
                strokeWidth={r.strokeWidth}
                strokeLinecap="round"
                className="tree-awakening-node"
              />
            ),
        )}

        {organicBranches.map(
          (b) =>
            isOrganicRevealed(stage, b.revealStage, variant) && (
              <path
                key={b.id}
                d={b.d}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={b.strokeWidth}
                strokeLinecap="round"
                className="tree-awakening-node"
              />
            ),
        )}

        {organicCanopy.map(
          (c) =>
            isOrganicRevealed(stage, c.revealStage, variant) && (
              <ellipse
                key={c.id}
                cx={c.cx}
                cy={c.cy}
                rx={c.rx}
                ry={c.ry}
                fill="url(#awake-canopy)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="0.6"
                transform={c.rotate ? `rotate(${c.rotate} ${c.cx} ${c.cy})` : undefined}
                className="tree-awakening-node"
              />
            ),
        )}

        {litNodes.map((s) => (
          <g key={s.id} className="tree-awakening-node">
            <circle cx={s.cx} cy={s.cy} r={s.r * 2.8} fill="rgba(255,255,255,0.2)" />
            <circle
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              stroke="rgba(240,240,240,0.95)"
              strokeWidth="1.2"
              fill="rgba(240,240,240,0.1)"
            />
          </g>
        ))}
      </svg>

      <div className="tree-awakening-text">
        <p className="tree-awakening-tag">{awakeningTag}</p>
        <p className="tree-awakening-energy">{getUi(locale).treeEnergyPulse}</p>
        <p className="tree-awakening-label">
          <BilingualCrossfadeText
            zh={labelZh}
            en={labelEn}
            ja={labelJa}
            activeLocale={locale}
          />
        </p>
      </div>
    </div>
  )
}
