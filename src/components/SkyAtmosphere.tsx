import { memo, type CSSProperties } from 'react'
import type { VisualTier } from '../hooks/useVisualTier'

interface SkyAtmosphereProps {
  intensity?: 'welcome' | 'journey' | 'still'
  awakeningLevel?: number
  isComplete?: boolean
  visualTier?: VisualTier
  readingFocus?: boolean
}

export const SkyAtmosphere = memo(function SkyAtmosphere({
  intensity = 'welcome',
  awakeningLevel = 0,
  isComplete = false,
  visualTier = 'balanced',
  readingFocus = false,
}: SkyAtmosphereProps) {
  const level = Math.max(0, Math.min(7, awakeningLevel))
  const levelRatio = level / 7
  const isJourney = intensity === 'journey'
  const isLite = visualTier !== 'full'
  const isMinimal = visualTier === 'minimal'
  const focusDim = readingFocus ? 0.32 : 1

  const beamOpacity =
    (isJourney
      ? 0.48 + levelRatio * 0.32
      : intensity === 'welcome'
        ? 0.4 + levelRatio * 0.1
        : 0.16) * focusDim
  const coreOpacity = beamOpacity * (isJourney ? 1.35 : 1.2)
  const mistOpacity =
    (isJourney ? 0.58 : intensity === 'welcome' ? 0.68 : 0.38) *
    (readingFocus ? 0.72 : 1)
  const moteCount = isMinimal
    ? 0
    : readingFocus
      ? 0
      : isLite
        ? isJourney
          ? 6
          : 10
        : isJourney
          ? 14
          : 16
  const haloStrength =
    (isComplete ? 1 : isJourney ? 0.5 + levelRatio * 0.4 : 0.35 + levelRatio * 0.55) *
    focusDim

  return (
    <div
      className={`sky-atmosphere sky-atmosphere--${visualTier}${isJourney ? ' sky-atmosphere--journey' : ''}${isComplete ? ' sky-atmosphere--complete' : ''}${readingFocus ? ' sky-atmosphere--reading-focus' : ''}`}
      aria-hidden
      data-awakening={level}
      style={
        {
          opacity: mistOpacity,
          '--awakening-level': levelRatio,
          '--halo-strength': haloStrength,
        } as CSSProperties
      }
    >
      <div className="sky-depth-field" />
      {!isMinimal && !isLite && <div className="sky-grain" />}

      {!isLite && isJourney && !readingFocus && <div className="sky-sacred-downpour" />}

      {!isMinimal && (
        <div className="sky-sacred-geometry">
          <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMin slice">
            <g className={isLite ? undefined : 'sky-geometry-spin'}>
              {[120, 168, 216, 264].map((r, i) => (
                <circle
                  key={r}
                  cx="400"
                  cy="120"
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.045)"
                  strokeWidth="0.6"
                  pathLength={100}
                  className={isLite ? undefined : 'sky-geometry-ring'}
                  style={isLite ? undefined : { animationDelay: `${i * 0.7}s` }}
                />
              ))}
            </g>
          </svg>
        </div>
      )}

      {!isMinimal && (
        <div className="sky-crown-halo">
          <span className="sky-crown-ring sky-crown-ring-1" />
          {!isLite && (
            <>
              <span className="sky-crown-ring sky-crown-ring-2" />
              <span className="sky-crown-ring sky-crown-ring-3" />
            </>
          )}
        </div>
      )}

      <div className="sky-wisdom-column">
        <div className="sky-light-beam" style={{ opacity: beamOpacity }} />
        <div className="sky-light-core" style={{ opacity: coreOpacity }} />
        {!isLite && isJourney && !readingFocus && <div className="sky-light-shafts" />}
      </div>

      <div className="sky-mist sky-mist-deep" />
      {!isMinimal && <div className="sky-mist sky-mist-mid" />}
      <div className="sky-mist sky-mist-shore" />

      {moteCount > 0 && (
        <div className="sky-mind-motes">
          {Array.from({ length: moteCount }, (_, i) => (
            <span
              key={i}
              className="sky-mote"
              style={{
                left: `${6 + (i * 5.7) % 88}%`,
                bottom: `${(i * 11) % 35}%`,
                animationDelay: `${(i * 0.53) % 6}s`,
                animationDuration: `${10 + (i % 4) * 2}s`,
                opacity: 0.1 + (i % 5) * 0.05 + levelRatio * 0.06,
              }}
            />
          ))}
        </div>
      )}

      {intensity !== 'still' && !isMinimal && (
        <div
          className={`sky-descent-glow ${intensity === 'welcome' ? 'animate-sky-descent' : 'sky-descent-glow-journey'}`}
        />
      )}

      {isComplete && !isMinimal && !readingFocus && (
        <div className="sky-completion-bloom" />
      )}
    </div>
  )
})
