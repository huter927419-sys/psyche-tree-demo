/** Unified black & white facet glyphs — same visuals for zh / en / ja. */

import type { ReactNode } from 'react'

export type OracleFacetIconId =
  | 'lake'
  | 'tree'
  | 'fire'
  | 'wind'
  | 'crystal'
  | 'root'

export const ORACLE_FACET_ICONS: OracleFacetIconId[] = [
  'lake',
  'tree',
  'fire',
  'wind',
  'crystal',
  'root',
]

const titles: Record<OracleFacetIconId, string> = {
  lake: 'Lake',
  tree: 'Tree',
  fire: 'Fire',
  wind: 'Wind',
  crystal: 'Crystal',
  root: 'Root',
}

interface OracleFacetIconProps {
  id: OracleFacetIconId
  className?: string
}

export function OracleFacetIcon({ id, className = '' }: OracleFacetIconProps) {
  return (
    <svg
      className={`oracle-facet-icon ${className}`.trim()}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden
      focusable="false"
    >
      <title>{titles[id]}</title>
      {iconPaths[id]}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const iconPaths: Record<OracleFacetIconId, ReactNode> = {
  lake: (
    <>
      <ellipse cx="16" cy="18" rx="11" ry="5.5" {...stroke} />
      <path d="M7 18c2.5-1.2 5-1.8 9-1.8s6.5.6 9 1.8" {...stroke} />
      <path d="M9 20.5c2-0.8 4.2-1.2 7-1.2s5 .4 7 1.2" {...stroke} opacity="0.55" />
    </>
  ),
  tree: (
    <>
      <path d="M16 26v-4" {...stroke} />
      <path d="M16 8 L22 18 H10 Z" {...stroke} />
      <path d="M16 12 L20 19 H12 Z" {...stroke} opacity="0.55" />
    </>
  ),
  fire: (
    <>
      <path
        d="M16 26c-4-2.5-6-5.5-6-9a4 4 0 0 1 6-3.5 4 4 0 0 1 6 3.5c0 3.5-2 6.5-6 9Z"
        {...stroke}
      />
      <path d="M16 22c-1.5-1.2-2.2-2.6-2.2-4.2.8.6 1.4.9 2.2.9s1.4-.3 2.2-.9c0 1.6-.7 3-2.2 4.2Z" {...stroke} opacity="0.55" />
    </>
  ),
  wind: (
    <>
      <path d="M8 11h12a3 3 0 0 0 0-6H10" {...stroke} />
      <path d="M8 18h14a3.5 3.5 0 0 0 0-7H9" {...stroke} />
      <path d="M8 25h10a2.5 2.5 0 0 0 0-5H10" {...stroke} opacity="0.55" />
    </>
  ),
  crystal: (
    <>
      <path d="M16 6 L24 14 L16 26 L8 14 Z" {...stroke} />
      <path d="M8 14h16" {...stroke} opacity="0.55" />
      <path d="M16 6v20" {...stroke} opacity="0.35" />
    </>
  ),
  root: (
    <>
      <path d="M16 8v6" {...stroke} />
      <circle cx="16" cy="8" r="2.2" {...stroke} />
      <path d="M16 14c-3 2-5 4.5-5 7" {...stroke} />
      <path d="M16 14c3 2 5 4.5 5 7" {...stroke} />
      <path d="M16 16v8" {...stroke} opacity="0.55" />
    </>
  ),
}
