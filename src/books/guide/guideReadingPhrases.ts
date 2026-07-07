import type { GuideLineAccent } from './guideTextAccents'
import { phraseLightScheduleMs } from './guideReadingTiming'

/** Split a line into breath-groups for in-line reading (not per character). */
export function splitReadingPhrases(
  line: string,
  accent: GuideLineAccent,
): string[] {
  if (accent === 'staccato' || accent === 'flow') {
    return [line]
  }

  if (line.length <= 12) {
    return [line]
  }

  const parts = line.match(/[^，。！？；、]+[，。！？；、]?/g)
  if (!parts || parts.length <= 1) {
    return [line]
  }

  return parts.filter((part) => part.length > 0)
}

export { phraseLightScheduleMs }
