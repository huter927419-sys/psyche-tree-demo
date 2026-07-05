/** Homepage ambient background ids in public/backgrounds/{id}.png */
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

const BACKGROUND_SCENE_VERSION = 3

export function backgroundSceneSrc(id: BackgroundSceneId): string {
  return `/backgrounds/${id}.png?v=${BACKGROUND_SCENE_VERSION}`
}

export function availableBackgroundScenes(): BackgroundSceneId[] {
  return BACKGROUND_SCENES_AVAILABLE
}
