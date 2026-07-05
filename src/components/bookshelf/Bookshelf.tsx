import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import type { BookDefinition } from '../../books/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { LanguageToggle } from '../i18n/LanguageToggle'
import type { GuideShelfState } from '../../books/guide'
import { BookshelfGuideSlot } from './BookshelfGuideSlot'
import { BookshelfHeroProse } from './BookshelfHeroProse'
import { BookshelfUltimateOracle } from './BookshelfUltimateOracle'
import { BookshelfVolumeCover } from './BookshelfVolumeCover'
import type { JourneyDto } from '../../services/journeyApi'

interface BookshelfProps {
  books: BookDefinition[]
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onSelect: (book: BookDefinition) => void
  onOpenGuide: () => void
  guideShelfState: GuideShelfState
  showGuideFirstVisitHint: boolean
  guideVolumeHandoff?: boolean
  completedBookIds?: string[]
  journeySnapshot?: JourneyDto | null
  holisticFlashSignal?: number
  onJourneyUpdated?: () => void
}

function bookshelfSceneClass(locale: Locale): string {
  if (locale === 'en') return ' bookshelf-scene--en'
  if (locale === 'ja') return ' bookshelf-scene--ja'
  if (locale === 'zhTw') return ' bookshelf-scene--zh-tw'
  return ''
}

export function Bookshelf({
  books,
  locale,
  onLocaleChange,
  onSelect,
  onOpenGuide,
  guideShelfState,
  showGuideFirstVisitHint,
  guideVolumeHandoff = false,
  completedBookIds = [],
  journeySnapshot = null,
  holisticFlashSignal = 0,
  onJourneyUpdated,
}: BookshelfProps) {
  const ui = getUi(locale)
  const [beaconActive, setBeaconActive] = useState<Record<number, boolean>>({})

  const handleFacetBeacon = useCallback((index: number, active: boolean) => {
    setBeaconActive((prev) => {
      if (!!prev[index] === active) return prev
      if (!active) {
        const next = { ...prev }
        delete next[index]
        return next
      }
      return { ...prev, [index]: true }
    })
  }, [])

  const handleFacetBeaconReset = useCallback(() => {
    setBeaconActive({})
  }, [])

  useEffect(() => {
    setBeaconActive({})
  }, [locale])

  return (
    <>
    <div
      className={`bookshelf-scene min-h-screen flex flex-col items-center justify-center px-4 py-12${bookshelfSceneClass(locale)}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle
          locale={locale}
          onChange={onLocaleChange}
          label={ui.languageLabel}
        />
      </div>

      <p className="bookshelf-hero-eyebrow animate-fade-in">{ui.shelfEyebrow}</p>
      <h1 className="bookshelf-hero-title animate-fade-in">{ui.shelfTitle}</h1>
      <BookshelfHeroProse
        ui={ui}
        onFacetBeacon={handleFacetBeacon}
        onFacetBeaconReset={handleFacetBeaconReset}
      />

      <BookshelfGuideSlot
        locale={locale}
        shelfState={guideShelfState}
        showFirstVisitHint={showGuideFirstVisitHint}
        onOpen={onOpenGuide}
      />

      <div className="bookshelf-unit w-full max-w-[980px]">
        {guideVolumeHandoff && (
          <p className="bookshelf-volume-handoff-hint animate-fade-in">
            {ui.guideVolumeHandoffHint}
          </p>
        )}
        <div className="bookshelf-row">
          {books.map((book, i) => {
            const completed = completedBookIds.includes(book.meta.id)
            const beacon = beaconActive[i] === true
            const handoff = guideVolumeHandoff && !completed
            return (
            <button
              key={book.meta.id}
              type="button"
              className={`bookshelf-book animate-fade-in${completed ? ' bookshelf-book--completed' : ''}${beacon ? ' bookshelf-book--beacon' : ''}${handoff ? ' bookshelf-book--handoff' : ''} ${book.meta.accent === 'silver' ? 'bookshelf-book-silver' : 'bookshelf-book-gold'}`}
              style={{
                '--fade-in-delay': `${0.15 + i * 0.12}s`,
                '--book-tilt': `${-12 + i * 1.2}deg`,
                '--book-depth': `${4 + i * 1.5}px`,
              } as CSSProperties}
              onClick={() => onSelect(book)}
              aria-label={
                completed
                  ? `${book.meta.coverTitle} · ${ui.shelfCompletedMark}`
                  : book.meta.coverTitle
              }
            >
              {completed && (
                <span className="bookshelf-book-completed-mark">{ui.shelfCompletedMark}</span>
              )}
              <div className="bookshelf-book-glow" aria-hidden />
              <div className="bookshelf-book-volume">
                <div className="bookshelf-book-spine-face" aria-hidden />
                <div
                  className={`bookshelf-book-cover${locale === 'en' ? ' bookshelf-book-cover--en' : ''}`}
                >
                  <div className="bookshelf-book-texture" aria-hidden />
                  <div className="bookshelf-book-cover-sheen" aria-hidden />
                  <BookshelfVolumeCover
                    locale={locale}
                    title={book.meta.coverTitle}
                    subtitle={book.meta.coverSubtitle}
                    tagline={book.meta.coverTagline}
                  />
                </div>
                <div className="bookshelf-book-pages" aria-hidden>
                  <span className="bookshelf-book-pages-edge" aria-hidden />
                </div>
                <div className="bookshelf-book-top-face" aria-hidden />
              </div>
              <div className="bookshelf-book-cast-shadow" aria-hidden />
            </button>
            )
          })}
        </div>
        <div className="bookshelf-mist-platform" aria-hidden />
      </div>

      <BookshelfUltimateOracle
        locale={locale}
        journeySnapshot={journeySnapshot}
        flashSignal={holisticFlashSignal}
        onJourneyUpdated={onJourneyUpdated}
      />

      {journeySnapshot?.status !== 'completed' && (
        <p className="mt-12 text-xs text-[rgba(200,200,200,0.3)] tracking-[0.35em]">
          {completedBookIds.length > 0 && completedBookIds.length < books.length
            ? ui.journeyProgress(completedBookIds.length, books.length)
            : ui.shelfFooter(books.length)}
        </p>
      )}
    </div>
    </>
  )
}
