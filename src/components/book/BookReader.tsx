import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssessmentResult, CardOption } from '../../types'
import type { BookDefinition } from '../../books/types'
import { getBookResultLabels } from '../../books/types'
import { computeResults, getAttentionCheckCards } from '../../data/scoring'
import { fetchMysticalReading } from '../../services/mysticalReadingApi'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { getQuestionGuide } from '../../i18n/questionGuide'
import { LanguageToggle } from '../i18n/LanguageToggle'
import { QuestionCard } from '../QuestionCard'
import { TreeProgress } from '../tree/TreeProgress'
import { BookShell, BookNav } from './BookShell'
import { BookOpeningGuide } from './BookOpeningGuide'
import { QuestionSealReveal } from './QuestionSealReveal'
import { formatPageLabel } from './bookUtils'
import { useBookFlip } from './useBookFlip'

const AUTO_FLIP_MS = 420
const RESULT_PAGES = 3

interface BookReaderProps {
  book: BookDefinition
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  enterFromCover?: boolean
  treeRevealStage?: number
  onProgressChange?: (
    currentIndex: number,
    answers: Record<string, string[]>,
  ) => void
  onAssessmentDone: (result: AssessmentResult) => void
  onClose: () => void
}

export function BookReader({
  book,
  locale,
  onLocaleChange,
  enterFromCover = false,
  treeRevealStage = 0,
  onProgressChange,
  onAssessmentDone,
  onClose,
}: BookReaderProps) {
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
  const [readingError, setReadingError] = useState<string | null>(null)
  const [readingModel, setReadingModel] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

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
    if (!assessment || pageIndex < questionCount) return

    let cancelled = false
    const promptInput = book.buildPsychologyPromptInput(assessment.dimensions)

    async function loadReading() {
      setLoadingReading(true)
      setReadingError(null)
      setUsedFallback(false)

      try {
        const { reading, model } = await fetchMysticalReading(
          promptInput,
          book.meta.id,
          locale,
        )
        if (cancelled) return
        setMysticalReading(reading)
        setReadingModel(model ?? null)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : ui.deepSeekFail
        setReadingError(message)
        setMysticalReading(
          book.generateMysticalReading(
            assessment!.dimensions,
            assessment!.psychologyProfile,
          ),
        )
        setUsedFallback(true)
      } finally {
        if (!cancelled) setLoadingReading(false)
      }
    }

    void loadReading()

    return () => {
      cancelled = true
    }
  }, [assessment, book, locale, pageIndex, questionCount, ui.deepSeekFail])

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
      if (flipping || isAdvancing || !isQuestionSpread) return

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
      scheduleFlip('next', questionCount)
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
      scheduleFlip,
    ],
  )

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
            {q.type === 'attention' ? ui.attentionHint : ui.questionHint}
          </p>
          <div className="book-page-footer-note">
            <span>{formatPageLabel(index + 1, questionCount, locale)}</span>
          </div>
        </>
      )
    },
    [book.meta.id, locale, questionCount, questions, ui],
  )

  const buildQuestionRight = useCallback(
    (index: number, interactive: boolean) => {
      const q = questions[index]
      const ids = answers[q.id] ?? []
      const pageCards: CardOption[] =
        q.type === 'dimension' ? q.cards : getAttentionCheckCards(q)
      const locked = !interactive || flipping || isAdvancing

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
    [answers, flipping, isAdvancing, questions, selectCard],
  )

  const buildResultLeft = useCallback(
    (rIndex: number) => {
      if (rIndex === 0) {
        return (
          <>
            <p className="book-chapter-tag">{labels.psychologyTag}</p>
            <h2
              className="book-page-title"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {labels.psychologyTitle}
            </h2>
            <p className="book-page-hint">{labels.psychologyHint}</p>
            {book.meta.hasAttentionChecks &&
              assessment &&
              !assessment.attentionPassed && (
                <p className="book-attention-note mt-4">{ui.attentionNote}</p>
              )}
          </>
        )
      }
      if (rIndex === 1) {
        return (
          <>
            <p className="book-chapter-tag">{labels.mysticalTag}</p>
            <h2
              className="book-page-title"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {labels.mysticalTitle}
            </h2>
            <p className="book-page-hint">{labels.mysticalHint}</p>
            {readingModel && !loadingReading && !usedFallback && (
              <p className="book-meta-tag mt-4">DeepSeek · {readingModel}</p>
            )}
          </>
        )
      }
      return (
        <>
          <p className="book-chapter-tag">{ui.chapterClose}</p>
          <h2
            className="book-page-title"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {ui.chapterCloseTitle}
          </h2>
          <p className="book-page-hint">{labels.closingHint}</p>
          <div className="book-seal mt-8" aria-hidden>
            <span>{book.meta.coverTitle}</span>
          </div>
        </>
      )
    },
    [
      assessment,
      book.meta.hasAttentionChecks,
      book.meta.id,
      labels,
      ui,
      loadingReading,
      readingModel,
      usedFallback,
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
                {usedFallback && readingError && (
                  <p className="book-attention-note mb-4">{ui.deepSeekFallback}</p>
                )}
                <p className="book-body-text italic whitespace-pre-line">
                  {mysticalReading}
                </p>
              </>
            )}
          </div>
        )
      }
      return (
        <div className="book-scroll-content flex flex-col items-center justify-center min-h-[280px] gap-6">
          <p className="book-body-text text-center">{ui.closingBody}</p>
          <button
            type="button"
            onClick={onClose}
            className="book-nav-btn book-nav-btn-primary"
          >
            {ui.backToShore}
          </button>
        </div>
      )
    },
    [
      assessment,
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
    if (
      pageIndex >= questionCount + 1 &&
      loadingReading
    ) {
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
    <>
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
      <BookOpeningGuide bookId={book.meta.id} locale={locale} />
      <TreeProgress revealStage={treeStage} bookId={book.meta.id} locale={locale} />
      <BookShell
        left={buildLeft(pageIndex)}
        right={buildRight(pageIndex, isQuestionSpread && !flipping && !isAdvancing)}
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
        footer={
          isQuestionSpread ? (
            <BookNav
              onBack={handleBack}
              backDisabled={pageIndex === 0 || flipping || isAdvancing}
              backLabel={ui.prevPage}
              selectOneHint={ui.selectOneHint}
              showNext={false}
            />
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
    </>
  )
}
