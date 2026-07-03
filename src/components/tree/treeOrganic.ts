/** Organic tree silhouette — maps to Kabbalah reveal stages bottom → crown */

export interface OrganicBranch {
  id: string
  revealStage: number
  d: string
  strokeWidth: number
}

export interface OrganicCanopy {
  id: string
  revealStage: number
  cx: number
  cy: number
  rx: number
  ry: number
  rotate?: number
}

/** Tapered trunk fill path */
export const trunkPath =
  'M372,895 C368,820 376,740 382,660 C388,560 384,460 388,360 ' +
  'C392,260 396,160 400,55 L408,55 C412,160 416,260 420,360 ' +
  'C424,460 420,560 426,660 C432,740 440,820 436,895 Z'

export const organicRoots: OrganicBranch[] = [
  {
    id: 'root-l',
    revealStage: 1,
    d: 'M400,878 Q340,910 270,895 Q320,870 385,858',
    strokeWidth: 2.2,
  },
  {
    id: 'root-r',
    revealStage: 1,
    d: 'M400,878 Q460,910 530,895 Q480,870 415,858',
    strokeWidth: 2.2,
  },
  {
    id: 'root-c',
    revealStage: 1,
    d: 'M400,878 Q400,920 400,898',
    strokeWidth: 1.8,
  },
]

export const organicBranches: OrganicBranch[] = [
  {
    id: 'branch-lower-l',
    revealStage: 2,
    d: 'M392,680 Q340,640 280,580 Q250,560 260,560',
    strokeWidth: 3.2,
  },
  {
    id: 'branch-lower-r',
    revealStage: 2,
    d: 'M408,680 Q460,640 520,580 Q550,560 540,560',
    strokeWidth: 3.2,
  },
  {
    id: 'branch-mid-l',
    revealStage: 3,
    d: 'M395,520 Q320,460 260,400 Q230,380 220,380',
    strokeWidth: 2.8,
  },
  {
    id: 'branch-mid-r',
    revealStage: 3,
    d: 'M405,520 Q480,460 540,400 Q570,380 580,380',
    strokeWidth: 2.8,
  },
  {
    id: 'branch-upper-l',
    revealStage: 5,
    d: 'M398,340 Q340,260 300,200 Q285,180 280,180',
    strokeWidth: 2.4,
  },
  {
    id: 'branch-upper-r',
    revealStage: 5,
    d: 'M402,340 Q460,260 500,200 Q515,180 520,180',
    strokeWidth: 2.4,
  },
  {
    id: 'branch-crown',
    revealStage: 6,
    d: 'M400,280 Q400,200 400,120 Q400,90 400,80',
    strokeWidth: 2.6,
  },
  {
    id: 'twig-ll',
    revealStage: 4,
    d: 'M260,560 Q220,540 190,520 M260,560 Q240,530 225,505',
    strokeWidth: 1.2,
  },
  {
    id: 'twig-lr',
    revealStage: 4,
    d: 'M540,560 Q580,540 610,520 M540,560 Q560,530 575,505',
    strokeWidth: 1.2,
  },
  {
    id: 'twig-ul',
    revealStage: 6,
    d: 'M280,180 Q250,160 230,145 M280,180 Q265,155 255,135',
    strokeWidth: 1,
  },
  {
    id: 'twig-ur',
    revealStage: 6,
    d: 'M520,180 Q550,160 570,145 M520,180 Q535,155 545,135',
    strokeWidth: 1,
  },
]

export const organicCanopy: OrganicCanopy[] = [
  { id: 'canopy-main', revealStage: 6, cx: 400, cy: 110, rx: 200, ry: 95 },
  { id: 'canopy-l', revealStage: 6, cx: 290, cy: 155, rx: 115, ry: 70, rotate: -18 },
  { id: 'canopy-r', revealStage: 6, cx: 510, cy: 155, rx: 115, ry: 70, rotate: 18 },
  { id: 'canopy-mid', revealStage: 5, cx: 400, cy: 250, rx: 160, ry: 55 },
  { id: 'canopy-lower', revealStage: 4, cx: 400, cy: 430, rx: 130, ry: 45 },
]

export function isOrganicRevealed(
  revealStage: number,
  partStage: number,
  variant: 'welcome' | 'explore' | 'complete',
): boolean {
  if (variant === 'welcome' || variant === 'complete') return true
  return partStage <= revealStage
}
