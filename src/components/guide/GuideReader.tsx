import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// Auto turn (展息) is scoped to 序卷《同观》 only — BookReader is manual + card-select flip.
import { getGuideRitualCopy } from '../../books/guide/guideRitualCopy'
import {
  getGuideSpreadIndex,
  getLocalizedGuideContent,
  markGuideCompleted,
  saveGuideSpreadIndex,
} from '../../books/guide'
import {
  getGuideAutoTurnEnabled,
  GUIDE_POST_FLIP_SETTLE_MS,
  GUIDE_POST_FLIP_SETTLE_REDUCED_MS,
  saveGuideAutoTurnEnabled,
} from '../../books/guide/guideAutoTurn'
import { getSpreadRestProfile } from '../../books/guide/guideSpreadRest'
import {
  GUIDE_ILLUSTRATION_IDS,
  prefetchGuideIllustrations,
  prefetchGuideIllustrationsIdle,
} from '../../books/guide/illustrations'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { GUIDE_MOBILE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { BookNav, BookShell } from '../book/BookShell'
import { useBookFlip } from '../book/useBookFlip'
import { useGuideSpreadRhythm } from './useGuideSpreadRhythm'
import { GuideMobileReader } from './GuideMobileReader'
import { GuidePageContent } from './GuidePageContent'
import { GuideSpreadEyeCue } from './GuideSpreadEyeCue'

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
  const ritual = getGuideRitualCopy(locale)
  const guide = useMemo(() => getLocalizedGuideContent(locale), [locale])
  const totalSpreads = guide.spreads.length
  const [pageIndex, setPageIndex] = useState(() =>
    Math.min(getGuideSpreadIndex(), totalSpreads - 1),
  )
  const [autoTurn, setAutoTurn] = useState(() => getGuideAutoTurnEnabled())
  const isMobile = useMediaQuery(GUIDE_MOBILE_QUERY)
  const [mobileFading, setMobileFading] = useState(false)

  const autoTimerRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)
  const prevPageIndexRef = useRef(pageIndex)
  const [spreadSettled, setSpreadSettled] = useState(true)

  useEffect(() => {
    setPageIndex(Math.min(getGuideSpreadIndex(), totalSpreads - 1))
  }, [locale, totalSpreads])

  useEffect(() => {
    const spread = guide.spreads[pageIndex]
    const priority: string[] = []
    for (const block of [...spread.left, ...spread.right]) {
      if (block.kind === 'illustration') priority.push(block.id)
    }
    const nextSpread = guide.spreads[pageIndex + 1]
    if (nextSpread) {
      for (const block of [...nextSpread.left, ...nextSpread.right]) {
        if (block.kind === 'illustration') priority.push(block.id)
      }
    }
    if (priority.length > 0) {
      prefetchGuideIllustrations(priority)
      prefetchGuideIllustrationsIdle(
        [...GUIDE_ILLUSTRATION_IDS].filter((id) => !priority.includes(id)),
      )
    } else {
      prefetchGuideIllustrationsIdle(GUIDE_ILLUSTRATION_IDS)
    }
  }, [guide.spreads, pageIndex])

  const handleIndexChange = useCallback((index: number) => {
    setPageIndex(index)
    saveGuideSpreadIndex(index)
  }, [])

  const { flipping, flipDirection, pendingIndex, flipSerial, runFlip, completeFlip } =
    useBookFlip(handleIndexChange)

  const isEnterSpread = pageIndex === guide.enterSpreadIndex
  const isLastSpread = pageIndex >= totalSpreads - 1
  const busy = isMobile ? mobileFading : flipping
  const contentVisible = isMobile ? !mobileFading : !flipping
  const illustrationReady = isMobile ? !mobileFading : !flipping && spreadSettled

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
    if (isMobile || flipping) return undefined

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
  }, [clearSettleTimer, flipping, isMobile, pageIndex])

  const goToSpread = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSpreads) return
      clearAutoTimer()
      if (isMobile) {
        if (mobileFading || targetIndex === pageIndex) return
        setMobileFading(true)
        window.setTimeout(() => {
          handleIndexChange(targetIndex)
          prevPageIndexRef.current = targetIndex
          setSpreadSettled(true)
          setMobileFading(false)
        }, 220)
        return
      }
      runFlip(targetIndex > pageIndex ? 'next' : 'prev', targetIndex)
    },
    [
      clearAutoTimer,
      handleIndexChange,
      isMobile,
      mobileFading,
      pageIndex,
      runFlip,
      totalSpreads,
    ],
  )

  const scheduleFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSpreads) return
      if (isMobile) {
        goToSpread(targetIndex)
        return
      }
      clearAutoTimer()
      runFlip(direction, targetIndex)
    },
    [clearAutoTimer, goToSpread, isMobile, runFlip, totalSpreads],
  )

  const scheduleAutoAdvance = useCallback(
    (delayMs: number) => {
      clearAutoTimer()
      if (!autoTurn || busy || isEnterSpread || isLastSpread) return

      autoTimerRef.current = window.setTimeout(() => {
        autoTimerRef.current = null
        scheduleFlip('next', pageIndex + 1)
      }, delayMs)
    },
    [
      autoTurn,
      clearAutoTimer,
      busy,
      isEnterSpread,
      isLastSpread,
      pageIndex,
      scheduleFlip,
    ],
  )

  const spreadReady = isMobile ? !mobileFading : spreadSettled
  const spread = guide.spreads[pageIndex]
  const spreadRhythm = useGuideSpreadRhythm(
    spread,
    pageIndex,
    spreadReady && contentVisible,
  )
  const spreadRest = useMemo(
    () => getSpreadRestProfile(spread, prefersReducedMotion()),
    [spread],
  )
  const awaitingRestHold =
    autoTurn &&
    !busy &&
    spreadReady &&
    contentVisible &&
    !isEnterSpread &&
    !isLastSpread &&
    spreadRhythm.phase === 'done'

  const spreadReflecting =
    spreadRhythm.reflectActive && spreadReady && contentVisible && !flipping

  useEffect(() => {
    if (
      !autoTurn ||
      busy ||
      !spreadReady ||
      !contentVisible ||
      isEnterSpread ||
      isLastSpread
    ) {
      clearAutoTimer()
      return undefined
    }

    const currentSpread = guide.spreads[pageIndex]

    if (spreadRhythm.phase !== 'done') {
      clearAutoTimer()
      return undefined
    }

    const holdMs = getSpreadRestProfile(
      currentSpread,
      prefersReducedMotion(),
    ).postHoldMs
    scheduleAutoAdvance(holdMs)
    return () => clearAutoTimer()
  }, [
    autoTurn,
    busy,
    clearAutoTimer,
    contentVisible,
    guide.spreads,
    isEnterSpread,
    isLastSpread,
    pageIndex,
    scheduleAutoAdvance,
    spreadReady,
    spreadRhythm.phase,
  ])

  const handleBack = useCallback(() => {
    if (busy || pageIndex === 0) return
    scheduleFlip('prev', pageIndex - 1)
  }, [busy, pageIndex, scheduleFlip])

  const handleNext = useCallback(() => {
    if (busy || isLastSpread) return
    scheduleFlip('next', pageIndex + 1)
  }, [busy, isLastSpread, pageIndex, scheduleFlip])

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
    if (busy || pageIndex === 0) return
    clearAutoTimer()
    clearSettleTimer()
    prevPageIndexRef.current = 0
    setSpreadSettled(true)
    setMobileFading(false)
    setPageIndex(0)
    saveGuideSpreadIndex(0)
  }, [busy, clearAutoTimer, clearSettleTimer, pageIndex])

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
    }),
    [contentVisible, illustrationReady, locale],
  )

  const buildSpread = useCallback(
    (index: number) => {
      const spreadAt = guide.spreads[index]
      const isCurrent = index === pageIndex
      const isIncoming = pendingIndex === index
      const useAutoReading = autoTurn && (isCurrent || isIncoming)
      const rhythm = isCurrent
        ? spreadRhythm
        : {
            leftRhythmActive: false,
            rightRhythmActive: false,
            rightRhythmLocked: false,
            rightInhale: false,
            crossRightActive: false,
            reflectActive: false,
            handleLeftComplete: undefined,
            handleRightComplete: undefined,
          }

      return {
        left: (
          <GuidePageContent
            blocks={spreadAt.left}
            spreadIndex={index}
            autoReading={useAutoReading}
            rhythmActive={rhythm.leftRhythmActive}
            pageInhale={false}
            restVisual={
              isCurrent && awaitingRestHold ? spreadRest.visual : 'none'
            }
            pageLeftComplete={
              isCurrent &&
              (spreadRhythm.phase === 'crossRight' ||
                spreadRhythm.phase === 'viewRight' ||
                spreadRhythm.phase === 'readRight' ||
                spreadRhythm.phase === 'inhaleRight' ||
                spreadRhythm.phase === 'reflect' ||
                spreadRhythm.phase === 'done')
            }
            pageReflecting={isCurrent && spreadRhythm.reflectActive}
            onRhythmComplete={rhythm.handleLeftComplete}
            {...pageContentProps}
          />
        ),
        right: (
          <GuidePageContent
            blocks={spreadAt.right}
            spreadIndex={index}
            autoReading={useAutoReading}
            rhythmActive={rhythm.rightRhythmActive}
            rhythmLocked={rhythm.rightRhythmLocked}
            pageAwaitingCue={isCurrent && rhythm.crossRightActive}
            pageReflecting={isCurrent && rhythm.reflectActive}
            pageInhale={isCurrent && rhythm.rightInhale}
            restVisual={
              isCurrent && awaitingRestHold ? spreadRest.visual : 'none'
            }
            onRhythmComplete={rhythm.handleRightComplete}
            {...pageContentProps}
          />
        ),
      }
    },
    [autoTurn, awaitingRestHold, guide.spreads, pageContentProps, pageIndex, pendingIndex, spreadRest.visual, spreadRhythm],
  )

  const current = buildSpread(pageIndex)
  const incoming =
    pendingIndex !== null ? buildSpread(pendingIndex) : undefined

  const displayPageNumber = isMobile
    ? pageIndex + 1
    : flipping && pendingIndex !== null
      ? pendingIndex + 1
      : pageIndex + 1

  const chapterLabel = useMemo(() => {
    for (let i = pageIndex; i >= 0; i -= 1) {
      const blocks = [...guide.spreads[i].left, ...guide.spreads[i].right]
      const opening = blocks.find((block) => block.kind === 'storyOpening')
      if (opening?.kind === 'storyOpening') return opening.title
      const partBlock = blocks.find((block) => block.kind === 'part')
      if (partBlock?.kind === 'part') return partBlock.text
    }
    return ui.guideChapterLabel
  }, [guide.spreads, pageIndex, ui.guideChapterLabel])

  const navProps = {
    onBack: handleBack,
    backDisabled: pageIndex === 0 || busy,
    backLabel: ui.guideTurnPrev,
    onRestart: handleRestart,
    restartDisabled: busy || pageIndex === 0,
    restartLabel: ui.guideRestartReading,
    showRestart: pageIndex > 0,
  }

  const autoTurnToggle = (
    <div className="guide-auto-turn-row">
      <button
        type="button"
        onClick={handleToggleAutoTurn}
        disabled={busy || isEnterSpread}
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
          nextDisabled={busy || isLastSpread}
          nextLabel={ui.guideTurnNext}
        />
      </div>
    )

  const crossRightCue =
    spreadRhythm.crossRightActive && spreadReady && contentVisible && !flipping

  const bookAnchorClass = [
    'guide-book-anchor',
    'guide-book-anchor--open',
    awaitingRestHold && spreadRest.visual !== 'none'
      ? `guide-book-anchor--rest guide-book-anchor--rest-${spreadRest.visual}`
      : '',
    awaitingRestHold && spreadRest.visual === 'chapter'
      ? 'guide-book-anchor--rest-chapter-active'
      : '',
    crossRightCue ? 'guide-book-anchor--cross-right' : '',
    spreadReflecting ? 'guide-book-anchor--reflect' : '',
  ]
    .filter(Boolean)
    .join(' ')

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

  if (isMobile) {
    return (
      <GuideMobileReader
        locale={locale}
        onLocaleChange={onLocaleChange}
        onClose={onClose}
        backLabel={ui.backToShore}
        chapterLabel={chapterLabel}
        pageNumber={displayPageNumber}
        totalPages={totalSpreads}
        contentVisible={contentVisible}
        left={current.left}
        eyeCue={
          <>
            <GuideSpreadEyeCue
              visible={crossRightCue}
              orientation="vertical"
              ritual={ritual}
            />
            {spreadReflecting && (
              <div className="guide-spread-reflect-cue guide-spread-reflect-cue--mobile" aria-hidden>
                <span className="guide-spread-reflect-glyph">息</span>
              </div>
            )}
          </>
        }
        right={current.right}
        footer={footerBlock}
        onPrev={handleBack}
        onNext={handleNext}
        prevDisabled={pageIndex === 0 || busy}
        nextDisabled={busy || isLastSpread}
        prevAria={ui.guidePageTurnPrevAria}
        nextAria={ui.guidePageTurnNextAria}
        busy={busy}
      />
    )
  }

  return (
    <div className="guide-book-scene book-cover-scene book-scene flex flex-col items-center px-4 py-6 md:py-8">
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

      <div className={`${bookAnchorClass} relative`}>
        {bookShell}
        <GuideSpreadEyeCue visible={crossRightCue} orientation="horizontal" ritual={ritual} />
        {spreadReflecting && (
          <div className="guide-spread-reflect-cue" aria-hidden>
            <span className="guide-spread-reflect-glyph">息</span>
          </div>
        )}
        {awaitingRestHold && spreadRest.visual === 'chapter' && (
          <div className="guide-chapter-rest" aria-hidden>
            <span className="guide-chapter-rest-mist" />
            <span className="guide-chapter-rest-rule" />
            <span className="guide-chapter-rest-glyph">息</span>
            <span className="guide-chapter-rest-rule" />
          </div>
        )}
      </div>

      <div className="guide-book-controls">{footerBlock}</div>
    </div>
  )
}
