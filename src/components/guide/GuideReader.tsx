import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// Auto turn (展息) is scoped to 序卷《同观》 only — BookReader is manual + card-select flip.
import {
  getGuideSpreadIndex,
  getLocalizedGuideContent,
  markGuideCompleted,
  saveGuideSpreadIndex,
} from '../../books/guide'
import {
  estimateGuideSpreadDwellMs,
  getGuideAutoTurnEnabled,
  getSpreadIllustrationId,
  GUIDE_POST_FLIP_SETTLE_MS,
  GUIDE_POST_FLIP_SETTLE_REDUCED_MS,
  saveGuideAutoTurnEnabled,
  spreadHasIllustration,
} from '../../books/guide/guideAutoTurn'
import {
  getGuideIllustrationDurationMs,
  getGuideIllustrationHoldMs,
} from '../../books/guide/illustrationMotion'
import { prefetchGuideIllustrations } from '../../books/guide/illustrations'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { BookNav, BookShell } from '../book/BookShell'
import { useBookFlip } from '../book/useBookFlip'
import { GuidePageContent } from './GuidePageContent'

interface GuideReaderProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onClose: () => void
  onCompleted?: () => void
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function GuideReader({
  locale,
  onLocaleChange,
  onClose,
  onCompleted,
}: GuideReaderProps) {
  const ui = getUi(locale)
  const guide = useMemo(() => getLocalizedGuideContent(locale), [locale])
  const totalSpreads = guide.spreads.length
  const [pageIndex, setPageIndex] = useState(() =>
    Math.min(getGuideSpreadIndex(), totalSpreads - 1),
  )
  const [autoTurn, setAutoTurn] = useState(() => getGuideAutoTurnEnabled())

  const autoTimerRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)
  const illustrationAdvanceRef = useRef(false)
  const prevPageIndexRef = useRef(pageIndex)
  const [spreadSettled, setSpreadSettled] = useState(true)

  useEffect(() => {
    setPageIndex(Math.min(getGuideSpreadIndex(), totalSpreads - 1))
  }, [locale, totalSpreads])

  useEffect(() => {
    prefetchGuideIllustrations()
  }, [])

  const handleIndexChange = useCallback((index: number) => {
    setPageIndex(index)
    saveGuideSpreadIndex(index)
  }, [])

  const { flipping, flipDirection, pendingIndex, flipSerial, runFlip, completeFlip } =
    useBookFlip(handleIndexChange)

  const isEnterSpread = pageIndex === guide.enterSpreadIndex
  const isLastSpread = pageIndex >= totalSpreads - 1
  const contentVisible = !flipping
  const illustrationReady = !flipping && spreadSettled

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = null
    }
  }, [])

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (flipping) {
      setSpreadSettled(false)
      clearSettleTimer()
    }
  }, [clearSettleTimer, flipping])

  useEffect(() => {
    if (flipping) return undefined

    if (prevPageIndexRef.current === pageIndex) {
      return undefined
    }

    prevPageIndexRef.current = pageIndex
    setSpreadSettled(false)
    clearSettleTimer()

    const settleMs = prefersReducedMotion()
      ? GUIDE_POST_FLIP_SETTLE_REDUCED_MS
      : GUIDE_POST_FLIP_SETTLE_MS

    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null
      setSpreadSettled(true)
    }, settleMs)

    return () => clearSettleTimer()
  }, [clearSettleTimer, flipping, pageIndex])

  const scheduleFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSpreads) return
      clearAutoTimer()
      runFlip(direction, targetIndex)
    },
    [clearAutoTimer, runFlip, totalSpreads],
  )

  const scheduleAutoAdvance = useCallback(
    (delayMs: number) => {
      clearAutoTimer()
      if (!autoTurn || flipping || isEnterSpread || isLastSpread) return

      autoTimerRef.current = window.setTimeout(() => {
        autoTimerRef.current = null
        scheduleFlip('next', pageIndex + 1)
      }, delayMs)
    },
    [
      autoTurn,
      clearAutoTimer,
      flipping,
      isEnterSpread,
      isLastSpread,
      pageIndex,
      scheduleFlip,
    ],
  )

  const handleIllustrationMotionComplete = useCallback(() => {
    illustrationAdvanceRef.current = true
    if (!autoTurn || flipping || isEnterSpread || isLastSpread) return
    clearAutoTimer()
    const spread = guide.spreads[pageIndex]
    const illustrationId = getSpreadIllustrationId(spread)
    const holdMs = illustrationId
      ? getGuideIllustrationHoldMs(illustrationId)
      : 2000
    scheduleAutoAdvance(holdMs)
  }, [
    autoTurn,
    clearAutoTimer,
    flipping,
    guide.spreads,
    isEnterSpread,
    isLastSpread,
    pageIndex,
    scheduleAutoAdvance,
  ])

  useEffect(() => {
    if (!autoTurn || flipping || !spreadSettled || isEnterSpread || isLastSpread) {
      clearAutoTimer()
      return undefined
    }

    illustrationAdvanceRef.current = false
    const spread = guide.spreads[pageIndex]

    if (spreadHasIllustration(spread)) {
      const illustrationId = getSpreadIllustrationId(spread)
      const durationMs = illustrationId
        ? getGuideIllustrationDurationMs(illustrationId)
        : 5500
      const fallbackMs = prefersReducedMotion() ? 3200 : durationMs + 2500

      autoTimerRef.current = window.setTimeout(() => {
        autoTimerRef.current = null
        if (!illustrationAdvanceRef.current) {
          const holdMs = illustrationId
            ? getGuideIllustrationHoldMs(illustrationId)
            : 2000
          scheduleAutoAdvance(holdMs)
        }
      }, fallbackMs)

      return () => clearAutoTimer()
    }

    const dwell = estimateGuideSpreadDwellMs(spread, {
      reducedMotion: prefersReducedMotion(),
    })
    scheduleAutoAdvance(dwell)
    return () => clearAutoTimer()
  }, [
    autoTurn,
    clearAutoTimer,
    flipping,
    guide.spreads,
    isEnterSpread,
    isLastSpread,
    pageIndex,
    scheduleAutoAdvance,
    spreadSettled,
  ])

  const handleBack = useCallback(() => {
    if (flipping || pageIndex === 0) return
    scheduleFlip('prev', pageIndex - 1)
  }, [flipping, pageIndex, scheduleFlip])

  const handleNext = useCallback(() => {
    if (flipping || isLastSpread) return
    scheduleFlip('next', pageIndex + 1)
  }, [flipping, isLastSpread, pageIndex, scheduleFlip])

  const handlePageClick = useCallback(
    (side: 'left' | 'right') => {
      if (side === 'left') {
        handleBack()
        return
      }
      handleNext()
    },
    [handleBack, handleNext],
  )

  const handleRestart = useCallback(() => {
    if (flipping || pageIndex === 0) return
    clearAutoTimer()
    clearSettleTimer()
    prevPageIndexRef.current = 0
    setSpreadSettled(true)
    setPageIndex(0)
    saveGuideSpreadIndex(0)
  }, [clearAutoTimer, clearSettleTimer, flipping, pageIndex])

  const handleToggleAutoTurn = useCallback(() => {
    setAutoTurn((current) => {
      const next = !current
      saveGuideAutoTurnEnabled(next)
      return next
    })
  }, [])

  const handleEnterShore = useCallback(() => {
    clearAutoTimer()
    clearSettleTimer()
    markGuideCompleted()
    onCompleted?.()
    onClose()
  }, [clearAutoTimer, clearSettleTimer, onClose, onCompleted])

  const pageContentProps = useMemo(
    () => ({
      locale,
      contentVisible,
      illustrationReady,
      onIllustrationMotionComplete: handleIllustrationMotionComplete,
    }),
    [
      contentVisible,
      handleIllustrationMotionComplete,
      illustrationReady,
      locale,
    ],
  )

  const buildSpread = useCallback(
    (index: number) => {
      const spread = guide.spreads[index]
      return {
        left: (
          <GuidePageContent
            blocks={spread.left}
            spreadIndex={index}
            {...pageContentProps}
          />
        ),
        right: (
          <GuidePageContent
            blocks={spread.right}
            spreadIndex={index}
            {...pageContentProps}
          />
        ),
      }
    },
    [guide.spreads, pageContentProps],
  )

  const current = buildSpread(pageIndex)
  const incoming =
    pendingIndex !== null ? buildSpread(pendingIndex) : undefined

  const displayPageNumber =
    flipping && pendingIndex !== null ? pendingIndex + 1 : pageIndex + 1

  const chapterLabel = useMemo(() => {
    for (let i = pageIndex; i >= 0; i -= 1) {
      const partBlock = [...guide.spreads[i].left, ...guide.spreads[i].right].find(
        (block) => block.kind === 'part',
      )
      if (partBlock?.text) return partBlock.text
    }
    return ui.guideChapterLabel
  }, [guide.spreads, pageIndex, ui.guideChapterLabel])

  const navProps = {
    onBack: handleBack,
    backDisabled: pageIndex === 0 || flipping,
    backLabel: ui.guideTurnPrev,
    onRestart: handleRestart,
    restartDisabled: flipping || pageIndex === 0,
    restartLabel: ui.guideRestartReading,
    showRestart: pageIndex > 0,
  }

  const autoTurnToggle = (
    <div className="guide-auto-turn-row">
      <button
        type="button"
        onClick={handleToggleAutoTurn}
        disabled={flipping || isEnterSpread}
        className={`guide-auto-turn-toggle${autoTurn ? ' guide-auto-turn-toggle--on' : ''}`}
        aria-pressed={autoTurn}
      >
        {autoTurn ? ui.guideAutoTurnOn : ui.guideAutoTurnOff}
      </button>
      {autoTurn && !isEnterSpread && !isLastSpread && (
        <span className="guide-auto-turn-hint">{ui.guideAutoTurnHint}</span>
      )}
    </div>
  )

  const footerBlock =
    isEnterSpread ? (
      <div className="flex flex-col gap-4">
        {autoTurnToggle}
        <BookNav
          {...navProps}
          showNext={false}
          selectOneHint={ui.guideEnterHint}
        />
        <button
          type="button"
          onClick={handleEnterShore}
          className="book-nav-btn book-nav-btn-primary w-full"
        >
          {ui.guideEnterShore}
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {autoTurnToggle}
        <BookNav
          {...navProps}
          onNext={handleNext}
          nextDisabled={flipping || isLastSpread}
          nextLabel={ui.guideTurnNext}
        />
      </div>
    )

  const bookShell = (
    <BookShell
      left={current.left}
      right={current.right}
      incomingLeft={incoming?.left}
      incomingRight={incoming?.right}
      pageNumber={displayPageNumber}
      totalPages={totalSpreads}
      chapterLabel={chapterLabel}
      flipping={flipping}
      flipDirection={flipDirection}
      flipSerial={flipSerial}
      onFlipComplete={completeFlip}
      locale={locale}
      coverArtId="guide"
      pageClickEnabled={!flipping}
      onPageClick={handlePageClick}
      pageTurnPrevLabel={ui.guidePageTurnPrevAria}
      pageTurnNextLabel={ui.guidePageTurnNextAria}
      pageTurnLeftDisabled={pageIndex === 0 || flipping}
      pageTurnRightDisabled={flipping || isLastSpread}
    />
  )

  return (
    <div className="guide-book-scene book-cover-scene book-scene flex flex-col items-center min-h-[min(88vh,920px)] px-4 py-6 md:py-8">
      <header className="book-cover-header">
        <button
          type="button"
          onClick={onClose}
          disabled={flipping}
          className="book-nav-btn book-nav-btn-ghost text-xs shrink-0 disabled:opacity-30"
        >
          {ui.backToShore}
        </button>
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label={ui.languageLabel}
          compact
        />
      </header>

      <div className="guide-book-eyebrow-spacer" aria-hidden />

      <div className="guide-book-anchor guide-book-anchor--open">{bookShell}</div>

      <div className="guide-book-controls">{footerBlock}</div>
    </div>
  )
}
