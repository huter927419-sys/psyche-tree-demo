/** Guide prologue illustration ids in public/guide/{id}.png + .webp */
export const GUIDE_ILLUSTRATION_IDS = new Set([
  '01-shore-near',
  '02-six-facets',
  '03-still-pause',
  '04-name-in-flow',
  '05-enter-mist',
  'v-tongguan',
  'v-liubai',
  'v-changye',
  'v-menpai',
  'v-huisheng',
  'v-qingchen',
  'v-yuanxing',
  'v-liujuan',
  'v-enter',
])

export const GUIDE_VIGNETTE_ILLUSTRATION_IDS = [
  'v-tongguan',
  'v-liubai',
  'v-changye',
  'v-menpai',
  'v-huisheng',
  'v-qingchen',
  'v-yuanxing',
  'v-liujuan',
  'v-enter',
] as const

const GUIDE_ILLUST_VERSION = 19

export function guideIllustrationVersion(): number {
  return GUIDE_ILLUST_VERSION
}

export function guideIllustrationBase(id: string): string {
  return `/guide/${id}`
}

export function guideIllustrationSrc(id: string): string {
  return `${guideIllustrationBase(id)}.png?v=${GUIDE_ILLUST_VERSION}`
}

export function hasGuideIllustration(id: string): boolean {
  return GUIDE_ILLUSTRATION_IDS.has(id)
}

export function prefetchGuideIllustrations(ids?: Iterable<string>): void {
  if (typeof window === 'undefined') return
  const queue = ids ? [...ids] : [...GUIDE_ILLUSTRATION_IDS]
  const query = `?v=${GUIDE_ILLUST_VERSION}`

  const load = (index: number) => {
    if (index >= queue.length) return
    const id = queue[index]
    const img = new Image()
    img.decoding = 'async'
    img.src = `${guideIllustrationBase(id)}.png${query}`
    img.onload = () => load(index + 1)
    img.onerror = () => load(index + 1)
  }

  load(0)
}

export function prefetchGuideIllustrationsIdle(ids: Iterable<string>): void {
  if (typeof window === 'undefined') return
  const run = () => prefetchGuideIllustrations(ids)
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 4000 })
  } else {
    window.setTimeout(run, 200)
  }
}
