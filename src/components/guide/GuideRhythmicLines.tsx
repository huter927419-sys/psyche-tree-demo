import { useEffect, useMemo, useRef, useState } from 'react'
import type { GuideAccentBlockKind } from '../../books/guide/guideTextAccents'
import {
  buildRhythmLinePlan,
  countRhythmLines,
  planSegmentDurationMs,
  segmentAccentRhythmDurationMs,
  type GuideRhythmLinePlan,
} from '../../books/guide/guideRhythmPlan'
import {
  phraseLightScheduleMs,
  splitReadingPhrases,
} from '../../books/guide/guideReadingPhrases'
import { pageStartBreathMs, pageEndBreathMs } from '../../books/guide/guideReadingTiming'
import type { GuideRhythmMode } from '../../books/guide/guideTextRhythm'

interface GuideRhythmicLinesProps {
  lines: readonly string[]
  mode: GuideRhythmMode
  active: boolean
  getLineClass?: (line: string, index: number) => string
  accentBlockKind?: GuideAccentBlockKind
  rhythmLocked?: boolean
  onComplete?: () => void
}

type LineReadPhase = 'pending' | 'speaking' | 'hold' | 'spoken'

type ActivePhase = 'speak' | 'hold' | 'gap' | 'none'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function linePhase(
  planIndex: number,
  activeLine: number,
  activePhase: ActivePhase,
): LineReadPhase {
  if (activeLine < 0) return 'pending'
  if (planIndex < activeLine) return 'spoken'
  if (planIndex > activeLine) return 'pending'
  if (activePhase === 'gap') return 'spoken'
  if (activePhase === 'hold') return 'hold'
  if (activePhase === 'speak') return 'speaking'
  return 'pending'
}

function renderLineContent(
  line: string,
  accent: GuideRhythmLinePlan['accent'],
  phase: LineReadPhase,
  litPhraseCount: number,
  phraseSteps: readonly number[],
) {
  const phrases = splitReadingPhrases(line, accent)

  if (phrases.length <= 1 || phase === 'pending' || phase === 'spoken') {
    return line
  }

  if (phase === 'hold') {
    return line
  }

  return phrases.map((phrase, phraseIndex) => {
    const lit = phraseIndex < litPhraseCount
    const stepMs =
      phraseIndex === 0
        ? phraseSteps[0] ?? 0
        : (phraseSteps[phraseIndex] ?? 0) - (phraseSteps[phraseIndex - 1] ?? 0)

    return (
      <span
        key={`${phraseIndex}-${phrase}`}
        className={
          lit ? 'guide-rhythm-phrase guide-rhythm-phrase--lit' : 'guide-rhythm-phrase'
        }
        style={
          lit
            ? ({
                '--phrase-step-ms': `${Math.max(160, stepMs)}ms`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {phrase}
      </span>
    )
  })
}

export function GuideRhythmicLines({
  lines,
  mode,
  active,
  getLineClass,
  accentBlockKind,
  rhythmLocked = false,
  onComplete,
}: GuideRhythmicLinesProps) {
  const completedRef = useRef(false)
  const reducedMotion = prefersReducedMotion()
  const totalLines = useMemo(() => countRhythmLines(lines), [lines])
  const resolveLineClass = useMemo(
    () => getLineClass ?? (() => ''),
    [getLineClass],
  )

  const linePlan = useMemo(
    () =>
      buildRhythmLinePlan(
        lines,
        mode,
        resolveLineClass,
        accentBlockKind,
        reducedMotion,
      ),
    [accentBlockKind, lines, mode, reducedMotion, resolveLineClass],
  )

  const [activeLine, setActiveLine] = useState(-1)
  const [activePhase, setActivePhase] = useState<ActivePhase>('none')
  const [litPhraseCount, setLitPhraseCount] = useState(0)
  const [readComplete, setReadComplete] = useState(false)

  useEffect(() => {
    completedRef.current = false
    setActiveLine(-1)
    setActivePhase('none')
    setLitPhraseCount(0)
    setReadComplete(false)
  }, [lines, mode, accentBlockKind])

  const waitingToRead = !active && !readComplete

  useEffect(() => {
    if (!active || !onComplete || totalLines === 0 || readComplete) return undefined

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, segmentAccentRhythmDurationMs(
        lines,
        mode,
        resolveLineClass,
        accentBlockKind,
        true,
      ))
      return () => window.clearTimeout(timer)
    }

    const timers: number[] = []
    let cancelled = false

    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn()
        }, ms),
      )
    }

    let cursor = pageStartBreathMs(mode, linePlan.length)

    linePlan.forEach((entry, planIndex) => {
      const phrases = splitReadingPhrases(entry.line, entry.accent)
      const phraseSchedule = phraseLightScheduleMs(phrases, entry.speakMs)
      const lineStart = cursor

      schedule(() => {
        setActiveLine(planIndex)
        setActivePhase('speak')
        setLitPhraseCount(phrases.length <= 1 ? 1 : 0)
      }, lineStart)

      if (phrases.length > 1) {
        phraseSchedule.forEach((atMs, phraseIndex) => {
          schedule(() => {
            setLitPhraseCount(phraseIndex + 1)
          }, lineStart + atMs)
        })
      }

      schedule(() => {
        setActivePhase('hold')
        setLitPhraseCount(phrases.length)
      }, lineStart + entry.speakMs)

      if (entry.gapMs > 0) {
        schedule(() => {
          setActivePhase('gap')
        }, lineStart + entry.speakMs + entry.holdMs)
      }

      cursor += entry.totalMs
    })

    schedule(() => {
      if (completedRef.current) return
      completedRef.current = true
      setActiveLine(linePlan.length)
      setActivePhase('none')
      setReadComplete(true)
      onComplete()
    }, cursor + pageEndBreathMs(mode) + 80)

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [
    accentBlockKind,
    active,
    linePlan,
    lines,
    mode,
    onComplete,
    reducedMotion,
    readComplete,
    resolveLineClass,
    totalLines,
  ])

  const allLinesSettled = readComplete || (active && activeLine >= linePlan.length)

  if (rhythmLocked || waitingToRead) {
    return (
      <>
        {linePlan.map((entry) => {
          const { line, lineIndex, lineClass: lineClassName } = entry
          return (
            <p
              key={`${line}-${lineIndex}`}
              className={`guide-rhythm-line guide-rhythm-line--pending ${lineClassName}`.trim()}
              aria-hidden
            />
          )
        })}
      </>
    )
  }

  if (!active && readComplete) {
    return (
      <>
        {linePlan.map((entry) => {
          const { line, lineIndex, lineClass: lineClassName } = entry
          return (
            <p
              key={`${line}-${lineIndex}`}
              className={`guide-rhythm-line guide-rhythm-line--settled ${lineClassName}`.trim()}
            >
              {line}
            </p>
          )
        })}
      </>
    )
  }

  if (allLinesSettled && active) {
    return (
      <>
        {linePlan.map((entry) => {
          const { line, lineIndex, lineClass: lineClassName } = entry
          return (
            <p
              key={`${line}-${lineIndex}`}
              className={`guide-rhythm-line guide-rhythm-line--settled ${lineClassName}`.trim()}
            >
              {line}
            </p>
          )
        })}
      </>
    )
  }

  if (reducedMotion) {
    return (
      <>
        {linePlan.map((entry) => {
          const { line, lineIndex, lineClass: lineClassName } = entry
          return (
            <p
              key={`${line}-${lineIndex}`}
              className={`guide-rhythm-line guide-rhythm-line--spoken ${lineClassName}`.trim()}
            >
              {line}
            </p>
          )
        })}
      </>
    )
  }

  return (
    <>
      {linePlan.map((entry, planIndex) => {
        const { line, lineIndex, lineClass: lineClassName, accent, speakMs } = entry
        const phase = linePhase(planIndex, activeLine, activePhase)
        const phrases = splitReadingPhrases(line, accent)
        const phraseSchedule = phraseLightScheduleMs(phrases, speakMs)
        const isCurrentLine = planIndex === activeLine

        const lineClass = [
          'guide-rhythm-line',
          lineClassName,
          phase === 'spoken'
            ? 'guide-rhythm-line--spoken'
            : phase === 'pending'
              ? 'guide-rhythm-line--pending'
              : 'guide-rhythm-line--speaking',
          phase === 'hold' ? 'guide-rhythm-line--hold' : '',
          `guide-rhythm-line--${mode}`,
          (phase === 'speaking' || phase === 'hold') &&
          phrases.length <= 1 &&
          accent === 'default'
            ? 'guide-rhythm-line--sweep'
            : '',
          (phase === 'speaking' || phase === 'hold') && accent !== 'default'
            ? `guide-rhythm-line--accent-${accent}`
            : '',
          phase === 'spoken' && accent === 'dissolve'
            ? 'guide-rhythm-line--accent-dissolve-spoken'
            : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <p
            key={`${line}-${lineIndex}`}
            className={lineClass}
            style={
              phase === 'speaking' || phase === 'hold'
                ? ({
                    '--guide-speak-duration': `${speakMs}ms`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {renderLineContent(
              line,
              accent,
              phase,
              isCurrentLine ? litPhraseCount : phrases.length,
              phraseSchedule,
            )}
          </p>
        )
      })}
    </>
  )
}

export { planSegmentDurationMs }
