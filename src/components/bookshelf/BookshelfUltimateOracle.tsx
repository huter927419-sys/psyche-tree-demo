import { useCallback, useEffect, useRef, useState } from 'react'
import { buildLocalHolisticReading } from '../../data/holisticFallback'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import {
  fetchHolisticReading,
  getJourneySession,
  type JourneyDto,
} from '../../services/journeyApi'
import { HolisticOracleOverlay } from './HolisticOracleOverlay'
import { ORACLE_FACET_ICONS, OracleFacetIcon } from './oracleFacetIcons'
import { pickHolisticReadingForLocale } from './holisticReadingUtils'

const TOTAL_BOOKS = 6

interface BookshelfUltimateOracleProps {
  locale: Locale
  journeySnapshot: JourneyDto | null
  flashSignal: number
  onJourneyUpdated?: () => void
}

export function BookshelfUltimateOracle({
  locale,
  journeySnapshot,
  flashSignal,
  onJourneyUpdated,
}: BookshelfUltimateOracleProps) {
  const ui = getUi(locale)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [readingText, setReadingText] = useState('')
  const [loading, setLoading] = useState(false)
  const lastFlashSignal = useRef(0)

  const isComplete =
    journeySnapshot?.status === 'completed' &&
    new Set(journeySnapshot.assessments.map((a) => a.bookId)).size >= TOTAL_BOOKS

  const resolveReading = useCallback(async (): Promise<string> => {
    const cached = pickHolisticReadingForLocale(journeySnapshot, locale)
    if (cached.reading) return cached.reading

    const { journeyId } = getJourneySession()
    if (journeyId && journeySnapshot?.status === 'completed') {
      try {
        const remote = await fetchHolisticReading(journeyId, locale)
        onJourneyUpdated?.()
        return remote.reading
      } catch {
        /* fall through to local template */
      }
    }

    return buildLocalHolisticReading(locale)
  }, [journeySnapshot, locale, onJourneyUpdated])

  const revealOracle = useCallback(async () => {
    if (loading || overlayOpen) return
    setLoading(true)
    try {
      const text = await resolveReading()
      setReadingText(text)
      setOverlayOpen(true)
    } finally {
      setLoading(false)
    }
  }, [loading, overlayOpen, resolveReading])

  useEffect(() => {
    if (!isComplete || !journeySnapshot) return
    if (flashSignal <= lastFlashSignal.current) return
    lastFlashSignal.current = flashSignal
    void revealOracle()
  }, [flashSignal, isComplete, journeySnapshot, revealOracle])

  useEffect(() => {
    if (!overlayOpen) return
    const cached = pickHolisticReadingForLocale(journeySnapshot, locale)
    if (cached.reading && cached.reading !== readingText) {
      setReadingText(cached.reading)
    }
  }, [locale, journeySnapshot, overlayOpen, readingText])

  const handleOverlayClosed = useCallback(() => {
    setOverlayOpen(false)
  }, [])

  if (!isComplete) return null

  return (
    <>
      <div className={`bookshelf-ultimate-oracle bookshelf-ultimate-oracle--${locale} animate-fade-in`}>
        <div className="bookshelf-ultimate-oracle-rule" aria-hidden />
        <div className="bookshelf-ultimate-oracle-glyphs" aria-hidden>
          {ORACLE_FACET_ICONS.map((id) => (
            <OracleFacetIcon key={id} id={id} className="bookshelf-ultimate-oracle-icon" />
          ))}
        </div>
        <button
          type="button"
          className="bookshelf-ultimate-oracle-trigger"
          onClick={() => void revealOracle()}
          disabled={loading || overlayOpen}
          aria-label={ui.ultimateOracleAria}
        >
          <span className="bookshelf-ultimate-oracle-trigger-icons" aria-hidden>
            <OracleFacetIcon id="crystal" className="bookshelf-ultimate-oracle-trigger-icon" />
          </span>
          <span className="bookshelf-ultimate-oracle-trigger-label">
            {ui.ultimateOracleLabel}
          </span>
          <span className="bookshelf-ultimate-oracle-trigger-hint">
            {loading ? ui.holisticLoading : ui.ultimateOracleHint}
          </span>
        </button>
        <p className="bookshelf-ultimate-oracle-footnote">{ui.shelfFooter(TOTAL_BOOKS)}</p>
      </div>

      <HolisticOracleOverlay
        open={overlayOpen}
        locale={locale}
        reading={readingText}
        onClosed={handleOverlayClosed}
      />
    </>
  )
}
