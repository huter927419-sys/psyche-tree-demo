import { useCallback, useEffect, useState } from 'react'
import {
  crossRightPhaseMs,
  initialSpreadPhase,
  leftPageViewMs,
  nextSpreadPhase,
  rightMotifInhaleMs,
  rightPageViewMs,
  spreadPageHasRhythm,
  spreadReflectMs,
  type SpreadReadPhase,
} from '../../books/guide/guideSpreadReading'
import type { GuideSpread } from '../../books/guide/types'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useGuideSpreadRhythm(
  spread: GuideSpread,
  spreadIndex: number,
  enabled: boolean,
) {
  const leftHasRhythm = spreadPageHasRhythm(spread.left)
  const rightHasRhythm = spreadPageHasRhythm(spread.right)
  const reducedMotion = prefersReducedMotion()

  const [phase, setPhase] = useState<SpreadReadPhase>(() =>
    initialSpreadPhase(spread),
  )

  useEffect(() => {
    setPhase(initialSpreadPhase(spread))
  }, [spread, spreadIndex])

  useEffect(() => {
    if (!enabled) return undefined
    if (
      phase !== 'viewLeft' &&
      phase !== 'viewRight' &&
      phase !== 'inhaleRight' &&
      phase !== 'crossRight' &&
      phase !== 'reflect'
    ) {
      return undefined
    }

    const dwellMs =
      phase === 'viewLeft'
        ? leftPageViewMs(spread, reducedMotion)
        : phase === 'viewRight'
          ? rightPageViewMs(spread, reducedMotion)
          : phase === 'inhaleRight'
            ? rightMotifInhaleMs(spread, reducedMotion)
            : phase === 'crossRight'
              ? crossRightPhaseMs(spread, reducedMotion)
              : spreadReflectMs(spread, reducedMotion)

    if (dwellMs <= 0) {
      setPhase((current) => nextSpreadPhase(spread, current))
      return undefined
    }

    const timer = window.setTimeout(() => {
      setPhase((current) => nextSpreadPhase(spread, current))
    }, dwellMs)

    return () => window.clearTimeout(timer)
  }, [enabled, phase, reducedMotion, spread, spreadIndex])

  const handleLeftComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'readLeft') return current
      return nextSpreadPhase(spread, 'readLeft')
    })
  }, [spread])

  const handleRightComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'readRight') return current
      return nextSpreadPhase(spread, 'readRight')
    })
  }, [spread])

  const rightWaiting =
    phase === 'viewLeft' ||
    phase === 'readLeft' ||
    phase === 'crossRight' ||
    phase === 'viewRight' ||
    phase === 'inhaleRight'

  return {
    phase,
    leftHasRhythm,
    rightHasRhythm,
    leftRhythmActive: enabled && phase === 'readLeft',
    rightRhythmActive: enabled && phase === 'readRight',
    rightRhythmLocked: enabled && rightHasRhythm && rightWaiting,
    rightInhale: enabled && phase === 'inhaleRight',
    crossRightActive: enabled && phase === 'crossRight',
    reflectActive: enabled && phase === 'reflect',
    handleLeftComplete,
    handleRightComplete,
  }
}
