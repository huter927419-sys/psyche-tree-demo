import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getGuideSpreadIndex,
  getLocalizedGuideContent,
  markGuideCompleted,
  saveGuideSpreadIndex,
} from '../../books/guide'
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
  enterFromCover?: boolean
}

export function GuideReader({
  locale,
  onLocaleChange,
  onClose,
  onCompleted,
  enterFromCover = false,
}: GuideReaderProps) {
  const ui = getUi(locale)
  const guide = useMemo(() => getLocalizedGuideContent(locale), [locale])
  const totalSpreads = guide.spreads.length
  const [pageIndex, setPageIndex] = useState(() =>
    Math.min(getGuideSpreadIndex(), totalSpreads - 1),
  )

  useEffect(() => {
    setPageIndex(Math.min(getGuideSpreadIndex(), totalSpreads - 1))
  }, [locale, totalSpreads])

  const handleIndexChange = useCallback((index: number) => {
    setPageIndex(index)
    saveGuideSpreadIndex(index)
  }, [])

  const { flipping, flipDirection, pendingIndex, flipSerial, runFlip, completeFlip } =
    useBookFlip(handleIndexChange)

  const isEnterSpread = pageIndex === guide.enterSpreadIndex
  const isLastSpread = pageIndex >= totalSpreads - 1

  const scheduleFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSpreads) return
      runFlip(direction, targetIndex)
    },
    [runFlip, totalSpreads],
  )

  const handleBack = useCallback(() => {
    if (flipping || pageIndex === 0) return
    scheduleFlip('prev', pageIndex - 1)
  }, [flipping, pageIndex, scheduleFlip])

  const handleNext = useCallback(() => {
    if (flipping || isLastSpread) return
    scheduleFlip('next', pageIndex + 1)
  }, [flipping, isLastSpread, pageIndex, scheduleFlip])

  const handleEnterShore = useCallback(() => {
    markGuideCompleted()
    onCompleted?.()
    onClose()
  }, [onClose, onCompleted])

  const buildSpread = useCallback(
    (index: number) => {
      const spread = guide.spreads[index]
      return {
        left: <GuidePageContent blocks={spread.left} locale={locale} />,
        right: <GuidePageContent blocks={spread.right} locale={locale} />,
      }
    },
    [guide.spreads, locale],
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

  return (
    <div className="book-reader-stack">
      <header className="book-reader-header">
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
        enterAnimation={enterFromCover}
        onFlipComplete={completeFlip}
        locale={locale}
        coverArtId="guide"
        footer={
          isEnterSpread ? (
            <div className="flex flex-col gap-4">
              <BookNav
                onBack={handleBack}
                backDisabled={pageIndex === 0 || flipping}
                backLabel={ui.prevPage}
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
            <BookNav
              onBack={handleBack}
              onNext={handleNext}
              backDisabled={pageIndex === 0 || flipping}
              nextDisabled={flipping || isLastSpread}
              backLabel={ui.prevPage}
              nextLabel={ui.nextPage}
            />
          )
        }
      />
    </div>
  )
}
