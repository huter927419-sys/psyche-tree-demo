import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssessmentResult, CardOption } from '../../types'
import type { BookDefinition } from '../../books/types'
import { computeResults, getAttentionCheckCards } from '../../data/scoring'
import { QuestionCard } from '../QuestionCard'
import { BookShell, BookNav } from './BookShell'
import { formatPageLabel } from './bookUtils'
import { useBookFlip } from './useBookFlip'
import { TreeProgress } from '../tree/TreeProgress'

const AUTO_FLIP_MS = 420

interface BookQuestionFlowProps {
  book: BookDefinition
  onComplete: (result: AssessmentResult) => void
  onProgressChange?: (
    currentIndex: number,
    answers: Record<string, string[]>,
  ) => void
  treeRevealStage?: number
  enterFromCover?: boolean
}

export function BookQuestionFlow({
  book,
  onComplete,
  onProgressChange,
  treeRevealStage = 0,
  enterFromCover = false,
}: BookQuestionFlowProps) {
  const { questions } = book
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isAdvancing, setIsAdvancing] = useState(false)
  const advanceTimer = useRef<number | null>(null)

  const { flipping, flipDirection, pendingIndex, runFlip, completeFlip } =
    useBookFlip(setCurrentIndex)

  const question = questions[currentIndex]
  const totalPages = questions.length

  useEffect(() => {
    onProgressChange?.(currentIndex, answers)
  }, [currentIndex, answers, onProgressChange])

  useEffect(
    () => () => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current)
      }
    },
    [],
  )

  const scheduleAdvance = useCallback(
    (nextAnswers: Record<string, string[]>, fromIndex: number) => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current)
      }

      setIsAdvancing(true)
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        if (fromIndex < questions.length - 1) {
          const flipped = runFlip('next', fromIndex + 1)
          if (!flipped) setIsAdvancing(false)
        } else {
          onComplete(computeResults(nextAnswers, questions, book))
        }
      }, AUTO_FLIP_MS)
    },
    [book, onComplete, questions, runFlip],
  )

  useEffect(() => {
    if (!flipping && isAdvancing) {
      setIsAdvancing(false)
    }
  }, [flipping, isAdvancing])

  const selectCard = useCallback(
    (questionId: string, cardId: string) => {
      if (flipping || isAdvancing) return

      const nextAnswers = { ...answers, [questionId]: [cardId] }
      setAnswers(nextAnswers)
      scheduleAdvance(nextAnswers, currentIndex)
    },
    [answers, currentIndex, flipping, isAdvancing, scheduleAdvance],
  )

  const buildLeft = useCallback(
    (index: number) => {
      const q = questions[index]
      const subtitle = q.type === 'dimension' ? q.title : '对话确认'
      return (
        <>
          <p className="book-chapter-tag">{subtitle}</p>
          <h2 className="book-page-title">
            {q.prompt}
          </h2>
          <p className="book-page-hint mt-6">
            {q.type === 'attention'
              ? '请在右页择一光印，确认你仍与自己同在。'
              : '请在右页择一与你此刻感受共鸣的意象——选定后，记忆将自行翻过。'}
          </p>
          <div className="book-page-footer-note">
            <span>{formatPageLabel(index + 1, totalPages)}</span>
          </div>
        </>
      )
    },
    [questions, totalPages],
  )

  const buildRight = useCallback(
    (index: number, interactive: boolean) => {
      const q = questions[index]
      const ids = answers[q.id] ?? []
      const pageCards: CardOption[] =
        q.type === 'dimension' ? q.cards : getAttentionCheckCards(q, book)
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

  const handleBack = () => {
    if (currentIndex === 0 || flipping || isAdvancing) return
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
      setIsAdvancing(false)
    }
    runFlip('prev', currentIndex - 1)
  }

  const completedDimensions = questions
    .slice(0, currentIndex + 1)
    .filter(
      (q) => q.type === 'dimension' && (answers[q.id]?.length ?? 0) > 0,
    ).length

  const chapterLabel =
    question.type === 'dimension'
      ? `记忆展开 · ${Math.min(completedDimensions, book.meta.dimensionCount)}/${book.meta.dimensionCount}`
      : undefined

  const displayPageNumber =
    flipping && pendingIndex !== null ? pendingIndex + 1 : currentIndex + 1

  const incomingSpread =
    pendingIndex !== null
      ? {
          left: buildLeft(pendingIndex),
          right: buildRight(pendingIndex, false),
        }
      : undefined

  return (
    <>
      <TreeProgress revealStage={treeRevealStage} bookId={book.meta.id} locale="zh" />
      <BookShell
        left={buildLeft(currentIndex)}
        right={buildRight(currentIndex, !flipping && !isAdvancing)}
        incomingLeft={incomingSpread?.left}
        incomingRight={incomingSpread?.right}
        pageNumber={displayPageNumber}
        totalPages={totalPages}
        chapterLabel={chapterLabel}
        flipping={flipping}
        flipDirection={flipDirection}
        enterAnimation={enterFromCover}
        onFlipComplete={completeFlip}
        footer={
          <BookNav
            onBack={handleBack}
            backDisabled={currentIndex === 0 || flipping || isAdvancing}
            backLabel="上一页"
            showNext={false}
          />
        }
      />
    </>
  )
}
