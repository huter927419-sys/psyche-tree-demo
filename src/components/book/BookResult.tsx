import { useEffect, useState } from 'react'
import type { AssessmentResult } from '../../types'
import { buildPsychologyPromptInput } from '../../data/psychologyProfile'
import { buildMysticalPrompt, generateMysticalReading } from '../../data/mysticalReading'
import { fetchMysticalReading } from '../../services/mysticalReadingApi'
import { BookShell, BookNav } from './BookShell'
import { useBookFlip } from './useBookFlip'

interface BookResultProps {
  result: AssessmentResult
  onRestart: () => void
}

const RESULT_PAGES = 3

export function BookResult({ result, onRestart }: BookResultProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const { flipping, flipDirection, pendingIndex, runFlip } =
    useBookFlip(setPageIndex)

  const promptInput = buildPsychologyPromptInput(result.dimensions)
  const llmPrompt = buildMysticalPrompt(promptInput)

  const [mysticalReading, setMysticalReading] = useState(result.mysticalReading)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadReading() {
      setLoading(true)
      setError(null)
      setUsedFallback(false)

      try {
        const { reading, model: usedModel } =
          await fetchMysticalReading(promptInput)
        if (cancelled) return
        setMysticalReading(reading)
        setModel(usedModel ?? null)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : 'DeepSeek 解读生成失败'
        setError(message)
        setMysticalReading(
          generateMysticalReading(result.dimensions, result.psychologyProfile),
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
  }, [promptInput, result.dimensions, result.psychologyProfile])

  const goNext = () => {
    if (pageIndex >= RESULT_PAGES - 1 || flipping) return
    runFlip('next', pageIndex + 1)
  }

  const goBack = () => {
    if (pageIndex <= 0 || flipping) return
    runFlip('prev', pageIndex - 1)
  }

  const chapterLabels = [
    '终章 · 心象画像',
    '终章 · 神谕之页',
    '封底 · 合书',
  ]

  const leftPages = [
    <>
      <p className="book-chapter-tag">心理学底层</p>
      <h2 className="book-page-title" style={{ fontFamily: 'var(--font-serif)' }}>
        心象画像
      </h2>
      <p className="book-page-hint">
        客观照见——不含评判，只是当前内在状态的一页记录。
      </p>
      {!result.attentionPassed && (
        <p className="book-attention-note mt-4">
          部分对话确认未能匹配，以下解读仅供参考。
        </p>
      )}
    </>,
    <>
      <p className="book-chapter-tag">玄学象征</p>
      <h2 className="book-page-title" style={{ fontFamily: 'var(--font-serif)' }}>
        神谕之页
      </h2>
      <p className="book-page-hint">
        如古老智慧在低语，描述生命能量的流动与状态。
      </p>
      {model && !loading && !usedFallback && (
        <p className="book-meta-tag mt-4">DeepSeek · {model}</p>
      )}
    </>,
    <>
      <p className="book-chapter-tag">收束</p>
      <h2 className="book-page-title" style={{ fontFamily: 'var(--font-serif)' }}>
        合书
      </h2>
      <p className="book-page-hint">
        本次探索已写入生命之书。愿您继续以温柔的方式与自己对话。
      </p>
      <div className="book-seal mt-8" aria-hidden>
        <span>心象</span>
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
          <p className="book-page-hint italic">神谕正在书写…</p>
        </div>
      ) : (
        <>
          {usedFallback && error && (
            <p className="book-attention-note mb-4">
              DeepSeek 暂不可用，已使用本地模板。
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
        树不会催促叶落，书不会催促合卷——您的节奏，自有神圣的时间。
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="book-nav-btn book-nav-btn-primary"
      >
        重新揭开生命之书
      </button>
      <details className="w-full mt-4">
        <summary className="book-meta-tag cursor-pointer text-center list-none">
          查看 DeepSeek 提示词
        </summary>
        <pre className="book-prompt-block mt-3">{llmPrompt}</pre>
      </details>
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
      chapterLabel={chapterLabels[pageIndex]}
      flipping={flipping}
      flipDirection={flipDirection}
      footer={
        pageIndex < RESULT_PAGES - 1 ? (
          <BookNav
            onBack={goBack}
            onNext={goNext}
            backDisabled={pageIndex === 0 || flipping}
            nextDisabled={flipping || (pageIndex === 1 && loading)}
            backLabel="上一页"
            nextLabel="翻页"
          />
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => runFlip('prev', RESULT_PAGES - 2)}
              disabled={flipping}
              className="book-nav-btn book-nav-btn-ghost disabled:opacity-30"
            >
              ← 返回神谕之页
            </button>
          </div>
        )
      }
    />
  )
}
