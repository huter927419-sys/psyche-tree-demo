/** 各篇意境 SVG 的玄意标注 — 让读者知其所指。 */
import type { Locale } from '../../i18n/locale'
import { resolveContentLocale } from '../../i18n/traditionalChinese'

export type GuideMotifMeta = {
  glyph: string
  title: string
  caption: string
  theme: string
}

const zhMotifMeta: Record<string, GuideMotifMeta> = {
  preface: {
    glyph: '序',
    title: '序',
    caption: '岸畔初启',
    theme: '雾尚未深',
  },
  tongguan: {
    glyph: '观',
    title: '同观',
    caption: '六问同照',
    theme: '路分而人远',
  },
  liubai: {
    glyph: '白',
    title: '留白',
    caption: '窗下余白',
    theme: '未删的对话框',
  },
  changye: {
    glyph: '夜',
    title: '长夜',
    caption: '长夜初啼',
    theme: '抱子至晓',
  },
  menpai: {
    glyph: '牌',
    title: '门牌',
    caption: '旧名牌',
    theme: '名去而人在',
  },
  huisheng: {
    glyph: '声',
    title: '回声',
    caption: '一语留存',
    theme: '回家吃饭',
  },
  qingchen: {
    glyph: '晨',
    title: '清晨',
    caption: '六点醒来',
    theme: '车过而不上',
  },
  yuanxing: {
    glyph: '行',
    title: '远行',
    caption: '一纸随身',
    theme: '泛黄的第一页',
  },
  liujuan: {
    glyph: '卷',
    title: '六卷',
    caption: '六向合观',
    theme: '此卷之后',
  },
}

const enMotifMeta: Record<string, GuideMotifMeta> = {
  preface: {
    glyph: '序',
    title: 'Prologue',
    caption: 'Shore awakens',
    theme: 'Mist not yet deep',
  },
  tongguan: {
    glyph: '观',
    title: 'Shared View',
    caption: 'Six questions, one gaze',
    theme: 'Paths part; people recede',
  },
  liubai: {
    glyph: '白',
    title: 'White Space',
    caption: 'Margin by the window',
    theme: 'The chat left open',
  },
  changye: {
    glyph: '夜',
    title: 'Long Night',
    caption: 'First cries at night',
    theme: 'Holding child till dawn',
  },
  menpai: {
    glyph: '牌',
    title: 'Nameplate',
    caption: 'The old nameplate',
    theme: 'Name gone; person remains',
  },
  huisheng: {
    glyph: '声',
    title: 'Echo',
    caption: 'One line kept',
    theme: 'Come home for dinner',
  },
  qingchen: {
    glyph: '晨',
    title: 'Early Morning',
    caption: 'Awake at six',
    theme: 'Bus passes; he does not board',
  },
  yuanxing: {
    glyph: '行',
    title: 'Long Journey',
    caption: 'One page in the pocket',
    theme: 'The yellowed first page',
  },
  liujuan: {
    glyph: '卷',
    title: 'Six Volumes',
    caption: 'Six facets, one view',
    theme: 'After the prologue',
  },
}

const jaMotifMeta: Record<string, GuideMotifMeta> = {
  preface: {
    glyph: '序',
    title: '序',
    caption: '岸辺の初啓',
    theme: '霧はまだ深くない',
  },
  tongguan: {
    glyph: '观',
    title: '同観',
    caption: '六つの問いを同照',
    theme: '路は分かれ人は遠ざかる',
  },
  liubai: {
    glyph: '白',
    title: '留白',
    caption: '窓辺の余白',
    theme: '消さないチャット',
  },
  changye: {
    glyph: '夜',
    title: '長夜',
    caption: '長夜の初啼',
    theme: '子を抱きて暁まで',
  },
  menpai: {
    glyph: '牌',
    title: '門牌',
    caption: '古い名札',
    theme: '名は去り人は在る',
  },
  huisheng: {
    glyph: '声',
    title: '回声',
    caption: '一言だけ残す',
    theme: '帰って食べよう',
  },
  qingchen: {
    glyph: '晨',
    title: '清晨',
    caption: '六時に醒める',
    theme: 'バスは過ぎて乗らない',
  },
  yuanxing: {
    glyph: '行',
    title: '遠行',
    caption: '一枚を身に',
    theme: '黄ばんだ最初の一頁',
  },
  liujuan: {
    glyph: '卷',
    title: '六巻',
    caption: '六向を合観',
    theme: '序のあと',
  },
}

const motifByContentLocale = {
  zh: zhMotifMeta,
  en: enMotifMeta,
  ja: jaMotifMeta,
} as const

export function getGuideMotifMeta(
  sectionId: string,
  locale: Locale = 'zh',
): GuideMotifMeta | undefined {
  const key = resolveContentLocale(locale)
  return motifByContentLocale[key][sectionId]
}

export function getGuideSectionTitle(
  sectionId: string,
  locale: Locale = 'zh',
): string | undefined {
  return getGuideMotifMeta(sectionId, locale)?.title
}

/** @deprecated Use getGuideMotifMeta(sectionId, locale) */
export const GUIDE_MOTIF_META = zhMotifMeta
