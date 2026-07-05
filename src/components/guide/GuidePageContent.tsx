import type { GuidePageBlock } from '../../books/guide/types'
import type { Locale } from '../../i18n/locale'
import { getUi } from '../../i18n/ui'
import { GuideIllustration } from './GuideIllustration'

type GuidePanelTone = 'default' | 'hook' | 'breath' | 'close' | 'quote' | 'rest'

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
    const glyph =
      locale === 'en' ? '◦' : locale === 'ja' ? '息' : '息'
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

  const panelTone = quote ? 'quote' : tone

  return (
    <div className={`guide-spread-panel guide-spread-panel--${panelTone}`}>
      {rite && <p className="guide-spread-rite">{rite}</p>}
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
}: {
  blocks: readonly GuidePageBlock[]
  locale: Locale
}) {
  const ui = getUi(locale)
  const solePartLabel =
    blocks.length === 1 && blocks[0]?.kind === 'part' ? blocks[0].text : null

  return (
    <div className="guide-page-stack">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`

        if (block.kind === 'part') {
          if (solePartLabel) {
            return (
              <GuideSpreadPanel key={key} locale={locale} tone="rest" />
            )
          }
          return null
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
          return (
            <div key={key} className="guide-spread-illustration-wrap">
              <GuideIllustration id={block.id} />
            </div>
          )
        }

        if (block.kind === 'lines') {
          return (
            <GuideSpreadPanel
              key={key}
              locale={locale}
              tone="hook"
              rite={ui.guideSectionPreface}
              lines={block.lines}
            />
          )
        }

        return null
      })}
    </div>
  )
}
