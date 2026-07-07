import { useCallback, useEffect, useState } from 'react'
import { getGuideMotifMeta } from '../../books/guide/guideMotifMeta'
import { GuideRhythmicLines } from './GuideRhythmicLines'
import { GuideStoryMotif } from './GuideStoryMotif'
import { GuideIllustration } from './GuideIllustration'
import { useGuideRhythmSession } from './useGuideRhythmSession'

const INDEX_LABELS = [
  '零',
  '壹',
  '贰',
  '叁',
  '肆',
  '伍',
  '陆',
  '柒',
  '捌',
] as const

export function storyIndexLabel(index: number): string {
  return INDEX_LABELS[index] ?? String(index)
}

function storyLineClass(line: string): string {
  if (/^(那一年|很多年以后|五年以后|几年以后|三年以后|后来|有一天|那天)/.test(line)) {
    return 'guide-story-line guide-story-line--time'
  }
  if (/^「/.test(line)) {
    return 'guide-story-line guide-story-line--dialogue'
  }
  if (line.length <= 4 && !/[，。！？」]/.test(line)) {
    return 'guide-story-line guide-story-line--beat'
  }
  return 'guide-story-line'
}

type RhythmProps = {
  autoReading?: boolean
  rhythmActive?: boolean
  rhythmLocked?: boolean
  onRhythmComplete?: () => void
}

const OPENING_SECTION_BY_TITLE: Record<string, string> = {
  同观: 'tongguan',
  留白: 'liubai',
  长夜: 'changye',
  门牌: 'menpai',
  回声: 'huisheng',
  清晨: 'qingchen',
  远行: 'yuanxing',
  六卷: 'liujuan',
}

export function GuideStoryOpening({
  index,
  into,
  title,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  index: number
  into?: readonly string[]
  title: string
} & RhythmProps) {
  const [intoPhase, setIntoPhase] = useState(false)

  useEffect(() => {
    setIntoPhase(false)
  }, [index, title, into])

  const hasInto = Boolean(into?.length)

  const handleTitleComplete = useCallback(() => {
    if (hasInto) {
      setIntoPhase(true)
      return
    }
    onRhythmComplete?.()
  }, [hasInto, onRhythmComplete])

  const handleIntoComplete = useCallback(() => {
    onRhythmComplete?.()
  }, [onRhythmComplete])

  const sessionKey = `${index}-${title}-${into?.join('\n') ?? ''}`
  const openingMeta = getGuideMotifMeta(OPENING_SECTION_BY_TITLE[title] ?? '')
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    sessionKey,
  )

  const coverClass = `guide-story-cover guide-story-opening${
    rhythmActive ? ' guide-story-opening--rhythm' : ''
  }`

  const coverFrame = (
    <div className="guide-story-cover-frame" aria-hidden>
      <span className="guide-story-cover-corner guide-story-cover-corner--tl" />
      <span className="guide-story-cover-corner guide-story-cover-corner--tr" />
      <span className="guide-story-cover-corner guide-story-cover-corner--bl" />
      <span className="guide-story-cover-corner guide-story-cover-corner--br" />
    </div>
  )

  const coverGlyph =
    openingMeta != null ? (
      <span className="guide-story-cover-glyph" aria-hidden>
        {openingMeta.glyph}
      </span>
    ) : null

  const coverIndex = (
    <p
      className={`guide-story-index${rhythmActive ? ' guide-rhythm-index guide-rhythm-index--ritual' : ''}`}
      aria-hidden
    >
      <span className="guide-story-index-n">{storyIndexLabel(index)}</span>
      <span className="guide-story-index-sep">／</span>
      <span className="guide-story-index-total">八片刻</span>
    </p>
  )

  const coverTitlePlate = (
    <div className="guide-story-title-plate guide-story-cover-plate">
      <span className="guide-story-ornament" aria-hidden />
      {!rhythmSession ? (
        <p className="guide-story-title">《{title}》</p>
      ) : (
        <GuideRhythmicLines
          lines={[`《${title}》`]}
          mode="ritual"
          active={rhythmActive}
          rhythmLocked={rhythmLocked}
          getLineClass={() => 'guide-story-title'}
          accentBlockKind="openingTitle"
          onComplete={handleTitleComplete}
        />
      )}
      <span className="guide-story-ornament guide-story-ornament--after" aria-hidden />
    </div>
  )

  const coverLead =
    hasInto &&
    (!rhythmSession || intoPhase) &&
    (rhythmSession ? (
      <div className="guide-story-lead">
        <GuideRhythmicLines
          lines={into!}
          mode="ritual"
          active={intoPhase && rhythmActive}
          rhythmLocked={rhythmLocked}
          getLineClass={() => 'guide-story-lead-line'}
          accentBlockKind="openingInto"
          onComplete={handleIntoComplete}
        />
      </div>
    ) : (
      <div className="guide-story-lead">
        {into!.map((line) => (
          <p key={line} className="guide-story-lead-line">
            {line}
          </p>
        ))}
      </div>
    ))

  return (
    <div className={coverClass}>
      {coverFrame}
      {coverGlyph}
      {coverIndex}
      {coverTitlePlate}
      {coverLead}
    </div>
  )
}

export function GuideStoryProse({
  lines,
  sectionId,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  lines: readonly string[]
  sectionId?: string
} & RhythmProps) {
  const sectionMeta = sectionId ? getGuideMotifMeta(sectionId) : undefined
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    lines.join('\n'),
  )

  if (!rhythmSession) {
    return (
      <div className="guide-story-prose-wrap">
        {sectionMeta && (
          <p className="guide-story-prose-section" aria-hidden>
            <span className="guide-story-prose-section-glyph">{sectionMeta.glyph}</span>
            <span className="guide-story-prose-section-title">《{sectionMeta.title}》</span>
          </p>
        )}
        <div className="guide-story-prose">
          {lines.map((line) => (
            <p key={line} className={storyLineClass(line)}>
              {line}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="guide-story-prose-wrap">
      {sectionMeta && (
        <p className="guide-story-prose-section" aria-hidden>
          <span className="guide-story-prose-section-glyph">{sectionMeta.glyph}</span>
          <span className="guide-story-prose-section-title">《{sectionMeta.title}》</span>
        </p>
      )}
      <div className="guide-story-prose guide-story-prose--rhythm">
        <GuideRhythmicLines
        lines={lines}
        mode="body"
        active={rhythmActive}
        rhythmLocked={rhythmLocked}
        getLineClass={storyLineClass}
        accentBlockKind="vignette"
        onComplete={onRhythmComplete}
      />
      </div>
    </div>
  )
}

export function GuideStoryBridge({
  lines,
  sectionId,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  lines: readonly string[]
  sectionId: string
} & RhythmProps) {
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    `${sectionId}-${lines.join('\n')}`,
  )

  return (
    <div className="guide-story-bridge guide-story-bridge--with-motif">
      <GuideStoryMotif sectionId={sectionId} variant="ambient" showCaption={false} />
      <div className="guide-story-bridge-core">
        <div className="guide-story-bridge-body">
          {rhythmSession ? (
            <GuideRhythmicLines
              lines={lines}
              mode="ritual"
              active={rhythmActive}
              rhythmLocked={rhythmLocked}
              getLineClass={() => 'guide-story-bridge-line'}
              accentBlockKind="bridge"
              onComplete={onRhythmComplete}
            />
          ) : (
            lines.map((line) => (
              <p key={line} className="guide-story-bridge-line">
                {line}
              </p>
            ))
          )}
        </div>
        <div className="guide-story-bridge-foot" aria-hidden>
          <span className="guide-story-bridge-seal">移</span>
          <p className="guide-story-bridge-kicker">时移</p>
        </div>
      </div>
    </div>
  )
}

export function GuideStoryAfterglow({
  lines,
  sectionId,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  lines: readonly string[]
  sectionId: string
} & RhythmProps) {
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    `${sectionId}-${lines.join('\n')}`,
  )

  return (
    <div className="guide-story-afterglow guide-story-afterglow--with-motif">
      <GuideStoryMotif sectionId={sectionId} variant="echo" />
      <div className="guide-story-afterglow-head" aria-hidden>
        <span className="guide-story-afterglow-seal">尽</span>
        <p className="guide-story-afterglow-kicker">片刻已尽</p>
      </div>
      {rhythmSession ? (
        <div className="guide-story-afterglow-body">
          <GuideRhythmicLines
            lines={lines}
            mode="close"
            active={rhythmActive}
            rhythmLocked={rhythmLocked}
            getLineClass={() => 'guide-story-afterglow-line'}
            accentBlockKind="afterglow"
            onComplete={onRhythmComplete}
          />
        </div>
      ) : (
        <div className="guide-story-afterglow-body">
          {lines.map((line) => (
            <p key={line} className="guide-story-afterglow-line">
              {line}
            </p>
          ))}
        </div>
      )}
      <p className="guide-story-afterglow-foot" aria-hidden>
        余韵
      </p>
    </div>
  )
}

export function GuideStoryPortal({
  index,
  title,
  sectionId,
  previewIllustrationId,
  spreadIndex,
  illustrationReady,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  index: number
  title: string
  sectionId: string
  previewIllustrationId: string
  spreadIndex: number
  illustrationReady?: boolean
  rhythmActive?: boolean
  onRhythmComplete?: () => void
} & RhythmProps) {
  const portalLines = ['篇章已毕', '下一片刻', storyIndexLabel(index), `《${title}》`]
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    `${sectionId}-${title}`,
  )

  return (
    <div className="guide-story-portal guide-story-portal--with-preview">
      <GuideStoryMotif sectionId={sectionId} variant="echo" />
      <div className="guide-story-portal-preview" aria-hidden>
        <GuideIllustration
          id={previewIllustrationId}
          spreadIndex={spreadIndex}
          tone="echo"
          ready={illustrationReady}
        />
      </div>
      <div className="guide-story-portal-copy">
        {rhythmSession ? (
          <GuideRhythmicLines
            lines={portalLines}
            mode="ritual"
            active={rhythmActive}
            rhythmLocked={rhythmLocked}
            getLineClass={(_, lineIndex) => {
              if (lineIndex === 0) return 'guide-story-portal-done'
              if (lineIndex === 1) return 'guide-story-portal-kicker'
              if (lineIndex === 2) return 'guide-story-portal-index'
              return 'guide-story-portal-title'
            }}
            accentBlockKind="portal"
            onComplete={onRhythmComplete}
          />
        ) : (
          <>
            <p className="guide-story-portal-done">篇章已毕</p>
            <p className="guide-story-portal-kicker">下一片刻</p>
            <p className="guide-story-portal-index">{storyIndexLabel(index)}</p>
            <p className="guide-story-portal-title">《{title}》</p>
          </>
        )}
        <span className="guide-story-portal-arrow" aria-hidden>
          ↓
        </span>
      </div>
    </div>
  )
}

export function GuidePrefacePlate({
  frame,
  whisper,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  frame: readonly string[]
  whisper?: readonly string[]
} & RhythmProps) {
  const [whisperReady, setWhisperReady] = useState(false)

  useEffect(() => {
    setWhisperReady(false)
  }, [frame, whisper])

  const handleFrameComplete = useCallback(() => {
    if (!whisper?.length) {
      onRhythmComplete?.()
      return
    }
    setWhisperReady(true)
  }, [onRhythmComplete, whisper?.length])

  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    `${frame.join('\n')}-${whisper?.join('\n') ?? ''}`,
  )

  return (
    <div
      className={`guide-preface-plate${rhythmActive ? ' guide-preface-plate--rhythm' : ''}`}
    >
      <p
        className={`guide-preface-kicker${rhythmActive ? ' guide-rhythm-index guide-rhythm-index--preface' : ''}`}
      >
        序
      </p>
      {rhythmSession ? (
        <>
          <GuideRhythmicLines
            lines={frame}
            mode="preface"
            active={rhythmActive}
            rhythmLocked={rhythmLocked}
            getLineClass={(_, lineIndex) =>
              lineIndex === 0 ? 'guide-preface-title' : 'guide-preface-subtitle'
            }
            accentBlockKind="prefaceFrame"
            onComplete={handleFrameComplete}
          />
          {whisper && whisper.length > 0 && (
            <div className="guide-preface-whisper">
              <GuideRhythmicLines
                lines={whisper}
                mode="preface"
                active={whisperReady && rhythmActive}
                rhythmLocked={rhythmLocked}
                getLineClass={() => 'guide-preface-whisper-line'}
                accentBlockKind="prefaceWhisper"
                onComplete={onRhythmComplete}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {frame.map((line, lineIndex) => (
            <p
              key={line}
              className={
                lineIndex === 0 ? 'guide-preface-title' : 'guide-preface-subtitle'
              }
            >
              {line}
            </p>
          ))}
          {whisper && whisper.length > 0 && (
            <div className="guide-preface-whisper">
              {whisper.map((line) => (
                <p key={line} className="guide-preface-whisper-line">
                  {line}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function GuidePrefaceNote({
  lines,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  lines: readonly string[]
} & RhythmProps) {
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    lines.join('\n'),
  )

  return (
    <div className="guide-preface-note">
      <span
        className={`guide-preface-note-mark${rhythmActive ? ' guide-rhythm-index guide-rhythm-index--preface' : ''}`}
        aria-hidden
      >
        片
      </span>
      <div className="guide-preface-note-body">
        {rhythmSession ? (
          <GuideRhythmicLines
            lines={lines}
            mode="preface"
            active={rhythmActive}
            rhythmLocked={rhythmLocked}
            getLineClass={() => 'guide-preface-note-line'}
            accentBlockKind="prefaceNote"
            onComplete={onRhythmComplete}
          />
        ) : (
          lines.map((line) => (
            <p key={line} className="guide-preface-note-line">
              {line}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

export function GuideStoryClose({
  lines,
  autoReading = false,
  rhythmActive = false,
  rhythmLocked = false,
  onRhythmComplete,
}: {
  lines: readonly string[]
} & RhythmProps) {
  const rhythmSession = useGuideRhythmSession(
    autoReading,
    rhythmActive,
    rhythmLocked,
    lines.join('\n'),
  )

  return (
    <div className="guide-spread-panel guide-spread-panel--enter guide-story-close">
      <div className="guide-spread-verse guide-story-close-verse">
        {rhythmSession ? (
          <GuideRhythmicLines
            lines={lines}
            mode="close"
            active={rhythmActive}
            rhythmLocked={rhythmLocked}
            getLineClass={() => 'guide-spread-body'}
            accentBlockKind="close"
            onComplete={onRhythmComplete}
          />
        ) : (
          lines.map((line) => (
            <p key={line} className="guide-spread-body">
              {line}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
