export interface Sephira {
  id: string
  cx: number
  cy: number
  r: number
  revealStage: number
  label?: string
}

export interface TreePath {
  from: number
  to: number
}

/** Bottom → top reveal order aligned with 7 exploration dimensions */
export const sephirot: Sephira[] = [
  { id: 'keter', cx: 400, cy: 80, r: 22, revealStage: 7, label: 'Keter' },
  { id: 'chokmah', cx: 280, cy: 180, r: 18, revealStage: 6 },
  { id: 'binah', cx: 520, cy: 180, r: 18, revealStage: 6 },
  { id: 'daat', cx: 400, cy: 280, r: 18, revealStage: 5 },
  { id: 'chesed', cx: 220, cy: 380, r: 18, revealStage: 5 },
  { id: 'gevurah', cx: 580, cy: 380, r: 18, revealStage: 5 },
  { id: 'tiferet', cx: 400, cy: 420, r: 18, revealStage: 4 },
  { id: 'netzach', cx: 260, cy: 560, r: 18, revealStage: 3 },
  { id: 'hod', cx: 540, cy: 560, r: 18, revealStage: 3 },
  { id: 'yesod', cx: 400, cy: 680, r: 18, revealStage: 2 },
  { id: 'malkuth', cx: 400, cy: 800, r: 20, revealStage: 1 },
]

export const treePaths: TreePath[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 8 },
  { from: 6, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 8 },
  { from: 6, to: 9 },
  { from: 7, to: 9 },
  { from: 8, to: 9 },
  { from: 9, to: 10 },
]

export const rootPaths = [
  'M400 818 Q350 860 300 880',
  'M400 818 Q450 860 500 880',
  'M400 818 Q400 870 400 890',
]

export function isSephiraRevealed(
  sephira: Sephira,
  revealStage: number,
  variant: TreeVariant,
): boolean {
  if (variant === 'welcome') return true
  if (variant === 'complete') return true
  return sephira.revealStage <= revealStage
}

export function isPathRevealed(
  path: TreePath,
  revealStage: number,
  variant: TreeVariant,
): boolean {
  if (variant === 'welcome' || variant === 'complete') return true
  const a = sephirot[path.from]
  const b = sephirot[path.to]
  return a.revealStage <= revealStage && b.revealStage <= revealStage
}

export function areRootsRevealed(revealStage: number, variant: TreeVariant): boolean {
  if (variant === 'welcome' || variant === 'complete') return true
  return revealStage >= 1
}

export type TreeVariant = 'welcome' | 'explore' | 'complete'

export function getOpacityForElement(
  revealed: boolean,
  variant: TreeVariant,
): { stroke: number; fill: number; glow: number } {
  if (variant === 'welcome') {
    return revealed
      ? { stroke: 0.55, fill: 0.08, glow: 0.35 }
      : { stroke: 0.2, fill: 0, glow: 0.1 }
  }
  if (variant === 'complete') {
    return { stroke: 0.75, fill: 0.12, glow: 0.55 }
  }
  return revealed
    ? { stroke: 0.85, fill: 0.14, glow: 0.55 }
    : { stroke: 0.06, fill: 0, glow: 0 }
}
