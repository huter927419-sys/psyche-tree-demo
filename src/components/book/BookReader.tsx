import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssessmentResult, CardOption } from '../../types'
import type { BookDefinition } from '../../books/types'
import { getBookResultLabels } from '../../books/types'
import { computeResults, getAttentionCheckCards } from '../../data/scoring'
import {
  fetchMysticalReadingForAssessment,
  saveBookAssessmentWithAnswers,
  saveFallbackReading,
} from '../../services/assessmentApi'
import {
  fetchHolisticReading,
  clearJourneySession,
  getJourneySession,
  isStaleJourneyError,
  type JourneyAssessmentDto,
  type JourneyDto,
} from '../../services/journeyApi'
import { buildAssessmentFromStored } from '../../services/storedAssessment'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { getQuestionGuide } from '../../i18n/questionGuide'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { QuestionCard } from '../QuestionCard'
import { TreeProgress } from '../tree/TreeProgress'
import { BookShell, BookNav } from './BookShell'
import { VolumeRiteOverlay } from './VolumeRiteOverlay'
import { QuestionSealReveal } from './QuestionSealReveal'
import { formatPageLabel } from './bookUtils'
import { useBookFlip } from './useBookFlip'

const AUTO_FLIP_MS = 420
const RESULT_PAGES = 3

function pickMysticalReading(
  session: JourneyAssessmentDto | null | undefined,
  targetLocale: Locale,
): { reading: string | null; fallback: boolean } {
  if (!session) return { reading: null, fallback: false }
  const byLocale: Record<
    Locale,
    { reading?: string | null; source?: string | null }
  > = {
    zh: {
      reading: session.mysticalReadingZh,
      source: session.mysticalReadingSourceZh,
    },
    zhTw: {
      reading: session.mysticalReadingZhTw,
      source: session.mysticalReadingSourceZhTw,
    },
    en: {
      reading: session.mysticalReadingEn,
      source: session.mysticalReadingSourceEn,
    },
    ja: {
      reading: session.mysticalReadingJa,
      source: session.mysticalReadingSourceJa,
    },
  }
  const entry = byLocale[targetLocale]
  if (entry.reading) {
    return { reading: entry.reading, fallback: entry.source === 'fallback' }
  }
  return { reading: null, fallback: false }
}

interface BookReaderProps {
  book: BookDefinition
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  enterFromCover?: boolean
  treeRevealStage?: number
  savedSession?: JourneyAssessmentDto | null
  journeySnapshot?: JourneyDto | null
  onProgressChange?: (
    currentIndex: number,
    answers: Record<string, string[]>,
  ) => void
  onAssessmentDone: (result: AssessmentResult) => void
  onJourneyPersisted?: () => void | Promise<void>
  onClose: () => void
}

export function BookReader({
  book,
  locale,
  onLocaleChange,
  enterFromCover = false,
  treeRevealStage = 0,
  savedSession = null,
  journeySnapshot = null,
  onProgressChange,
  onAssessmentDone,
  onJourneyPersisted,
  onClose,
}: BookReaderProps) {
  const readOnly = savedSession !== null
  const { questions } = book
  const questionCount = questions.length
  const totalSpreads = questionCount + RESULT_PAGES

  const [pageIndex, setPageIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null)
  const advanceTimer = useRef<number | null>(null)

  const {
    flipping,
    flipDirection,
    pendingIndex,
    flipSerial,
    runFlip,
    completeFlip,
  } = useBookFlip(setPageIndex)

  const labels = getBookResultLabels(book, locale)
  const ui = getUi(locale)
  const [mysticalReading, setMysticalReading] = useState('')
  const [loadingReading, setLoadingReading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)
  const [readingError, setReadingError] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [journeyComplete, setJourneyComplete] = useState(false)
  const [assessmentsCompleted, setAssessmentsCompleted] = useState(0)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [entryRiteComplete, setEntryRiteComplete] = useState(readOnly)
  const [exitRiteOpen, setExitRiteOpen] = useState(false)
  const [mysticalCache, setMysticalCache] = useState<
    Partial<Record<Locale, { reading: string; fallback: boolean }>>
  >({})
  const hydratedRef = useRef(false)

  const isQuestionSpread = pageIndex < questionCount
  const resultPageIndex = pageIndex - questionCount

  useEffect(
    () => () => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!flipping && isAdvancing) {
      setIsAdvancing(false)
    }
  }, [flipping, isAdvancing])

  useEffect(() => {
    if (pageIndex < questionCount) {
      onProgressChange?.(pageIndex, answers)
    }
  }, [pageIndex, answers, onProgressChange, questionCount])

  useEffect(() => {
    if (readOnly) return
    if (Object.keys(answers).length === 0) return
    setAssessment(computeResults(answers, questions, book))
  }, [book, questions, answers, readOnly])

  useEffect(() => {
    if (!savedSession || hydratedRef.current) return
    hydratedRef.current = true

    setAnswers(savedSession.answers)
    setAssessmentId(savedSession.id)
    const result = buildAssessmentFromStored(savedSession, book)
    setAssessment(result)
    onAssessmentDone(result)

    const mysticalFromSession = pickMysticalReading(savedSession, locale)
    if (mysticalFromSession.reading) {
      setMysticalReading(mysticalFromSession.reading)
      setUsedFallback(mysticalFromSession.fallback)
      setMysticalCache((prev) => ({
        ...prev,
        [locale]: {
          reading: mysticalFromSession.reading!,
          fallback: mysticalFromSession.fallback,
        },
      }))
    }
    if (savedSession.mysticalReadingZh) {
      setMysticalCache((prev) => ({
        ...prev,
        zh: {
          reading: savedSession.mysticalReadingZh!,
          fallback: savedSession.mysticalReadingSourceZh === 'fallback',
        },
      }))
    }
    if (savedSession.mysticalReadingEn) {
      setMysticalCache((prev) => ({
        ...prev,
        en: {
          reading: savedSession.mysticalReadingEn!,
          fallback: savedSession.mysticalReadingSourceEn === 'fallback',
        },
      }))
    }
    if (savedSession.mysticalReadingJa) {
      setMysticalCache((prev) => ({
        ...prev,
        ja: {
          reading: savedSession.mysticalReadingJa!,
          fallback: savedSession.mysticalReadingSourceJa === 'fallback',
        },
      }))
    }
    if (savedSession.mysticalReadingZhTw) {
      setMysticalCache((prev) => ({
        ...prev,
        zhTw: {
          reading: savedSession.mysticalReadingZhTw!,
          fallback: savedSession.mysticalReadingSourceZhTw === 'fallback',
        },
      }))
    }

    if (journeySnapshot) {
      setAssessmentsCompleted(journeySnapshot.assessments.length)
      if (journeySnapshot.status === 'completed') {
        setJourneyComplete(true)
      }
    }
  }, [
    book,
    journeySnapshot,
    locale,
    onAssessmentDone,
    savedSession,
  ])

  useEffect(() => {
    if (!assessment || pageIndex < questionCount) return

    let cancelled = false

    async function loadReading() {
      const cached = mysticalCache[locale] ?? pickMysticalReading(savedSession, locale)
      if (cached.reading) {
        setMysticalReading(cached.reading)
        setUsedFallback(cached.fallback)
        setLoadingReading(false)
        return
      }

      setLoadingReading(true)
      setUsedFallback(false)
      setReadingError(null)

      if (!assessmentId) {
        const fallback = book.generateMysticalReading(
          assessment!.dimensions,
          assessment!.psychologyProfile,
        )
        if (!cancelled) {
          setMysticalReading(fallback)
          setUsedFallback(true)
          setReadingError(saveError ?? ui.saveFailNoSession)
          setLoadingReading(false)
        }
        return
      }

      try {
        const { reading, readingZh, readingZhTw, readingEn, readingJa, source } =
          await fetchMysticalReadingForAssessment(assessmentId, locale)
        if (cancelled) return
        const nextCache: Partial<
          Record<Locale, { reading: string; fallback: boolean }>
        > = {}
        if (readingZh) {
          nextCache.zh = { reading: readingZh, fallback: source === 'fallback' }
        }
        if (readingZhTw) {
          nextCache.zhTw = {
            reading: readingZhTw,
            fallback: source === 'fallback',
          }
        }
        if (readingEn) {
          nextCache.en = { reading: readingEn, fallback: source === 'fallback' }
        }
        if (readingJa) {
          nextCache.ja = { reading: readingJa, fallback: source === 'fallback' }
        }
        nextCache[locale] = {
          reading,
          fallback: source === 'fallback',
        }
        setMysticalCache((prev) => ({ ...prev, ...nextCache }))
        setMysticalReading(reading)
        setUsedFallback(source === 'fallback')
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ui.readingFail
        if (isStaleJourneyError(message)) {
          clearJourneySession()
        }
        const fallback = book.generateMysticalReading(
          assessment!.dimensions,
          assessment!.psychologyProfile,
        )
        setMysticalReading(fallback)
        setUsedFallback(true)
        setReadingError(message)
        setMysticalCache((prev) => ({
          ...prev,
          [locale]: { reading: fallback, fallback: true },
        }))
        if (assessmentId && !isStaleJourneyError(message)) {
          void saveFallbackReading(assessmentId, fallback, locale)
        }
      } finally {
        if (!cancelled) setLoadingReading(false)
      }
    }

    void loadReading()

    return () => {
      cancelled = true
    }
  }, [assessment, assessmentId, book, locale, pageIndex, questionCount, savedSession, saveError, ui])

  const scheduleFlip = useCallback(
    (direction: 'next' | 'prev', target: number, delay = AUTO_FLIP_MS) => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current)
      }
      setIsAdvancing(true)
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        const flipped = runFlip(direction, target)
        if (!flipped) setIsAdvancing(false)
      }, delay)
    },
    [runFlip],
  )

  const selectCard = useCallback(
    (questionId: string, cardId: string) => {
      if (readOnly || flipping || isAdvancing || !isQuestionSpread) return

      const qIndex = pageIndex
      const nextAnswers = { ...answers, [questionId]: [cardId] }
      setAnswers(nextAnswers)

      if (qIndex < questionCount - 1) {
        scheduleFlip('next', qIndex + 1)
        return
      }

      const result = computeResults(nextAnswers, questions, book)
      setAssessment(result)
      onAssessmentDone(result)

      void (async () => {
        const { journeyId } = getJourneySession()
        if (!journeyId) {
          setSaveError(ui.saveFailNoSession)
          setExitRiteOpen(true)
          return
        }

        try {
          setSaveError(null)
          const saved = await saveBookAssessmentWithAnswers(
            journeyId,
            book.meta.id,
            locale,
            result,
            book.buildPsychologyPromptInput(result.dimensions),
            nextAnswers,
          )
          setAssessmentId(saved.id)
          setAssessmentsCompleted(saved.assessmentsCompleted)
          if (saved.journeyStatus === 'completed') {
            setJourneyComplete(true)
            void fetchHolisticReading(journeyId, locale)
              .then(() => onJourneyPersisted?.())
              .catch(() => onJourneyPersisted?.())
          } else {
            void onJourneyPersisted?.()
          }
        } catch (error) {
          setAssessmentId(null)
          const message =
            error instanceof Error ? error.message : ui.saveFail
          if (isStaleJourneyError(message)) {
            clearJourneySession()
          }
          setSaveError(message)
        }
        setExitRiteOpen(true)
      })()
    },
    [
      answers,
      book,
      flipping,
      isAdvancing,
      isQuestionSpread,
      onAssessmentDone,
      pageIndex,
      questionCount,
      questions,
      locale,
      onJourneyPersisted,
      readOnly,
      scheduleFlip,
    ],
  )

  const handleExitRiteComplete = useCallback(() => {
    setExitRiteOpen(false)
    scheduleFlip('next', questionCount)
  }, [questionCount, scheduleFlip])

  const buildQuestionLeft = useCallback(
    (index: number) => {
      const q = questions[index]
      const subtitle = q.type === 'dimension' ? q.title : ui.dialogueCheck
      const mystical = getQuestionGuide(book.meta.id, q.id, locale)
      return (
        <>
          <p className="book-chapter-tag">{subtitle}</p>
          <div className="book-question-mystical">
            <p className="book-question-rite">{mystical.rite}</p>
            <p className="book-question-guide">{mystical.guide}</p>
            <p className="book-question-note">{mystical.note}</p>
          </div>
          <div className="book-question-divider" aria-hidden />
          <QuestionSealReveal
            key={q.id}
            mark={ui.sealMark}
            label={ui.scenarioLabel}
            prompt={q.prompt}
            hint={ui.sealRevealHint}
            ariaLabel={ui.sealRevealAria}
          />
          <p className="book-page-hint book-page-hint--action">
            {readOnly
              ? ui.reviewModeHint
              : q.type === 'attention'
                ? ui.attentionHint
                : book.meta.id === 'flow-balance'
                  ? `${ui.questionHint} ${ui.flowBalanceFlowNote}`
                  : ui.questionHint}
          </p>
          <div className="book-page-footer-note">
            <span>{formatPageLabel(index + 1, questionCount, locale)}</span>
          </div>
        </>
      )
    },
    [book.meta.id, locale, questionCount, questions, readOnly, ui],
  )

  const buildQuestionRight = useCallback(
    (index: number, interactive: boolean) => {
      const q = questions[index]
      const ids = answers[q.id] ?? []
      const pageCards: CardOption[] =
        q.type === 'dimension' ? q.cards : getAttentionCheckCards(q, book)
      const locked = readOnly || !interactive || flipping || isAdvancing

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 flex-1 content-start">
          {pageCards.map((card) => (
            <QuestionCard
              key={card.id}
              card={card}
              variant="dark"
              compact
              selected={ids.includes(card.id)}
              disabled={locked}
              onToggle={() => selectCard(q.id, card.id)}
            />
          ))}
        </div>
      )
    },
    [answers, flipping, isAdvancing, questions, readOnly, selectCard],
  )

  const buildResultLeft = useCallback(
    (rIndex: number) => {
      if (rIndex === 0) {
        return (
          <>
            <p className="book-chapter-tag">{labels.psychologyTag}</p>
            <h2 className="book-page-title">
              {labels.psychologyTitle}
            </h2>
            <p className="book-page-hint">{labels.psychologyHint}</p>
            {book.meta.hasAttentionChecks &&
              assessment &&
              !assessment.attentionPassed && (
                <p className="book-attention-note mt-4">{ui.attentionNote}</p>
              )}
            {saveError && (
              <p className="book-attention-note mt-4" role="alert">
                {saveError}
              </p>
            )}
          </>
        )
      }
      if (rIndex === 1) {
        return (
          <>
            <p className="book-chapter-tag">{labels.mysticalTag}</p>
            <h2 className="book-page-title">
              {labels.mysticalTitle}
            </h2>
            <p className="book-page-hint">{labels.mysticalHint}</p>
            <p className="book-page-hint mt-2 opacity-80">{ui.oracleContemplationNote}</p>
            <p className="book-page-hint mt-3 opacity-70">{ui.facetOfWhole}</p>
          </>
        )
      }
      if (rIndex === 2) {
        return (
          <>
            <p className="book-chapter-tag">{ui.chapterClose}</p>
            <h2 className="book-page-title">{ui.chapterCloseTitle}</h2>
            <p className="book-page-hint">
              {journeyComplete
                ? ui.holisticOnShelfHint
                : ui.journeyProgress(assessmentsCompleted, 6)}
            </p>
            {!journeyComplete && (
              <p className="book-page-hint mt-2 opacity-75">{labels.closingHint}</p>
            )}
          </>
        )
      }
      return null
    },
    [
      assessment,
      assessmentsCompleted,
      book.meta.hasAttentionChecks,
      journeyComplete,
      labels,
      saveError,
      ui,
    ],
  )

  const buildResultRight = useCallback(
    (rIndex: number) => {
      if (!assessment) {
        return (
          <div className="book-loading">
            <div className="book-loading-spinner" />
          </div>
        )
      }
      if (rIndex === 0) {
        return (
          <div className="book-scroll-content">
            <p className="book-body-text whitespace-pre-line">
              {assessment.psychologyProfile}
            </p>
          </div>
        )
      }
      if (rIndex === 1) {
        return (
          <div className="book-scroll-content">
            {loadingReading ? (
              <div className="book-loading">
                <div className="book-loading-spinner" />
                <p className="book-page-hint italic">{ui.loadingReading}</p>
              </div>
            ) : (
              <>
                {usedFallback && (
                  <>
                    <p className="book-attention-note mb-4">{ui.readingFallback}</p>
                    {readingError && (
                      <p className="book-attention-note mb-4 opacity-75">{readingError}</p>
                    )}
                  </>
                )}
                <p className="book-body-text italic whitespace-pre-line">
                  {mysticalReading}
                </p>
              </>
            )}
          </div>
        )
      }
      if (rIndex === 2) {
        return (
          <div className="book-scroll-content flex flex-col items-center justify-center min-h-[280px] gap-6">
            <p className="book-body-text text-center">
              {journeyComplete ? ui.holisticOnShelfBody : ui.closingBodyPartial}
            </p>
            <p className="book-body-text text-center text-sm opacity-80 italic">
              {ui.closingBody}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="book-nav-btn book-nav-btn-primary"
            >
              {ui.backToShore}
            </button>
          </div>
        )
      }
      return null
    },
    [
      assessment,
      journeyComplete,
      loadingReading,
      mysticalReading,
      onClose,
      readingError,
      ui,
      usedFallback,
    ],
  )

  const buildLeft = useCallback(
    (index: number) => {
      if (index < questionCount) return buildQuestionLeft(index)
      return buildResultLeft(index - questionCount)
    },
    [buildQuestionLeft, buildResultLeft, questionCount],
  )

  const buildRight = useCallback(
    (index: number, interactive: boolean) => {
      if (index < questionCount) return buildQuestionRight(index, interactive)
      return buildResultRight(index - questionCount)
    },
    [buildQuestionRight, buildResultRight, questionCount],
  )

  const handleBack = () => {
    if (pageIndex === 0 || flipping || isAdvancing) return
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
      setIsAdvancing(false)
    }
    runFlip('prev', pageIndex - 1)
  }

  const handleNext = () => {
    if (pageIndex >= totalSpreads - 1 || flipping || isAdvancing) return
    if (pageIndex >= questionCount + 1 && loadingReading) {
      return
    }
    runFlip('next', pageIndex + 1)
  }

  const completedDimensions = questions
    .slice(0, Math.min(pageIndex + 1, questionCount))
    .filter(
      (q) => q.type === 'dimension' && (answers[q.id]?.length ?? 0) > 0,
    ).length

  const chapterLabel = isQuestionSpread
    ? questions[pageIndex].type === 'dimension'
      ? ui.memorySpread(
          Math.min(completedDimensions, book.meta.dimensionCount),
          book.meta.dimensionCount,
        )
      : undefined
    : book.resultChapterLabels[resultPageIndex]

  const displayPageNumber =
    flipping && pendingIndex !== null ? pendingIndex + 1 : pageIndex + 1

  const displayTotal = totalSpreads

  const incomingSpread =
    pendingIndex !== null
      ? {
          left: buildLeft(pendingIndex),
          right: buildRight(pendingIndex, false),
        }
      : undefined

  const treeStage = isQuestionSpread
    ? treeRevealStage
    : book.meta.treeProgressMax

  return (
    <div className="book-reader-stack">
      <header className="book-reader-header">
        <button
          type="button"
          onClick={onClose}
          disabled={flipping || isAdvancing}
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
      <VolumeRiteOverlay
        open={!readOnly && !entryRiteComplete}
        locale={locale}
        bookId={book.meta.id}
        mode="entry"
        onComplete={() => setEntryRiteComplete(true)}
      />
      <VolumeRiteOverlay
        open={exitRiteOpen}
        locale={locale}
        bookId={book.meta.id}
        mode="exit"
        onComplete={handleExitRiteComplete}
      />
      <TreeProgress revealStage={treeStage} bookId={book.meta.id} locale={locale} />
      <BookShell
        left={buildLeft(pageIndex)}
        right={buildRight(
          pageIndex,
          isQuestionSpread && !flipping && !isAdvancing && !readOnly,
        )}
        incomingLeft={incomingSpread?.left}
        incomingRight={incomingSpread?.right}
        pageNumber={displayPageNumber}
        totalPages={displayTotal}
        chapterLabel={chapterLabel}
        flipping={flipping}
        flipDirection={flipDirection}
        flipSerial={flipSerial}
        enterAnimation={enterFromCover}
        onFlipComplete={completeFlip}
        locale={locale}
        coverArtId={book.meta.id}
        footer={
          isQuestionSpread ? (
            readOnly ? (
              <BookNav
                onBack={handleBack}
                onNext={handleNext}
                backDisabled={pageIndex === 0 || flipping || isAdvancing}
                nextDisabled={
                  flipping || isAdvancing || pageIndex >= totalSpreads - 1
                }
                backLabel={ui.prevPage}
                nextLabel={ui.nextPage}
                selectOneHint={ui.reviewModeHint}
              />
            ) : (
              <BookNav
                onBack={handleBack}
                backDisabled={pageIndex === 0 || flipping || isAdvancing}
                backLabel={ui.prevPage}
                selectOneHint={ui.selectOneHint}
                showNext={false}
              />
            )
          ) : resultPageIndex < RESULT_PAGES - 1 ? (
            <BookNav
              onBack={handleBack}
              onNext={handleNext}
              backDisabled={pageIndex === 0 || flipping || isAdvancing}
              nextDisabled={
                flipping ||
                isAdvancing ||
                (pageIndex === questionCount + 1 && loadingReading)
              }
              backLabel={ui.prevPage}
              nextLabel={ui.nextPage}
            />
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => runFlip('prev', pageIndex - 1)}
                disabled={flipping || isAdvancing}
                className="book-nav-btn book-nav-btn-ghost disabled:opacity-30"
              >
                {ui.backToLabel(labels.mysticalTitle)}
              </button>
            </div>
          )
        }
      />
    </div>
  )
}
