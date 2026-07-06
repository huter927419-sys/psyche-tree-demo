/** Homepage ambient background ids in public/backgrounds/{id}.png + .webp */
export const BACKGROUND_SCENE_ORDER = [
  '01-mist-arrival',
  '02-far-peaks',
  '03-still-water',
  '04-light-column',
  '05-wind-mist',
  '06-night-shore',
] as const

export type BackgroundSceneId = (typeof BACKGROUND_SCENE_ORDER)[number]

/** Scenes imported so far — add id here after each import */
export const BACKGROUND_SCENES_AVAILABLE: BackgroundSceneId[] = [
  ...BACKGROUND_SCENE_ORDER,
]

const BACKGROUND_SCENE_VERSION = 4

export function backgroundSceneBase(id: BackgroundSceneId): string {
  return `/backgrounds/${id}`
}

export function backgroundSceneSrc(id: BackgroundSceneId): string {
  return `${backgroundSceneBase(id)}.png?v=${BACKGROUND_SCENE_VERSION}`
}

export function availableBackgroundScenes(): BackgroundSceneId[] {
  return BACKGROUND_SCENES_AVAILABLE
}

export function prefetchBackgroundScene(id: BackgroundSceneId): void {
  if (typeof window === 'undefined') return
  const query = `?v=${BACKGROUND_SCENE_VERSION}`
  const img = new Image()
  img.decoding = 'async'
  img.src = `${backgroundSceneBase(id)}.webp${query}`
  img.onerror = () => {
    const fallback = new Image()
    fallback.decoding = 'async'
    fallback.src = `${backgroundSceneBase(id)}.png${query}`
  }
}

export function prefetchBackgroundScenesIdle(ids: BackgroundSceneId[]): void {
  if (typeof window === 'undefined' || ids.length === 0) return
  const run = () => {
    for (const id of ids) prefetchBackgroundScene(id)
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 5000 })
  } else {
    window.setTimeout(run, 300)
  }
}
