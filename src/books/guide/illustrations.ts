/** Guide prologue illustration ids in public/guide/{id}.png + .webp */
export const GUIDE_ILLUSTRATION_IDS = new Set([
  '01-shore-near',
  '02-six-facets',
  '03-still-pause',
  '04-name-in-flow',
  '05-enter-mist',
])

const GUIDE_ILLUST_VERSION = 6

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
    img.src = `${guideIllustrationBase(id)}.webp${query}`
    img.onload = () => load(index + 1)
    img.onerror = () => {
      const fallback = new Image()
      fallback.decoding = 'async'
      fallback.src = `${guideIllustrationBase(id)}.png${query}`
      fallback.onload = () => load(index + 1)
      fallback.onerror = () => load(index + 1)
    }
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
