/** Rhythm UI from spread open — never flash static full text before line-by-line read. */
export function useGuideRhythmSession(
  autoReading: boolean,
  rhythmActive: boolean,
  rhythmLocked: boolean,
  _sessionKey: string,
): boolean {
  return autoReading || rhythmActive || rhythmLocked
}
