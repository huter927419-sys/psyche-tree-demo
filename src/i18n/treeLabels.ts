import type { BookId } from '../books/types'
import type { Locale } from './locale'

export interface ProgressLabelSet {
  stageLabels: Record<number, string>
  stageShort: string[]
  idleLabel: string
  awakeningTag: string
  fallbackLabel: string
}

const PSYCHE_TREE_ZH: ProgressLabelSet = {
  stageLabels: {
    1: '根域 · 玛尔库特 显现',
    2: '基座 · 耶索德 点亮',
    3: '流脉 · 霍德与 Netzach 展开',
    4: '心轮 · 提费雷特 苏醒',
    5: '平衡 · 切塞德与盖布拉 交汇',
    6: '智慧 · 比纳与霍克玛 浮现',
    7: '顶冠 · 凯特尔 圆满',
  },
  stageShort: ['根', '基', '脉', '心', '衡', '智', '冠'],
  idleLabel: '生命之树等待你的第一道光',
  awakeningTag: '光脉觉醒',
  fallbackLabel: '生命之树展开',
}

const PSYCHE_TREE_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Root · Malkuth emerging',
    2: 'Foundation · Yesod lit',
    3: 'Channels · Hod & Netzach opening',
    4: 'Heart · Tiferet awakening',
    5: 'Balance · Chesed & Gevurah meeting',
    6: 'Wisdom · Binah & Chokmah rising',
    7: 'Crown · Keter complete',
  },
  stageShort: ['Rt', 'Ys', 'Ch', 'H', 'Bl', 'Ws', 'Cr'],
  idleLabel: 'The Tree awaits your first light',
  awakeningTag: 'Light awakens',
  fallbackLabel: 'Tree unfolding',
}

const EMOTIONAL_FLOW_ZH: ProgressLabelSet = {
  stageLabels: {
    1: '涟漪 · 整体感受映起',
    2: '潜流 · 表达方式浮现',
    3: '交汇 · 联结慢慢显影',
    4: '潮汐 · 身感可被感知',
    5: '回稳 · 波动逐渐平息',
    6: '整合 · 多层感受交会',
    7: '映心 · 整幅慢慢成章',
  },
  stageShort: ['涟', '潜', '汇', '潮', '稳', '合', '映'],
  idleLabel: '雾中等待第一笔映痕',
  awakeningTag: '记忆展开',
  fallbackLabel: '映心渐明',
}

const EMOTIONAL_FLOW_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Ripple · whole feeling surfaces',
    2: 'Underflow · expression appears',
    3: 'Meeting · connection takes shape',
    4: 'Tide · body sense awakens',
    5: 'Return · waves settle',
    6: 'Integration · layers converge',
    7: 'Reflection · the picture forms',
  },
  stageShort: ['Rp', 'Uf', 'Mt', 'Td', 'Rs', 'In', 'Rf'],
  idleLabel: 'Waiting for the first trace in mist',
  awakeningTag: 'Memory unfolds',
  fallbackLabel: 'Heart reflects',
}

export function getProgressLabels(
  bookId: BookId,
  locale: Locale,
): ProgressLabelSet {
  if (bookId === 'emotional-flow') {
    return locale === 'en' ? EMOTIONAL_FLOW_EN : EMOTIONAL_FLOW_ZH
  }
  return locale === 'en' ? PSYCHE_TREE_EN : PSYCHE_TREE_ZH
}

/** Ambient background phrases — crossfade zh/en in the mist */
export const AMBIENT_PHRASES: Array<{ zh: string; en: string }> = [
  { zh: '光自顶冠落下', en: 'Light descends from the crown' },
  { zh: '根系汲取记忆', en: 'Roots drink memory' },
  { zh: '每一道光都是回答', en: 'Every light is an answer' },
  { zh: '雾中照见自己', en: 'See yourself in the mist' },
  { zh: '能量沿脉络上升', en: 'Energy rises through the paths' },
]
