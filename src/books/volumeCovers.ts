/** Volume ids with imported cover art in public/covers/{id}.png */
export const VOLUME_COVER_IDS = new Set([
  'guide',
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
])

export function volumeCoverArtId(id: string): string | undefined {
  return VOLUME_COVER_IDS.has(id) ? id : undefined
}
