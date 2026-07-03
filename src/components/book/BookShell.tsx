import type { ReactNode } from 'react'
import { formatPageLabel } from './bookUtils'

interface BookShellProps {
  left: ReactNode
  right: ReactNode
  incomingLeft?: ReactNode
  incomingRight?: ReactNode
  pageNumber: number
  totalPages: number
  footer?: ReactNode
  flipping?: boolean
  flipDirection?: 'next' | 'prev'
  chapterLabel?: string
}

export function BookShell({
  left,
  right,
  incomingLeft,
  incomingRight,
  pageNumber,
  totalPages,
  footer,
  flipping = false,
  flipDirection = 'next',
  chapterLabel,
}: BookShellProps) {
  const isFlipping =
    flipping && incomingLeft !== undefined && incomingRight !== undefined

  return (
    <div className="book-scene animate-fade-in px-3 py-6 md:py-10">
      {chapterLabel && (
        <p className="text-center text-[10px] tracking-[0.35em] uppercase text-[rgba(212,175,122,0.45)] mb-4">
          {chapterLabel}
        </p>
      )}

      <div className="book-perspective mx-auto max-w-[920px]">
        <div className="book-open book-flip-stage">
          {/* Base spread — incoming while flipping, current when idle */}
          <div className="book-spread-layer book-spread-base">
            {isFlipping ? (
              <SpreadPages left={incomingLeft!} right={incomingRight!} />
            ) : (
              <SpreadPages left={left} right={right} />
            )}
          </div>

          {/* 3D turning page overlay */}
          {isFlipping && flipDirection === 'next' && (
            <>
              <div className="book-turn-overlay book-turn-overlay-left">
                <BookPage side="left">{left}</BookPage>
              </div>
              <div className="book-page-turner book-page-turner-next">
                <div className="book-turn-face book-turn-front">
                  <BookPage side="right">{right}</BookPage>
                </div>
                <div className="book-turn-face book-turn-back">
                  <BookPage side="left" back>{null}</BookPage>
                </div>
                <div className="book-turn-edge" aria-hidden />
              </div>
            </>
          )}

          {isFlipping && flipDirection === 'prev' && (
            <>
              <div className="book-turn-overlay book-turn-overlay-right">
                <BookPage side="right">{right}</BookPage>
              </div>
              <div className="book-page-turner book-page-turner-prev">
                <div className="book-turn-face book-turn-front">
                  <BookPage side="left">{left}</BookPage>
                </div>
                <div className="book-turn-face book-turn-back">
                  <BookPage side="right" back>{null}</BookPage>
                </div>
                <div className="book-turn-edge book-turn-edge-left" aria-hidden />
              </div>
            </>
          )}
        </div>
        <div className="book-shadow-plate" aria-hidden />
      </div>

      <div className="flex items-center justify-center gap-6 mt-5 text-[11px] tracking-[0.2em] text-[rgba(212,175,122,0.45)]">
        <span className="font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
          {formatPageLabel(pageNumber, totalPages)}
        </span>
      </div>

      {footer && <div className="mt-6 max-w-[920px] mx-auto">{footer}</div>}
    </div>
  )
}

function SpreadPages({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <>
      <BookPage side="left">{left}</BookPage>
      <div className="book-spine" aria-hidden />
      <BookPage side="right">{right}</BookPage>
    </>
  )
}

function BookPage({
  side,
  children,
  back = false,
}: {
  side: 'left' | 'right'
  children: ReactNode
  back?: boolean
}) {
  return (
    <div
      className={`book-page book-page-${side}${back ? ' book-page-back' : ''}`}
    >
      <div className="book-page-texture" aria-hidden />
      {back ? (
        <div className="book-page-back-content" aria-hidden>
          <div className="book-back-lines" />
          <p className="book-back-ghost">生命之书</p>
        </div>
      ) : (
        <div className="book-page-inner">{children}</div>
      )}
      <div className={`book-page-edge book-page-edge-${side}`} aria-hidden />
    </div>
  )
}

interface BookNavProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  backDisabled?: boolean
  nextDisabled?: boolean
  showNext?: boolean
}

export function BookNav({
  onBack,
  onNext,
  backLabel = '上一页',
  nextLabel = '翻页',
  backDisabled,
  nextDisabled,
  showNext = true,
}: BookNavProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className="book-nav-btn book-nav-btn-ghost disabled:opacity-30"
      >
        ← {backLabel}
      </button>
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="book-nav-btn book-nav-btn-primary disabled:opacity-30"
        >
          {nextLabel} →
        </button>
      ) : (
        <span className="text-[10px] tracking-[0.2em] text-[rgba(42,37,32,0.35)]">
          择一即翻页
        </span>
      )}
    </div>
  )
}
