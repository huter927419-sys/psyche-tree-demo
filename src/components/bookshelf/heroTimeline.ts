export const CHAR_STAGGER_S = 0.068
export const CHAR_IGNITE_S = 0.92
export const LINE_BREAK_S = 0.38
export const AFTER_VERSE_PAUSE_S = 0.42
export const FACET_STAGGER_S = 0.52
export const FACET_BEACON_S = 1.12
export const TAIL_FADE_S = 0.85
/** Pause at full reveal before the next loop */
export const LOOP_HOLD_S = 2.6

export function buildHeroTimeline(lines: readonly string[], facetCount: number) {
  const lineStartDelays: number[] = []
  let t = 0

  lines.forEach((line, lineIndex) => {
    lineStartDelays[lineIndex] = t
    t += line.length * CHAR_STAGGER_S
    if (lineIndex < lines.length - 1) {
      t += LINE_BREAK_S
    }
  })

  const facetStart = t + CHAR_IGNITE_S + AFTER_VERSE_PAUSE_S
  const lastFacetEnd = facetStart + (facetCount - 1) * FACET_STAGGER_S + FACET_BEACON_S
  const hintStart = lastFacetEnd + 0.14
  const sealStart = hintStart + TAIL_FADE_S * 0.35
  const cycleDurationS = sealStart + TAIL_FADE_S + LOOP_HOLD_S

  return { lineStartDelays, facetStart, hintStart, sealStart, cycleDurationS }
}
