import { useId, type ReactElement } from 'react'
import { getGuideMotifMeta } from '../../books/guide/guideMotifMeta'

export type GuideMotifVariant = 'ambient' | 'echo' | 'preface'

const INK = '#d4c9b8'
const PAPER = '#e8dfd0'
const INK_STRONG = '#e8dfd0'

function MotifGlyph({
  char,
  opacity = 0.1,
  size = 108,
}: {
  char: string
  opacity?: number
  size?: number
}) {
  return (
    <text
      x="180"
      y="248"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={size}
      fill={PAPER}
      fillOpacity={opacity}
      fontFamily="var(--font-mystic-zh), 'Songti SC', serif"
      fontWeight="400"
    >
      {char}
    </text>
  )
}

function MotifShell({
  children,
  variant,
  sectionId,
  showCaption = false,
}: {
  children: React.ReactNode
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  const meta = getGuideMotifMeta(sectionId)

  return (
    <div
      className={`guide-story-motif guide-story-motif--${variant}`}
      role="img"
      aria-label={
        meta ? `${meta.title} · ${meta.caption} · ${meta.theme}` : '篇章意境'
      }
    >
      {children}
      {showCaption && meta && (
        <div className="guide-story-motif-caption">
          <p className="guide-story-motif-caption-title">{meta.title}</p>
          <p className="guide-story-motif-caption-theme">{meta.caption}</p>
          <p className="guide-story-motif-caption-whisper">{meta.theme}</p>
        </div>
      )}
    </div>
  )
}

function PrefaceMotif({
  uid,
  sectionId,
  showCaption,
}: {
  uid: string
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell variant="preface" sectionId={sectionId} showCaption={showCaption}>
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <defs>
          <radialGradient id={`${uid}-mist`} cx="50%" cy="68%" r="62%">
            <stop offset="0%" stopColor={PAPER} stopOpacity="0.18" />
            <stop offset="100%" stopColor={PAPER} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height="480" fill={`url(#${uid}-mist)`} />
        <MotifGlyph char="序" opacity={0.09} />
        <path
          d="M40 360 Q180 300 320 360"
          stroke={INK}
          strokeOpacity="0.32"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          d="M80 390 Q180 340 280 390"
          stroke={INK}
          strokeOpacity="0.18"
          fill="none"
          strokeWidth="1"
        />
        {[120, 180, 240].map((x) => (
          <circle
            key={x}
            cx={x}
            cy={180 - (x % 40)}
            r="2.5"
            fill={INK_STRONG}
            fillOpacity="0.42"
          />
        ))}
      </svg>
    </MotifShell>
  )
}

function TongguanMotif({
  variant,
  sectionId,
  showCaption,
}: {
  uid: string
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  const fade = variant === 'echo' ? 0.55 : 1
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg
        viewBox="0 0 360 480"
        className="guide-story-motif-svg"
        style={{ opacity: fade }}
      >
        <MotifGlyph char="观" opacity={variant === 'echo' ? 0.06 : 0.1} />
        <path
          d="M180 80 L180 400"
          stroke={INK}
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        <path
          d="M180 220 Q80 280 60 380"
          stroke={INK}
          strokeOpacity="0.38"
          fill="none"
          strokeWidth="1.8"
        />
        <path
          d="M180 220 Q280 280 300 380"
          stroke={INK}
          strokeOpacity="0.38"
          fill="none"
          strokeWidth="1.8"
        />
        <path
          d="M180 220 Q120 320 100 420"
          stroke={INK}
          strokeOpacity="0.18"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M180 220 Q240 320 260 420"
          stroke={INK}
          strokeOpacity="0.18"
          fill="none"
          strokeWidth="1"
        />
        <circle cx="180" cy="200" r="5" fill={INK_STRONG} fillOpacity="0.5" />
        <circle cx="60" cy="380" r="3" fill={INK_STRONG} fillOpacity="0.3" />
        <circle cx="300" cy="380" r="3" fill={INK_STRONG} fillOpacity="0.3" />
      </svg>
    </MotifShell>
  )
}

function LiubaiMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="白" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <rect
          x="90"
          y="100"
          width="180"
          height="240"
          fill="none"
          stroke={INK}
          strokeOpacity="0.34"
          strokeWidth="1.8"
        />
        <line
          x1="90"
          y1="220"
          x2="270"
          y2="220"
          stroke={INK}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <rect x="110" y="130" width="140" height="170" fill="#2a2622" fillOpacity="0.42" />
        <rect x="145" y="330" width="70" height="7" rx="2" fill={INK} fillOpacity="0.2" />
        <rect
          x="220"
          y="360"
          width="48"
          height="34"
          rx="4"
          fill="none"
          stroke={INK}
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <ellipse cx="244" cy="377" rx="10" ry="4" fill={INK} fillOpacity="0.14" />
      </svg>
    </MotifShell>
  )
}

function ChangyeMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="夜" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <circle cx="180" cy="58" r="20" fill={PAPER} fillOpacity="0.1" stroke={INK} strokeOpacity="0.2" />
        <rect
          x="110"
          y="70"
          width="140"
          height="280"
          fill="#1e1c22"
          fillOpacity="0.55"
          stroke={INK}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <rect x="165" y="110" width="30" height="80" fill={PAPER} fillOpacity="0.14" />
        <path
          d="M130 360 Q180 330 230 360"
          stroke={INK}
          strokeOpacity="0.2"
          fill="none"
          strokeWidth="1"
        />
        <ellipse cx="180" cy="390" rx="42" ry="9" fill={INK} fillOpacity="0.1" />
      </svg>
    </MotifShell>
  )
}

function MenpaiMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="牌" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <rect x="70" y="340" width="220" height="8" fill={INK} fillOpacity="0.1" />
        <rect
          x="105"
          y="170"
          width="150"
          height="56"
          rx="3"
          fill="#2a2622"
          stroke={INK}
          strokeOpacity="0.38"
          strokeWidth="1.5"
        />
        <line x1="130" y1="200" x2="230" y2="200" stroke={INK_STRONG} strokeOpacity="0.28" strokeWidth="1.2" />
        <line x1="150" y1="186" x2="210" y2="186" stroke={INK} strokeOpacity="0.14" strokeWidth="1" />
        <path
          d="M180 226 L180 300"
          stroke={INK}
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="2 5"
        />
      </svg>
    </MotifShell>
  )
}

function HuishengMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="声" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <rect
          x="120"
          y="120"
          width="120"
          height="220"
          rx="22"
          fill="#222018"
          stroke={INK}
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <circle cx="180" cy="210" r="30" fill="none" stroke={INK} strokeOpacity="0.28" strokeWidth="1.5" />
        <path d="M168 210 L180 196 L192 210 L180 222 Z" fill={INK} fillOpacity="0.2" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${228 + i * 14} ${200 - i * 8} Q${250 + i * 10} 210 ${228 + i * 14} ${220 + i * 8}`}
            stroke={INK}
            strokeOpacity={0.28 - i * 0.06}
            fill="none"
            strokeWidth="1.2"
          />
        ))}
      </svg>
    </MotifShell>
  )
}

function QingchenMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="晨" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <path d="M40 280 L320 280" stroke={INK} strokeOpacity="0.2" strokeWidth="2" />
        <rect
          x="150"
          y="200"
          width="60"
          height="80"
          fill="none"
          stroke={INK}
          strokeOpacity="0.26"
          strokeWidth="1.5"
        />
        <ellipse cx="120" cy="250" rx="22" ry="30" fill="#3a4a32" fillOpacity="0.4" />
        <ellipse cx="180" cy="240" rx="18" ry="26" fill="#4a5a3a" fillOpacity="0.45" />
        <ellipse cx="240" cy="252" rx="20" ry="28" fill="#3a4a32" fillOpacity="0.4" />
        <path d="M60 120 Q180 80 300 110" stroke={PAPER} strokeOpacity="0.16" fill="none" strokeWidth="1.5" />
      </svg>
    </MotifShell>
  )
}

function YuanxingMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="行" opacity={variant === 'echo' ? 0.05 : 0.09} />
        <rect
          x="95"
          y="110"
          width="170"
          height="230"
          fill={PAPER}
          fillOpacity="0.06"
          stroke={INK}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="115"
            y1={150 + i * 36}
            x2={245 - i * 15}
            y2={150 + i * 36}
            stroke={INK}
            strokeOpacity={0.14 - i * 0.02}
            strokeWidth="1"
          />
        ))}
        <path d="M260 340 Q180 370 100 340" stroke={INK} strokeOpacity="0.18" fill="none" strokeWidth="1" />
        <path d="M280 100 Q300 140 270 170" stroke={INK} strokeOpacity="0.22" fill="none" strokeWidth="1.2" />
      </svg>
    </MotifShell>
  )
}

function LiujuanMotif({
  variant,
  sectionId,
  showCaption,
}: {
  variant: GuideMotifVariant
  sectionId: string
  showCaption?: boolean
}) {
  const points = [
    [120, 200],
    [180, 170],
    [240, 200],
    [150, 260],
    [210, 260],
    [180, 310],
  ]
  return (
    <MotifShell
      variant={variant}
      sectionId={sectionId}
      showCaption={showCaption}
    >
      <svg viewBox="0 0 360 480" className="guide-story-motif-svg">
        <MotifGlyph char="卷" opacity={variant === 'echo' ? 0.05 : 0.09} size={96} />
        <ellipse cx="180" cy="240" rx="130" ry="80" fill={PAPER} fillOpacity="0.05" />
        {points.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="16"
            fill="none"
            stroke={INK}
            strokeOpacity={0.28 - (i % 3) * 0.04}
            strokeWidth="1.3"
          />
        ))}
        <circle cx="180" cy="240" r="5" fill={INK_STRONG} fillOpacity="0.4" />
      </svg>
    </MotifShell>
  )
}

const MOTIF_BY_SECTION: Record<
  string,
  (props: {
    uid: string
    variant: GuideMotifVariant
    sectionId: string
    showCaption?: boolean
  }) => ReactElement
> = {
  preface: PrefaceMotif,
  tongguan: TongguanMotif,
  liubai: LiubaiMotif,
  changye: ChangyeMotif,
  menpai: MenpaiMotif,
  huisheng: HuishengMotif,
  qingchen: QingchenMotif,
  yuanxing: YuanxingMotif,
  liujuan: LiujuanMotif,
}

export function GuideStoryMotif({
  sectionId,
  variant = 'ambient',
  showCaption,
}: {
  sectionId: string
  variant?: GuideMotifVariant
  /** 独立意境页显示篇名标注；背景 echo 默认不显示 */
  showCaption?: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const Motif = MOTIF_BY_SECTION[sectionId]
  if (!Motif) return null
  const captionVisible =
    showCaption ?? (variant === 'ambient' || variant === 'preface')
  return (
    <Motif
      uid={uid}
      variant={variant}
      sectionId={sectionId}
      showCaption={captionVisible}
    />
  )
}

export function sectionMotifId(sectionId: string): string {
  return sectionId
}
