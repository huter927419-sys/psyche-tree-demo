/** Guide prologue illustration ids in public/guide/{id}.png */
export const GUIDE_ILLUSTRATION_IDS = new Set([
  '01-shore-near',
  '02-six-facets',
  '03-still-pause',
  '04-name-in-flow',
  '05-enter-mist',
])

const GUIDE_ILLUST_VERSION = 5

export function guideIllustrationSrc(id: string): string {
  return `/guide/${id}.png?v=${GUIDE_ILLUST_VERSION}`
}

export function hasGuideIllustration(id: string): boolean {
  return GUIDE_ILLUSTRATION_IDS.has(id)
}
