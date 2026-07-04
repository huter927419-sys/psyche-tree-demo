import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { UiStrings } from '../../i18n/ui'
import {
  buildHeroTimeline,
  CHAR_STAGGER_S,
  FACET_BEACON_S,
  FACET_STAGGER_S,
} from './heroTimeline'

interface BookshelfHeroProseProps {
  ui: UiStrings
  onFacetBeacon?: (index: number, active: boolean) => void
  onFacetBeaconReset?: () => void
}

function usePrefersReducedMotion() {
  return useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
}

function IgniteLine({
  text,
  lineIndex,
  startDelay,
  animate,
  cycleKey,
}: {
  text: string
  lineIndex: number
  startDelay: number
  animate: boolean
  cycleKey: number
}) {
  if (!animate) return <>{text}</>

  return (
    <>
      {[...text].map((char, index) => (
        <span
          key={`${cycleKey}-${lineIndex}-${index}`}
          className="bookshelf-hero-char"
          style={{ animationDelay: `${startDelay + index * CHAR_STAGGER_S}s` }}
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </>
  )
}

export function BookshelfHeroProse({
  ui,
  onFacetBeacon,
  onFacetBeaconReset,
}: BookshelfHeroProseProps) {
  const reduceMotion = usePrefersReducedMotion()
  const animate = !reduceMotion
  const [cycleKey, setCycleKey] = useState(0)
  const proseRef = useRef<HTMLDivElement>(null)
  const onFacetBeaconRef = useRef(onFacetBeacon)
  const onFacetBeaconResetRef = useRef(onFacetBeaconReset)
  const beaconGenRef = useRef(0)

  onFacetBeaconRef.current = onFacetBeacon
  onFacetBeaconResetRef.current = onFacetBeaconReset

  const facetCount = ui.shelfFacetNames.length

  const { lineStartDelays, facetStart, hintStart, sealStart, cycleDurationS } =
    useMemo(
      () => buildHeroTimeline(ui.shelfProseLines, facetCount),
      [ui.shelfProseLines, facetCount],
    )

  useEffect(() => {
    setCycleKey(0)
  }, [ui.shelfProseLines])

  useEffect(() => {
    if (!animate) return

    const intervalId = window.setInterval(() => {
      if (document.hidden) return
      setCycleKey((key) => key + 1)
    }, cycleDurationS * 1000)

    return () => window.clearInterval(intervalId)
  }, [animate, cycleDurationS])

  useEffect(() => {
    if (!animate || !onFacetBeaconRef.current) return

    const gen = ++beaconGenRef.current
    onFacetBeaconResetRef.current?.()

    const timerIds: number[] = []

    for (let index = 0; index < facetCount; index++) {
      const startMs = (facetStart + index * FACET_STAGGER_S) * 1000
      const endMs = startMs + FACET_BEACON_S * 1000

      timerIds.push(
        window.setTimeout(() => {
          if (beaconGenRef.current !== gen || document.hidden) return
          onFacetBeaconRef.current?.(index, true)
        }, startMs),
      )
      timerIds.push(
        window.setTimeout(() => {
          if (beaconGenRef.current !== gen || document.hidden) return
          onFacetBeaconRef.current?.(index, false)
        }, endMs),
      )
    }

    return () => {
      timerIds.forEach((id) => window.clearTimeout(id))
    }
  }, [animate, cycleKey, facetStart, facetCount])

  const fullVerse = ui.shelfProseLines.join(' ')

  return (
    <div
      ref={proseRef}
      className={`bookshelf-hero-prose${animate ? ' bookshelf-hero-prose--animate' : ''}`}
    >
      <div className="bookshelf-hero-verse" aria-label={fullVerse}>
        {ui.shelfProseLines.map((line, lineIndex) => (
          <p key={line} className="bookshelf-hero-verse-line">
            <IgniteLine
              text={line}
              lineIndex={lineIndex}
              startDelay={lineStartDelays[lineIndex] ?? 0}
              animate={animate}
              cycleKey={cycleKey}
            />
          </p>
        ))}
      </div>

      <div
        key={`facets-${cycleKey}`}
        className={`bookshelf-hero-facets-block${animate ? ' bookshelf-hero-facets-block--rise' : ''}`}
        style={animate ? { animationDelay: `${facetStart - 0.22}s` } : undefined}
      >
        <p
          className={`bookshelf-hero-facets-label${animate ? ' bookshelf-hero-tail' : ''}`}
          style={animate ? { animationDelay: `${facetStart - 0.18}s` } : undefined}
        >
          {ui.shelfFacetLabel}
        </p>
        <div className="bookshelf-hero-facets">
          {ui.shelfFacetNames.map((name, index) => (
            <Fragment key={name}>
              {index > 0 && (
                <span className="bookshelf-hero-facet-sep" aria-hidden>
                  ·
                </span>
              )}
              <span
                key={`${cycleKey}-${index}-${name}`}
                className={`bookshelf-hero-facet${animate ? ' bookshelf-hero-facet--beacon' : ''}`}
                style={
                  animate
                    ? { animationDelay: `${facetStart + index * FACET_STAGGER_S}s` }
                    : undefined
                }
              >
                {name}
              </span>
            </Fragment>
          ))}
        </div>
        <p
          className={`bookshelf-hero-facet-hint${animate ? ' bookshelf-hero-tail' : ''}`}
          style={animate ? { animationDelay: `${hintStart}s` } : undefined}
        >
          {ui.shelfFacetHint}
        </p>
        <p
          className={`bookshelf-hero-facet-symbols${animate ? ' bookshelf-hero-tail' : ''}`}
          style={animate ? { animationDelay: `${hintStart + 0.12}s` } : undefined}
        >
          {ui.shelfFacetSymbols.join(' · ')}
        </p>
      </div>

      <p
        key={`seal-${cycleKey}`}
        className={`bookshelf-hero-seal${animate ? ' bookshelf-hero-tail' : ''}`}
        style={animate ? { animationDelay: `${sealStart}s` } : undefined}
      >
        {ui.shelfProseSeal}
      </p>
    </div>
  )
}
