/** 各篇意境 SVG 的玄意标注 — 让读者知其所指。 */
export type GuideMotifMeta = {
  glyph: string
  title: string
  caption: string
  theme: string
}

export const GUIDE_MOTIF_META: Record<string, GuideMotifMeta> = {
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
    theme: '八片刻之后',
  },
}

export function getGuideMotifMeta(sectionId: string): GuideMotifMeta | undefined {
  return GUIDE_MOTIF_META[sectionId]
}

export function getGuideSectionTitle(sectionId: string): string | undefined {
  return GUIDE_MOTIF_META[sectionId]?.title
}
