import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssessmentResult, CardOption } from '../../types'
import { allQuestions } from '../../data/questions'
import { computeResults, getAttentionCheckCards } from '../../data/scoring'
import { QuestionCard } from '../QuestionCard'
import { BookShell, BookNav } from './BookShell'
import { formatPageLabel } from './bookUtils'
import { useBookFlip } from './useBookFlip'
import { TreeProgress } from '../tree/TreeProgress'

const AUTO_FLIP_MS = 420

interface BookQuestionFlowProps {
  onComplete: (result: AssessmentResult) => void
  onProgressChange?: (
    currentIndex: number,
    answers: Record<string, string[]>,
  ) => void
  treeRevealStage?: number
}

export function BookQuestionFlow({
  onComplete,
  onProgressChange,
  treeRevealStage = 0,
}: BookQuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isAdvancing, setIsAdvancing] = useState(false)
  const advanceTimer = useRef<number | null>(null)

  const { flipping, flipDirection, pendingIndex, runFlip } =
    useBookFlip(setCurrentIndex)

  const question = allQuestions[currentIndex]
  const totalPages = allQuestions.length

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
        if (fromIndex < allQuestions.length - 1) {
          const flipped = runFlip('next', fromIndex + 1)
          if (!flipped) setIsAdvancing(false)
        } else {
          onComplete(computeResults(nextAnswers, allQuestions))
        }
      }, AUTO_FLIP_MS)
    },
    [onComplete, runFlip],
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
      const q = allQuestions[index]
      const subtitle = q.type === 'dimension' ? q.title : '对话确认'
      return (
        <>
          <p className="book-chapter-tag">{subtitle}</p>
          <h2
            className="book-page-title"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {q.prompt}
          </h2>
          <p className="book-page-hint mt-6">
            {q.type === 'attention'
              ? '请在右页选择一张卡片，以确认您正与自己对话。'
              : '请在右页选择一张与此刻感受最共鸣的意象——择定后书页将自行翻过。'}
          </p>
          <div className="book-page-footer-note">
            <span>{formatPageLabel(index + 1, totalPages)}</span>
          </div>
        </>
      )
    },
    [totalPages],
  )

  const buildRight = useCallback(
    (index: number, interactive: boolean) => {
      const q = allQuestions[index]
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
              variant="paper"
              compact
              selected={ids.includes(card.id)}
              disabled={locked}
              onToggle={() => selectCard(q.id, card.id)}
            />
          ))}
        </div>
      )
    },
    [answers, flipping, isAdvancing, selectCard],
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

  const completedDimensions = allQuestions
    .slice(0, currentIndex + 1)
    .filter(
      (q) => q.type === 'dimension' && (answers[q.id]?.length ?? 0) > 0,
    ).length

  const chapterLabel =
    question.type === 'dimension'
      ? `生命之树展开 · ${Math.min(completedDimensions, 7)}/7`
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
      <TreeProgress revealStage={treeRevealStage} />
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
