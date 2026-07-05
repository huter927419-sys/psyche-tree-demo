import { useEffect, useState } from 'react'
import type { AssessmentResult } from '../../types'
import type { BookDefinition } from '../../books/types'
import { getBookResultLabels } from '../../books/types'
import { fetchMysticalReading } from '../../services/mysticalReadingApi'
import { BookShell, BookNav } from './BookShell'
import { useBookFlip } from './useBookFlip'

interface BookResultProps {
  book: BookDefinition
  result: AssessmentResult
  onRestart: () => void
}

const RESULT_PAGES = 3

export function BookResult({ book, result, onRestart }: BookResultProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const { flipping, flipDirection, pendingIndex, runFlip, completeFlip } =
    useBookFlip(setPageIndex)

  const promptInput = book.buildPsychologyPromptInput(result.dimensions)
  const labels = getBookResultLabels(book)

  const [mysticalReading, setMysticalReading] = useState(result.mysticalReading)
  const [loading, setLoading] = useState(true)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadReading() {
      setLoading(true)
      setUsedFallback(false)

      try {
        const { reading } = await fetchMysticalReading(
          promptInput,
          book.meta.id,
        )
        if (cancelled) return
        setMysticalReading(reading)
      } catch {
        if (cancelled) return
        setMysticalReading(
          book.generateMysticalReading(
            result.dimensions,
            result.psychologyProfile,
          ),
        )
        setUsedFallback(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadReading()

    return () => {
      cancelled = true
    }
  }, [book, promptInput, result.dimensions, result.psychologyProfile])

  const goNext = () => {
    if (pageIndex >= RESULT_PAGES - 1 || flipping) return
    runFlip('next', pageIndex + 1)
  }

  const goBack = () => {
    if (pageIndex <= 0 || flipping) return
    runFlip('prev', pageIndex - 1)
  }

  const leftPages = [
    <>
      <p className="book-chapter-tag">{labels.psychologyTag}</p>
      <h2 className="book-page-title">
        {labels.psychologyTitle}
      </h2>
      <p className="book-page-hint">{labels.psychologyHint}</p>
      {book.meta.hasAttentionChecks && !result.attentionPassed && (
        <p className="book-attention-note mt-4">
          部分光印未能匹配，以下解读仅供参考。
        </p>
      )}
    </>,
    <>
      <p className="book-chapter-tag">{labels.mysticalTag}</p>
      <h2 className="book-page-title">
        {labels.mysticalTitle}
      </h2>
      <p className="book-page-hint">{labels.mysticalHint}</p>
    </>,
    <>
      <p className="book-chapter-tag">收束</p>
      <h2 className="book-page-title">
        合卷归岸
      </h2>
      <p className="book-page-hint">{labels.closingHint}</p>
      <div className="book-seal mt-8" aria-hidden>
        <span>{book.meta.coverTitle}</span>
      </div>
    </>,
  ]

  const rightPages = [
    <div className="book-scroll-content">
      <p className="book-body-text whitespace-pre-line">{result.psychologyProfile}</p>
    </div>,
    <div className="book-scroll-content">
      {loading ? (
        <div className="book-loading">
          <div className="book-loading-spinner" />
          <p className="book-page-hint italic">光中的文字正在浮现…</p>
        </div>
      ) : (
        <>
          {usedFallback && (
            <p className="book-attention-note mb-4">
              Remote oracle unavailable; showing a local reading instead.
            </p>
          )}
          <p className="book-body-text italic whitespace-pre-line">
            {mysticalReading}
          </p>
        </>
      )}
    </div>,
    <div className="book-scroll-content flex flex-col items-center justify-center min-h-[280px] gap-6">
      <p className="book-body-text text-center">
        树不会催促叶落，雾不会催促散去——你的节奏，自有神圣的时间。
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="book-nav-btn book-nav-btn-primary"
      >
        返回雾岸
      </button>
    </div>,
  ]

  const displayPageNumber =
    flipping && pendingIndex !== null ? pendingIndex + 1 : pageIndex + 1

  const incomingSpread =
    pendingIndex !== null
      ? {
          left: leftPages[pendingIndex],
          right: rightPages[pendingIndex],
        }
      : undefined

  return (
    <BookShell
      left={leftPages[pageIndex]}
      right={rightPages[pageIndex]}
      incomingLeft={incomingSpread?.left}
      incomingRight={incomingSpread?.right}
      pageNumber={displayPageNumber}
      totalPages={RESULT_PAGES}
      chapterLabel={book.resultChapterLabels[pageIndex]}
      flipping={flipping}
      flipDirection={flipDirection}
      onFlipComplete={completeFlip}
      coverArtId={book.meta.id}
      footer={
        pageIndex < RESULT_PAGES - 1 ? (
          <BookNav
            onBack={goBack}
            onNext={goNext}
            backDisabled={pageIndex === 0 || flipping}
            nextDisabled={flipping || (pageIndex === 1 && loading)}
            backLabel="溯息"
            nextLabel="展息"
          />
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => runFlip('prev', RESULT_PAGES - 2)}
              disabled={flipping}
              className="book-nav-btn book-nav-btn-ghost disabled:opacity-30"
            >
              ← 返回{labels.mysticalTitle}
            </button>
          </div>
        )
      }
    />
  )
}
