import type { GuideSpreadRestVisual } from '../../books/guide/guideSpreadRest'
import { getGuideRitualCopy } from '../../books/guide/guideRitualCopy'
import type { GuidePageBlock } from '../../books/guide/types'
import type { Locale } from '../../i18n/locale'
import { resolveContentLocale } from '../../i18n/traditionalChinese'
import { getUi } from '../../i18n/ui'
import { GuideIllustration } from './GuideIllustration'
import {
  GuidePrefaceNote,
  GuidePrefacePlate,
  GuideStoryAfterglow,
  GuideStoryBridge,
  GuideStoryClose,
  GuideStoryOpening,
  GuideStoryPortal,
  GuideStoryProse,
} from './GuideStoryPanels'
import { GuideVisualPanel } from './GuideVisualPanel'
import { GuideStoryMotif } from './GuideStoryMotif'
import { useGuidePageRhythm } from './useGuidePageRhythm'

type GuidePanelTone =
  | 'default'
  | 'hook'
  | 'breath'
  | 'close'
  | 'quote'
  | 'rest'
  | 'enter'
  | 'interval'

function guidePageLayoutClass(blocks: readonly GuidePageBlock[]): string {
  const roles: string[] = []

  if (blocks.some((b) => b.kind === 'lines' && b.variant === 'vignette')) {
    roles.push('guide-page-stack--prose-page')
  }
  if (blocks.some((b) => b.kind === 'storyOpening')) {
    roles.push('guide-page-stack--cover-page')
  }
  if (
    blocks.some(
      (b) =>
        b.kind === 'storyOpening' ||
        b.kind === 'prefacePlate' ||
        b.kind === 'prefaceNote' ||
        b.kind === 'storyBridge' ||
        b.kind === 'storyAfterglow' ||
        b.kind === 'storyPortal' ||
        (b.kind === 'close' && b.variant === 'enter'),
    )
  ) {
    roles.push('guide-page-stack--ritual-page')
  }
  if (blocks.some((b) => b.kind === 'storyMotif')) {
    roles.push('guide-page-stack--breath-page')
  }
  if (
    blocks.some(
      (b) =>
        b.kind === 'visualPanel' ||
        (b.kind === 'illustration' && (b.tone === 'ghost' || b.tone === 'companion')),
    )
  ) {
    roles.push('guide-page-stack--slot-page')
  }

  return roles.join(' ')
}

function GuideSpreadPanel({
  locale,
  tone = 'default',
  rite,
  axis,
  source,
  lines,
  quote,
  footer,
}: {
  locale: Locale
  tone?: GuidePanelTone
  rite?: string
  axis?: string
  source?: string
  lines?: readonly string[]
  quote?: string
  footer?: readonly string[]
}) {
  if (tone === 'rest') {
    const glyph = locale === 'en' ? '◦' : locale === 'ja' ? '息' : '息'
    return (
      <div className="guide-spread-panel guide-spread-panel--rest" aria-hidden>
        <div className="guide-spread-void">
          <span className="guide-spread-void-mist" aria-hidden />
          <span className="guide-spread-void-rule" aria-hidden />
          <span className="guide-spread-glyph">{glyph}</span>
          <span className="guide-spread-void-rule" aria-hidden />
        </div>
      </div>
    )
  }

  if (tone === 'interval') {
    return (
      <div className="guide-spread-panel guide-spread-panel--interval">
        <p className="guide-spread-interval" aria-hidden>
          ……
        </p>
      </div>
    )
  }

  const panelTone =
    tone === 'quote' || tone === 'enter' ? tone : quote ? 'quote' : tone

  return (
    <div className={`guide-spread-panel guide-spread-panel--${panelTone}`}>
      {rite && (
        <p
          className={`guide-spread-rite${rite.length <= 1 ? ' guide-spread-rite--sigil' : ''}`}
        >
          {rite}
        </p>
      )}
      {axis && <p className="guide-spread-axis">{axis}</p>}
      {source && <p className="guide-spread-source">{source}</p>}
      {quote && (
        <p className="guide-spread-body guide-spread-body--emphasis">{quote}</p>
      )}
      {lines && lines.length > 0 && (
        <div className="guide-spread-verse">
          {lines.map((line) => (
            <p key={line} className="guide-spread-body">
              {line}
            </p>
          ))}
        </div>
      )}
      {footer && footer.length > 0 && (
        <div className="guide-spread-footer">
          {footer.map((line) => (
            <p key={line} className="guide-spread-footnote">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function GuidePageContent({
  blocks,
  locale,
  spreadIndex,
  contentVisible = true,
  illustrationReady = true,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  pageInhale = false,
  pageAwaitingCue = false,
  pageLeftComplete = false,
  pageReflecting = false,
  restVisual = 'none',
  onRhythmComplete,
  onIllustrationMotionComplete,
}: {
  blocks: readonly GuidePageBlock[]
  locale: Locale
  spreadIndex: number
  contentVisible?: boolean
  illustrationReady?: boolean
  autoReading?: boolean
  rhythmActive?: boolean
  rhythmLocked?: boolean
  pageInhale?: boolean
  pageAwaitingCue?: boolean
  pageLeftComplete?: boolean
  pageReflecting?: boolean
  restVisual?: GuideSpreadRestVisual
  onRhythmComplete?: () => void
  onIllustrationMotionComplete?: () => void
}) {
  const ui = getUi(locale)
  const contentLocale = resolveContentLocale(locale)
  const ritual = getGuideRitualCopy(locale)
  const storyLocaleProps = { ritual, contentLocale, locale }
  const reportRhythmSegment = useGuidePageRhythm(
    blocks,
    rhythmActive,
    onRhythmComplete,
  )
  const rhythmProps = {
    autoReading,
    rhythmActive,
    rhythmLocked,
    onRhythmComplete: reportRhythmSegment,
  }
  const solePartLabel =
    blocks.length === 1 && blocks[0]?.kind === 'part' ? blocks[0].text : null
  const hasStoryLayout = blocks.some(
    (block) =>
      block.kind === 'storyOpening' ||
      block.kind === 'storyBridge' ||
      block.kind === 'storyAfterglow' ||
      block.kind === 'storyPortal' ||
      block.kind === 'visualPanel' ||
      block.kind === 'storyMotif' ||
      block.kind === 'prefacePlate' ||
      block.kind === 'prefaceNote' ||
      (block.kind === 'close' && block.variant === 'enter') ||
      (block.kind === 'lines' && block.variant === 'vignette'),
  )
  const pageLayoutClass = guidePageLayoutClass(blocks)

  const restClass =
    restVisual === 'bridge'
      ? ' guide-page-stack--rest-bridge'
      : restVisual === 'chapter'
        ? ' guide-page-stack--rest-chapter'
        : restVisual === 'soft'
          ? ' guide-page-stack--rest-soft'
          : ''

  const pageStateClass = [
    pageInhale ? ' guide-page-stack--inhale' : '',
    pageAwaitingCue ? ' guide-page-stack--await-right' : '',
    pageLeftComplete ? ' guide-page-stack--left-complete' : '',
    pageReflecting ? ' guide-page-stack--reflect' : '',
  ].join('')

  return (
    <div
      className={`guide-page-stack${contentVisible ? '' : ' guide-page-stack--hidden'}${pageStateClass}${restClass}${
        blocks.some((b) => b.kind === 'illustration' && (b.tone ?? 'hero') === 'hero')
          ? ' guide-page-stack--hero-art'
          : ''
      }${
        blocks.some(
          (b) =>
            b.kind === 'illustration' ||
            b.kind === 'visualPanel' ||
            b.kind === 'storyPortal',
        )
          ? ' guide-page-stack--has-figure'
          : ''
      }${hasStoryLayout ? ' guide-page-stack--story' : ''}${pageLayoutClass ? ` ${pageLayoutClass}` : ''}`}
    >
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`

        if (block.kind === 'part') {
          if (solePartLabel) {
            return <GuideSpreadPanel key={key} locale={locale} tone="rest" />
          }
          return null
        }

        if (block.kind === 'prefacePlate') {
          return (
            <GuidePrefacePlate
              key={key}
              frame={block.frame}
              whisper={block.whisper}
              ritual={ritual}
              contentLocale={contentLocale}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'prefaceNote') {
          return (
            <GuidePrefaceNote
              key={key}
              lines={block.lines}
              ritual={ritual}
              contentLocale={contentLocale}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'storyOpening') {
          return (
            <GuideStoryOpening
              key={`${key}-${block.title}-${block.index}`}
              index={block.index}
              into={block.into}
              title={block.title}
              sectionId={block.sectionId}
              contentLocale={contentLocale}
              locale={locale}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'storyBridge') {
          return (
            <GuideStoryBridge
              key={key}
              lines={block.lines}
              sectionId={block.sectionId}
              {...storyLocaleProps}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'storyAfterglow') {
          return (
            <GuideStoryAfterglow
              key={key}
              lines={block.lines}
              sectionId={block.sectionId}
              {...storyLocaleProps}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'storyPortal') {
          return (
            <GuideStoryPortal
              key={key}
              index={block.index}
              title={block.title}
              sectionId={block.sectionId}
              previewIllustrationId={block.previewIllustrationId}
              spreadIndex={spreadIndex}
              illustrationReady={illustrationReady}
              {...storyLocaleProps}
              {...rhythmProps}
            />
          )
        }

        if (block.kind === 'visualPanel') {
          return (
            <GuideVisualPanel
              key={key}
              illustrationId={block.illustrationId}
              sectionId={block.sectionId}
              tone={block.tone}
              spreadIndex={spreadIndex}
              ready={illustrationReady}
            />
          )
        }

        if (block.kind === 'storyMotif') {
          return (
            <GuideStoryMotif
              key={key}
              sectionId={block.sectionId}
              variant={block.variant ?? 'ambient'}
              showCaption={block.showCaption ?? true}
              locale={locale}
            />
          )
        }

        if (block.kind === 'hook') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              tone="hook"
              rite={ui.guideSectionHook}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'phenomenon') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={
                block.section === 'guide'
                  ? ui.guideSectionGuide
                  : ui.guideSectionPhenomenon
              }
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'turn') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionTurn}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'tongguanEast') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionTongguan}
              axis={ui.guideAxisEast}
              source={block.quote.source}
              quote={block.quote.text}
            />
          )
        }

        if (block.kind === 'tongguanModern') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionTongguan}
              axis={ui.guideAxisModern}
              source={block.quote.source}
              quote={block.quote.text}
              footer={block.footer}
            />
          )
        }

        if (block.kind === 'shoreView') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionShoreView}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'shoreQuestion') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionShoreAsk}
              axis={block.axisLabel}
              quote={block.text}
            />
          )
        }

        if (block.kind === 'breath') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              tone="breath"
              rite={ui.guideSectionBreath}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'volumeMeaning') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={ui.guideSectionVolumeMeaning}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'close') {
          if (block.variant === 'enter') {
            return (
              <GuideStoryClose
                key={key}
                lines={block.lines}
                contentLocale={contentLocale}
                {...rhythmProps}
              />
            )
          }
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              tone="close"
              rite={ui.guideSectionClose}
              lines={block.lines}
            />
          )
        }

        if (block.kind === 'pause') {
          return <GuideSpreadPanel key={key} locale={locale} tone="rest" />
        }

        if (block.kind === 'illustration') {
          const wrapClass =
            block.tone === 'ghost'
              ? ' guide-spread-illustration-wrap--ghost'
              : block.tone === 'companion'
                ? ' guide-spread-illustration-wrap--companion'
                : block.tone === 'echo'
                  ? ' guide-spread-illustration-wrap--echo'
                  : ''
          return (
            <div
              key={key}
              className={`guide-spread-illustration-wrap${wrapClass}`}
            >
              <GuideIllustration
                id={block.id}
                spreadIndex={spreadIndex}
                tone={block.tone ?? 'hero'}
                ready={illustrationReady}
                onMotionComplete={onIllustrationMotionComplete}
              />
            </div>
          )
        }

        if (block.kind === 'sectionTitle') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              quote={`《${block.title}》`}
            />
          )
        }

        if (block.kind === 'interval') {
          return <GuideSpreadPanel key={key} locale={locale} tone="interval" />
        }

        if (block.kind === 'lines') {
          if (block.variant === 'vignette') {
            return (
              <GuideStoryProse
                key={key}
                lines={block.lines}
                sectionId={block.sectionId}
                {...storyLocaleProps}
                {...rhythmProps}
              />
            )
          }
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              rite={block.variant === 'preface' ? ui.guideSectionPreface : undefined}
              lines={block.lines}
            />
          )
        }

        return null
      })}
    </div>
  )
}
