import { useEffect, useMemo, useRef, useState } from 'react'
import type { AssessmentResult } from './types'
import type { BookDefinition, BookId } from './books/types'
import { getBook, getBooks } from './books/registry'
import {
  TreeOfLifeBackground,
  countCompletedDimensions,
} from './components/TreeOfLifeBackground'
import { BookCover } from './components/book/BookCover'
import { BookClosedVisual } from './components/book/BookClosedVisual'
import {
  BookJourneyStage,
  type BookJourneyMode,
} from './components/book/BookJourneyStage'
import { BookReader } from './components/book/BookReader'
import { Bookshelf } from './components/bookshelf/Bookshelf'
import { AmbientPhraseLayer } from './components/i18n/AmbientPhraseLayer'
import { TreeAwakeningOverlay } from './components/tree/TreeAwakeningOverlay'
import { AmbientMusicControl } from './components/AmbientMusicControl'
import { SkyAtmosphere } from './components/SkyAtmosphere'
import { useVisualTier, type VisualTier } from './hooks/useVisualTier'
import { LocaleContext, type Locale } from './i18n/locale'
import { getUi } from './i18n/ui'

type AppPhase = 'shelf' | 'cover' | 'questions'

const BOOK_PICKUP_MS = 900
const BOOK_EXPAND_MS = 1400
const BOOK_CLOSE_MS = 1500

function App() {
  const [phase, setPhase] = useState<AppPhase>('shelf')
  const [locale, setLocale] = useState<Locale>('zh')
  const [activeBookId, setActiveBookId] = useState<BookId | null>(null)
  const activeBook = useMemo(
    () => (activeBookId ? getBook(activeBookId, locale) : null),
    [activeBookId, locale],
  )
  const ui = getUi(locale)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [treeRevealStage, setTreeRevealStage] = useState(0)
  const [coverOpening, setCoverOpening] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [journeyMode, setJourneyMode] = useState<BookJourneyMode>('compact')
  const [awakeningStage, setAwakeningStage] = useState<number | null>(null)
  const [treeRecoilKey, setTreeRecoilKey] = useState(0)
  const [musicBootstrap, setMusicBootstrap] = useState(0)
  const prevTreeStage = useRef(0)
  const pickupTimer = useRef<number | null>(null)
  const transitionTimer = useRef<number | null>(null)

  const clearTransitionTimers = () => {
    if (pickupTimer.current !== null) {
      window.clearTimeout(pickupTimer.current)
      pickupTimer.current = null
    }
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current)
      transitionTimer.current = null
    }
  }

  useEffect(() => () => clearTransitionTimers(), [])

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  useEffect(() => {
    if (phase !== 'questions') {
      prevTreeStage.current = treeRevealStage
      return
    }
    if (treeRevealStage > prevTreeStage.current && treeRevealStage > 0) {
      setAwakeningStage(treeRevealStage)
    } else if (
      treeRevealStage < prevTreeStage.current &&
      phase === 'questions'
    ) {
      setTreeRecoilKey((k) => k + 1)
    }
    prevTreeStage.current = treeRevealStage
  }, [treeRevealStage, phase])

  const resetBookSession = () => {
    clearTransitionTimers()
    setPhase('shelf')
    setActiveBookId(null)
    setResult(null)
    setTreeRevealStage(0)
    setCoverOpening(false)
    setIsClosing(false)
    setJourneyMode('expanded')
    prevTreeStage.current = 0
    setAwakeningStage(null)
  }

  const selectBook = (book: BookDefinition) => {
    clearTransitionTimers()
    setActiveBookId(book.meta.id)
    setPhase('cover')
    setJourneyMode('pickup')
    setTreeRevealStage(0)
    setResult(null)
    setCoverOpening(false)
    setIsClosing(false)
    prevTreeStage.current = 0
    setAwakeningStage(null)
    pickupTimer.current = window.setTimeout(() => {
      setJourneyMode('expanded')
      pickupTimer.current = null
    }, BOOK_PICKUP_MS)
  }

  const backToShelf = () => {
    resetBookSession()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openBook = () => {
    if (!activeBook || coverOpening || isClosing) return
    setMusicBootstrap((n) => n + 1)
    setCoverOpening(true)
    setJourneyMode('expanding')

    transitionTimer.current = window.setTimeout(() => {
      setPhase('questions')
    }, 480)

    window.setTimeout(() => {
      setCoverOpening(false)
      setJourneyMode('expanded')
    }, BOOK_EXPAND_MS)
  }

  const closeBookToShelf = () => {
    if (!activeBook || isClosing) return
    setIsClosing(true)
    setJourneyMode('closing')

    transitionTimer.current = window.setTimeout(() => {
      resetBookSession()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, BOOK_CLOSE_MS)
  }

  const handleAssessmentDone = (assessmentResult: AssessmentResult) => {
    if (!activeBook) return
    setResult(assessmentResult)
    setTreeRevealStage(activeBook.meta.treeProgressMax)
  }

  const inBookSession = activeBookId !== null && phase !== 'shelf'

  const treeVariant =
    phase === 'shelf' || phase === 'cover' || isClosing
      ? 'welcome'
      : result
        ? 'complete'
        : 'explore'

  const musicPhase =
    phase === 'shelf' || phase === 'cover' || isClosing
      ? 'welcome'
      : result
        ? 'result'
        : 'questions'

  const skyIntensity =
    phase === 'shelf' || phase === 'cover' || isClosing ? 'welcome' : 'journey'

  const skyAwakeningLevel =
    phase === 'questions' ? treeRevealStage : result ? activeBook?.meta.treeProgressMax ?? 7 : 0

  const visualTierPreferred: VisualTier =
    phase === 'shelf'
      ? 'full'
      : phase === 'cover'
        ? 'balanced'
        : 'minimal'
  const visualTier = useVisualTier(visualTierPreferred)
  const readingFocus = phase === 'questions' && !isClosing && !result

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
    <div className={`relative min-h-screen${readingFocus ? ' app-reading-focus' : ''}`}>
      <AmbientPhraseLayer active={phase === 'shelf' || phase === 'cover'} subdued={readingFocus} />
      <TreeOfLifeBackground
        revealStage={treeRevealStage}
        variant={treeVariant}
        recoilKey={treeRecoilKey}
        visualTier={visualTier}
        readingFocus={readingFocus}
      />
      <SkyAtmosphere
        intensity={skyIntensity}
        awakeningLevel={skyAwakeningLevel}
        isComplete={Boolean(result)}
        visualTier={visualTier}
        readingFocus={readingFocus}
      />
      {readingFocus && <div className="reading-focus-scrim" aria-hidden />}
      <TreeAwakeningOverlay
        stage={awakeningStage}
        bookId={activeBook?.meta.id ?? null}
        locale={locale}
        onDone={() => setAwakeningStage(null)}
      />
      <AmbientMusicControl
        phase={musicPhase}
        awakeningStage={awakeningStage}
        bootstrap={musicBootstrap}
        locale={locale}
      />
      <main className="relative z-[2] pb-16">
        {phase === 'shelf' && !isClosing && (
          <Bookshelf
            books={getBooks(locale)}
            locale={locale}
            onLocaleChange={setLocale}
            onSelect={selectBook}
          />
        )}

        {inBookSession && (
          <BookJourneyStage mode={journeyMode}>
            {(phase === 'questions' || coverOpening) && !isClosing && (
              <div
                className={`book-interior-layer${coverOpening ? ' book-interior-layer--opening' : ''}`}
              >
                <BookReader
                  book={activeBook!}
                  locale={locale}
                  onLocaleChange={setLocale}
                  enterFromCover={coverOpening}
                  treeRevealStage={treeRevealStage}
                  onProgressChange={(index, answers) => {
                    setTreeRevealStage(
                      countCompletedDimensions(
                        index,
                        answers,
                        activeBook!.questions,
                        activeBook!.meta.treeProgressMax,
                      ),
                    )
                  }}
                  onAssessmentDone={handleAssessmentDone}
                  onClose={closeBookToShelf}
                />
              </div>
            )}

            {phase === 'cover' && !isClosing && !coverOpening && (
              <div
                className={`book-cover-layer${coverOpening ? ' book-cover-layer--opening' : ''}`}
              >
                <BookCover
                  book={activeBook!}
                  locale={locale}
                  onLocaleChange={setLocale}
                  onOpen={openBook}
                  onBack={backToShelf}
                  opening={coverOpening}
                />
              </div>
            )}

            {isClosing && (
              <div className="book-close-layer">
                <BookClosedVisual book={activeBook!} locale={locale} motion="closing" />
                <p className="book-close-caption">{ui.closeCaption}</p>
              </div>
            )}
          </BookJourneyStage>
        )}
      </main>
    </div>
    </LocaleContext.Provider>
  )
}

export default App
