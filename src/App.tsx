import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { GuideCover } from './components/guide/GuideCover'
import { GuideReader } from './components/guide/GuideReader'
import { UserEmailCorner } from './components/user/UserEmailCorner'
import { EmailGateDialog } from './components/user/EmailGateDialog'
import { AmbientPhraseLayer } from './components/i18n/AmbientPhraseLayer'
import { TreeAwakeningOverlay } from './components/tree/TreeAwakeningOverlay'
import { AmbientMusicControl } from './components/AmbientMusicControl'
import { SkyAtmosphere } from './components/SkyAtmosphere'
import { ShoreZenAmbience } from './components/ambient/ShoreZenAmbience'
import { useVisualTier, type VisualTier } from './hooks/useVisualTier'
import { LocaleContext, type Locale } from './i18n/locale'
import { getUi } from './i18n/ui'
import {
  fetchJourney,
  findAssessmentForBook,
  getJourneySession,
  logoutUser,
  restoreJourneyFromStorage,
  type JourneyAssessmentDto,
  type JourneyDto,
} from './services/journeyApi'
import { buildAssessmentFromStored } from './services/storedAssessment'
import {
  clearGuideVolumeHandoff,
  getGuideShelfState,
  isGuideVolumeHandoffPending,
  markGuideOpened,
  shouldShowGuideFirstVisitHint,
} from './books/guide'

type AppPhase = 'shelf' | 'guide' | 'cover' | 'questions'

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
  const [savedBookSession, setSavedBookSession] =
    useState<JourneyAssessmentDto | null>(null)
  const [journeySnapshot, setJourneySnapshot] = useState<JourneyDto | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(
    () => getJourneySession().email,
  )
  const [userId, setUserId] = useState<string | null>(
    () => getJourneySession().userId,
  )
  const [emailGateOpen, setEmailGateOpen] = useState(false)
  const [holisticFlashSignal, setHolisticFlashSignal] = useState(0)
  const [guideRevision, setGuideRevision] = useState(0)
  const [guideStep, setGuideStep] = useState<'cover' | 'reading'>('cover')
  const [guideCoverOpening, setGuideCoverOpening] = useState(false)
  const [guideJourneyMode, setGuideJourneyMode] =
    useState<BookJourneyMode>('pickup')
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
    document.documentElement.lang =
      locale === 'en'
        ? 'en'
        : locale === 'ja'
          ? 'ja'
          : locale === 'zhTw'
            ? 'zh-Hant'
            : 'zh-CN'
  }, [locale])

  useEffect(() => {
    const syncHidden = () => {
      document.documentElement.classList.toggle('app-page-hidden', document.hidden)
    }
    syncHidden()
    document.addEventListener('visibilitychange', syncHidden)
    return () => document.removeEventListener('visibilitychange', syncHidden)
  }, [])

  const refreshJourneySnapshot = useCallback(async () => {
    const journey = await restoreJourneyFromStorage()
    setJourneySnapshot(journey)
    const session = getJourneySession()
    setUserEmail(session.email)
    setUserId(session.userId)
    return journey
  }, [])

  useEffect(() => {
    void refreshJourneySnapshot()
  }, [refreshJourneySnapshot])

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
    setSavedBookSession(null)
  }

  const applyJourneyForBook = (
    journey: JourneyDto,
    book: BookDefinition,
  ) => {
    setJourneySnapshot(journey)
    const stored = findAssessmentForBook(journey, book.meta.id)
    if (stored) {
      setSavedBookSession(stored)
      setTreeRevealStage(book.meta.treeProgressMax)
    } else {
      setSavedBookSession(null)
    }
  }

  const selectBook = async (book: BookDefinition) => {
    if (isGuideVolumeHandoffPending()) {
      clearGuideVolumeHandoff()
      setGuideRevision((n) => n + 1)
    }
    clearTransitionTimers()
    setActiveBookId(book.meta.id)
    setPhase('cover')
    setJourneyMode('pickup')
    setTreeRevealStage(0)
    setResult(null)
    setCoverOpening(false)
    setIsClosing(false)
    setSavedBookSession(null)
    prevTreeStage.current = 0
    setAwakeningStage(null)

    let journey = journeySnapshot
    if (!journey) {
      const { journeyId } = getJourneySession()
      if (journeyId) {
        try {
          journey = await fetchJourney(journeyId)
        } catch {
          journey = await refreshJourneySnapshot()
        }
      } else {
        journey = await refreshJourneySnapshot()
      }
    }

    if (journey) {
      applyJourneyForBook(journey, book)
    }

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

    const { journeyId, email } = getJourneySession()
    if (!journeyId && !email) {
      setEmailGateOpen(true)
      return
    }

    void prepareAndOpenBook()
  }

  const prepareAndOpenBook = async () => {
    if (!activeBook) return

    const journey = await refreshJourneySnapshot()
    if (!journey) {
      setUserEmail(null)
      setUserId(null)
      setEmailGateOpen(true)
      return
    }

    applyJourneyForBook(journey, activeBook)

    setMusicBootstrap((n) => n + 1)
    setCoverOpening(true)
    setJourneyMode('expanding')

    const stored = journey
      ? findAssessmentForBook(journey, activeBook.meta.id)
      : undefined
    if (stored) {
      setResult(buildAssessmentFromStored(stored, activeBook))
    }

    transitionTimer.current = window.setTimeout(() => {
      setPhase('questions')
    }, 480)

    window.setTimeout(() => {
      setCoverOpening(false)
      setJourneyMode('expanded')
    }, BOOK_EXPAND_MS)
  }

  const handleEmailGateReady = ({ email, userId: uid }: { email: string; userId: string }) => {
    setEmailGateOpen(false)
    setUserEmail(email)
    setUserId(uid)
    void prepareAndOpenBook()
  }

  const closeBookToShelf = () => {
    if (!activeBook || isClosing) return
    setIsClosing(true)
    setJourneyMode('closing')

    transitionTimer.current = window.setTimeout(() => {
      resetBookSession()
      void (async () => {
        const journey = await refreshJourneySnapshot()
        if (
          journey?.status === 'completed' &&
          journey.assessments.length >= 6
        ) {
          setHolisticFlashSignal((n) => n + 1)
        }
      })()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, BOOK_CLOSE_MS)
  }

  const handleAssessmentDone = (assessmentResult: AssessmentResult) => {
    if (!activeBook) return
    setResult(assessmentResult)
    setTreeRevealStage(activeBook.meta.treeProgressMax)
  }

  const handleLogout = useCallback(() => {
    logoutUser()
    setUserEmail(null)
    setUserId(null)
    setJourneySnapshot(null)
    clearTransitionTimers()
    setPhase('shelf')
    setActiveBookId(null)
    setResult(null)
    setTreeRevealStage(0)
    setCoverOpening(false)
    setIsClosing(false)
    setJourneyMode('expanded')
    setAwakeningStage(null)
    setSavedBookSession(null)
    prevTreeStage.current = 0
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const inBookSession =
    activeBookId !== null && phase !== 'shelf' && phase !== 'guide'

  const guideInBook =
    phase === 'guide' && (guideStep === 'reading' || guideCoverOpening)

  const isWelcomeAtmosphere =
    phase === 'shelf' ||
    (phase === 'guide' && !guideInBook) ||
    phase === 'cover' ||
    isClosing

  const treeVariant = isWelcomeAtmosphere
    ? 'welcome'
    : result
      ? 'complete'
      : 'explore'

  const musicPhase = isWelcomeAtmosphere
    ? 'welcome'
    : result
      ? 'result'
      : 'questions'

  const skyIntensity = isWelcomeAtmosphere ? 'welcome' : 'journey'

  const skyAwakeningLevel =
    phase === 'questions' ? treeRevealStage : result ? activeBook?.meta.treeProgressMax ?? 6 : 0

  const visualTierPreferred: VisualTier = 'balanced'
  const visualTier = useVisualTier(visualTierPreferred)
  const readingFocus = (phase === 'questions' || guideInBook) && !isClosing

  const completedBookIds = useMemo(
    () => journeySnapshot?.assessments.map((a) => a.bookId) ?? [],
    [journeySnapshot],
  )

  const guideShelfState = useMemo(
    () => getGuideShelfState(),
    [guideRevision, phase],
  )

  const showGuideFirstVisitHint = useMemo(
    () => shouldShowGuideFirstVisitHint(),
    [guideRevision, phase],
  )

  const guideVolumeHandoff = useMemo(
    () => isGuideVolumeHandoffPending(),
    [guideRevision, phase],
  )

  const openGuide = useCallback(() => {
    clearTransitionTimers()
    markGuideOpened()
    setGuideRevision((n) => n + 1)
    setGuideStep('cover')
    setGuideCoverOpening(false)
    setGuideJourneyMode('pickup')
    setPhase('guide')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    pickupTimer.current = window.setTimeout(() => {
      setGuideJourneyMode('expanded')
      pickupTimer.current = null
    }, BOOK_PICKUP_MS)
  }, [])

  const openGuideReading = useCallback(() => {
    if (guideCoverOpening) return
    setGuideCoverOpening(true)
    setGuideJourneyMode('expanding')
    transitionTimer.current = window.setTimeout(() => {
      setGuideStep('reading')
    }, 480)
    window.setTimeout(() => {
      setGuideCoverOpening(false)
      setGuideJourneyMode('expanded')
    }, BOOK_EXPAND_MS)
  }, [guideCoverOpening])

  const closeGuide = useCallback(() => {
    clearTransitionTimers()
    setPhase('shelf')
    setGuideStep('cover')
    setGuideCoverOpening(false)
    setGuideJourneyMode('expanded')
    setGuideRevision((n) => n + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
    <div
      className={`relative min-h-screen${readingFocus ? ' app-reading-focus' : ''}${userEmail ? ' app-has-user-email' : ''}`}
    >
      <UserEmailCorner
        email={userEmail}
        userId={userId}
        locale={locale}
        onLogout={handleLogout}
      />
      <EmailGateDialog
        open={emailGateOpen}
        locale={locale}
        onClose={() => setEmailGateOpen(false)}
        onReady={handleEmailGateReady}
      />
      <AmbientPhraseLayer
        locale={locale}
        active={
          phase === 'shelf' ||
          phase === 'guide' ||
          phase === 'cover' ||
          phase === 'questions'
        }
        subdued={readingFocus}
      />
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
      <ShoreZenAmbience
        intensity={skyIntensity}
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
            onOpenGuide={openGuide}
            guideShelfState={guideShelfState}
            showGuideFirstVisitHint={showGuideFirstVisitHint}
            guideVolumeHandoff={guideVolumeHandoff}
            completedBookIds={completedBookIds}
            journeySnapshot={journeySnapshot}
            holisticFlashSignal={holisticFlashSignal}
            onJourneyUpdated={() => {
              void refreshJourneySnapshot()
            }}
          />
        )}

        {phase === 'guide' && (
          <BookJourneyStage mode={guideJourneyMode}>
            {(guideStep === 'reading' || guideCoverOpening) && (
              <div
                className={`book-interior-layer${guideCoverOpening ? ' book-interior-layer--opening' : ''}`}
              >
                <GuideReader
                  locale={locale}
                  onLocaleChange={setLocale}
                  onClose={closeGuide}
                  onCompleted={() => setGuideRevision((n) => n + 1)}
                  enterFromCover={guideCoverOpening}
                />
              </div>
            )}

            {guideStep === 'cover' && !guideCoverOpening && (
              <div className="book-cover-layer">
                <GuideCover
                  locale={locale}
                  onLocaleChange={setLocale}
                  onOpen={openGuideReading}
                  onBack={closeGuide}
                  opening={guideCoverOpening}
                />
              </div>
            )}
          </BookJourneyStage>
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
                  savedSession={savedBookSession}
                  journeySnapshot={journeySnapshot}
                  onProgressChange={(index, answers) => {
                    if (savedBookSession) return
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
                  onJourneyPersisted={() => {
                    void refreshJourneySnapshot()
                  }}
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
                  reviewMode={Boolean(savedBookSession)}
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
