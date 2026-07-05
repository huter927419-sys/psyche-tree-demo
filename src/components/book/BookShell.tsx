import type { ReactNode } from 'react'
import type { Locale } from '../../i18n/locale'
import { volumeCoverArtId } from '../../books/volumeCovers'
import { getUi } from '../../i18n/ui'
import { BookPageCoverWatermark } from './BookCoverArt'
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
  onFlipComplete?: () => void
  enterAnimation?: boolean
  flipSerial?: number
  locale?: Locale
  /** book id or `guide` — uses public/covers/{id}.png when available */
  coverArtId?: string
  /** Click left/right page to turn (e.g. guide prologue) */
  pageClickEnabled?: boolean
  onPageClick?: (side: 'left' | 'right') => void
  pageTurnPrevLabel?: string
  pageTurnNextLabel?: string
  pageTurnLeftDisabled?: boolean
  pageTurnRightDisabled?: boolean
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
  onFlipComplete,
  enterAnimation = false,
  flipSerial = 0,
  locale = 'zh',
  coverArtId,
  pageClickEnabled = false,
  onPageClick,
  pageTurnPrevLabel,
  pageTurnNextLabel,
  pageTurnLeftDisabled = false,
  pageTurnRightDisabled = false,
}: BookShellProps) {
  const ui = getUi(locale)
  const resolvedCoverId = coverArtId ? volumeCoverArtId(coverArtId) : undefined
  const isFlipping =
    flipping && incomingLeft !== undefined && incomingRight !== undefined

  const spreadPageProps = {
    ghostLabel: ui.ghostMemory,
    coverArtId: resolvedCoverId,
    pageClickEnabled: pageClickEnabled && !isFlipping,
    onPageClick,
    pageTurnPrevLabel,
    pageTurnNextLabel,
    pageTurnLeftDisabled,
    pageTurnRightDisabled,
  }

  const handleTurnAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    const name = e.animationName
    if (
      name === 'page-turn-next' ||
      name === 'page-turn-prev'
    ) {
      onFlipComplete?.()
    }
  }

  return (
    <div
      className={`book-scene px-3 py-4 md:py-7${enterAnimation ? ' book-scene-enter' : ''}`}
    >
      {chapterLabel && (
        <p className="text-center text-[10px] tracking-[0.35em] uppercase text-[rgba(255,255,255,0.45)] mb-4">
          {chapterLabel}
        </p>
      )}

      <div className="book-perspective mx-auto w-full">
        <div
          className={`book-open book-flip-stage${isFlipping ? ' book-flip-stage--active' : ''}`}
        >
          <div className="book-spread-layer book-spread-base">
            {isFlipping ? (
              <SpreadPages
                left={incomingLeft!}
                right={incomingRight!}
                {...spreadPageProps}
                pageClickEnabled={false}
              />
            ) : (
              <SpreadPages left={left} right={right} {...spreadPageProps} />
            )}
          </div>

          {isFlipping && flipDirection === 'next' && (
            <>
              <div className="book-turn-overlay book-turn-overlay-left">
                <BookPage side="left" coverArtId={resolvedCoverId}>{left}</BookPage>
              </div>
              <div
                key={`turn-next-${flipSerial}`}
                className="book-page-turner book-page-turner-next"
                onAnimationEnd={handleTurnAnimationEnd}
              >
                <div className="book-turn-face book-turn-front">
                  <BookPage side="right" coverArtId={resolvedCoverId}>{right}</BookPage>
                </div>
                <div className="book-turn-face book-turn-back">
                  <BookPage side="left" coverArtId={resolvedCoverId}>{incomingLeft}</BookPage>
                </div>
                <div className="book-turn-edge" aria-hidden />
              </div>
            </>
          )}

          {isFlipping && flipDirection === 'prev' && (
            <>
              <div className="book-turn-overlay book-turn-overlay-right">
                <BookPage side="right" coverArtId={resolvedCoverId}>{right}</BookPage>
              </div>
              <div
                key={`turn-prev-${flipSerial}`}
                className="book-page-turner book-page-turner-prev"
                onAnimationEnd={handleTurnAnimationEnd}
              >
                <div className="book-turn-face book-turn-front">
                  <BookPage side="left" coverArtId={resolvedCoverId}>{left}</BookPage>
                </div>
                <div className="book-turn-face book-turn-back">
                  <BookPage side="right" coverArtId={resolvedCoverId}>{incomingRight}</BookPage>
                </div>
                <div className="book-turn-edge book-turn-edge-left" aria-hidden />
              </div>
            </>
          )}
        </div>
        <div className="book-shadow-plate" aria-hidden />
      </div>

      <div className="flex items-center justify-center gap-6 mt-5 text-[11px] tracking-[0.2em] text-[rgba(255,255,255,0.45)]">
        <span className="font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
          {formatPageLabel(pageNumber, totalPages, locale)}
        </span>
      </div>

      {footer && <div className="mt-5 max-w-[var(--book-open-max,780px)] mx-auto">{footer}</div>}
    </div>
  )
}

function SpreadPages({
  left,
  right,
  ghostLabel,
  coverArtId,
  pageClickEnabled = false,
  onPageClick,
  pageTurnPrevLabel,
  pageTurnNextLabel,
  pageTurnLeftDisabled = false,
  pageTurnRightDisabled = false,
}: {
  left: ReactNode
  right: ReactNode
  ghostLabel: string
  coverArtId?: string
  pageClickEnabled?: boolean
  onPageClick?: (side: 'left' | 'right') => void
  pageTurnPrevLabel?: string
  pageTurnNextLabel?: string
  pageTurnLeftDisabled?: boolean
  pageTurnRightDisabled?: boolean
}) {
  return (
    <>
      <BookPage
        side="left"
        ghostLabel={ghostLabel}
        coverArtId={coverArtId}
        interactive={pageClickEnabled && !pageTurnLeftDisabled}
        onActivate={
          pageClickEnabled && !pageTurnLeftDisabled
            ? () => onPageClick?.('left')
            : undefined
        }
        activateLabel={pageTurnPrevLabel}
      >
        {left}
      </BookPage>
      <div className="book-spine" aria-hidden />
      <BookPage
        side="right"
        ghostLabel={ghostLabel}
        coverArtId={coverArtId}
        interactive={pageClickEnabled && !pageTurnRightDisabled}
        onActivate={
          pageClickEnabled && !pageTurnRightDisabled
            ? () => onPageClick?.('right')
            : undefined
        }
        activateLabel={pageTurnNextLabel}
      >
        {right}
      </BookPage>
    </>
  )
}

function BookPage({
  side,
  children,
  back = false,
  ghostLabel = '',
  coverArtId,
  interactive = false,
  onActivate,
  activateLabel,
}: {
  side: 'left' | 'right'
  children: ReactNode
  back?: boolean
  ghostLabel?: string
  coverArtId?: string
  interactive?: boolean
  onActivate?: () => void
  activateLabel?: string
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onActivate) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <div
      className={`book-page book-page-${side}${back ? ' book-page-back' : ''}${coverArtId ? ' book-page--with-cover' : ''}${interactive ? ' book-page--interactive' : ''}`}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? activateLabel : undefined}
    >
      {!back && coverArtId && (
        <BookPageCoverWatermark coverId={coverArtId} side={side} />
      )}
      <div className="book-page-texture" aria-hidden />
      {back ? (
        <div className="book-page-back-content" aria-hidden>
          <div className="book-back-lines" />
          <p className="book-back-ghost">{ghostLabel}</p>
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
  onRestart?: () => void
  backLabel?: string
  nextLabel?: string
  restartLabel?: string
  backDisabled?: boolean
  nextDisabled?: boolean
  restartDisabled?: boolean
  showNext?: boolean
  showRestart?: boolean
  selectOneHint?: string
}

export function BookNav({
  onBack,
  onNext,
  onRestart,
  backLabel = '上一页',
  nextLabel = '翻页',
  restartLabel = '归序首',
  backDisabled,
  nextDisabled,
  restartDisabled,
  showNext = true,
  showRestart = false,
  selectOneHint = '择一即翻页',
}: BookNavProps) {
  return (
    <div className="book-nav-stack">
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
          <span className="text-[10px] tracking-[0.2em] text-[rgba(200,200,200,0.35)]">
            {selectOneHint}
          </span>
        )}
      </div>
      {showRestart && onRestart && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onRestart}
            disabled={restartDisabled}
            className="book-nav-btn book-nav-btn-ghost book-nav-btn-restart disabled:opacity-30"
          >
            {restartLabel}
          </button>
        </div>
      )}
    </div>
  )
}
