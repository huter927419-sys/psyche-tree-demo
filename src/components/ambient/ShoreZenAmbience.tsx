import { memo, type CSSProperties } from 'react'
import type { VisualTier } from '../../hooks/useVisualTier'

interface ShoreZenAmbienceProps {
  intensity?: 'welcome' | 'journey' | 'still'
  visualTier?: VisualTier
  readingFocus?: boolean
}

/** Atmospheric layer only — mist, cloud, wind; no literal figures. */
export const ShoreZenAmbience = memo(function ShoreZenAmbience({
  intensity = 'welcome',
  visualTier = 'balanced',
  readingFocus = false,
}: ShoreZenAmbienceProps) {
  const isMinimal = visualTier === 'minimal'
  const isWelcome = intensity === 'welcome'
  const layerOpacity = readingFocus ? 0.38 : isWelcome ? 0.72 : 0.58
  const cloudCount = isMinimal ? 0 : readingFocus ? 1 : 2
  const windCount = isMinimal || readingFocus ? 0 : 2
  const showPresence = !isMinimal && !readingFocus && isWelcome

  return (
    <div
      className={`shore-zen-ambience shore-zen-ambience--${visualTier}${readingFocus ? ' shore-zen-ambience--reading-focus' : ''}${isWelcome ? ' shore-zen-ambience--welcome' : ''}${isMinimal ? ' shore-zen-ambience--minimal' : ''}`}
      aria-hidden
      style={{ opacity: layerOpacity } as CSSProperties}
    >
      {!isMinimal && (
        <div className="shore-zen-ink-range">
          <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice">
            <path
              className="shore-zen-range-far"
              d="M0 240 C220 180 420 210 620 175 S920 200 1200 160 L1200 320 L0 320 Z"
            />
            <path
              className="shore-zen-range-near"
              d="M0 280 C180 210 320 240 480 200 S780 230 960 190 L1200 170 L1200 320 L0 320 Z"
            />
          </svg>
        </div>
      )}

      {cloudCount > 0 &&
        Array.from({ length: cloudCount }, (_, i) => (
          <span
            key={`cloud-${i}`}
            className={`shore-zen-cloud shore-zen-cloud--${i + 1}`}
            style={{
              animationDelay: `${i * -18}s`,
              animationDuration: `${48 + i * 12}s`,
            }}
          />
        ))}

      {windCount > 0 &&
        Array.from({ length: windCount }, (_, i) => (
          <span
            key={`wind-${i}`}
            className="shore-zen-wind"
            style={{
              top: `${26 + i * 22}%`,
              animationDelay: `${i * -8}s`,
              animationDuration: `${22 + i * 6}s`,
            }}
          />
        ))}

      {!isMinimal && (
        <div className="shore-zen-mist-band shore-zen-mist-band--shore" />
      )}

      {showPresence && (
        <>
          <span className="shore-zen-presence" aria-hidden />
          <span className="shore-zen-presence shore-zen-presence--echo" aria-hidden />
        </>
      )}
    </div>
  )
})
