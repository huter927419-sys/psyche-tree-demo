import type { BookId } from '../books/types'
import type { Locale } from './locale'
import { convertStringsDeep, resolveContentLocale } from './traditionalChinese'

export interface ProgressLabelSet {
  stageLabels: Record<number, string>
  stageShort: string[]
  idleLabel: string
  awakeningTag: string
  fallbackLabel: string
}

const stage = (
  zh: Record<number, string>,
  short: string[],
  idle: string,
  awakening: string,
  fallback: string,
): ProgressLabelSet => ({
  stageLabels: zh,
  stageShort: short,
  idleLabel: idle,
  awakeningTag: awakening,
  fallbackLabel: fallback,
})

const PSYCHE_TREE_ZH = stage(
  {
    1: '界石 · 自我之垣显现',
    2: '映波 · 心湖起纹',
    3: '定息 · 波澜归处',
    4: '自照 · 镜面积光',
    5: '内守 · 树心自持',
    6: '根息 · 源在暗土',
  },
  ['界', '波', '息', '照', '守', '根'],
  '心象等待你的第一印',
  '内印觉醒',
  '心象渐明',
)

const PSYCHE_TREE_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Boundary · wall of self',
    2: 'Ripple · lake stirs',
    3: 'Still breath · waves rest',
    4: 'Mirror · inner light',
    5: 'Guard · tree-heart holds',
    6: 'Root · source in dark soil',
  },
  stageShort: ['Bd', 'Rp', 'St', 'Mr', 'Gd', 'Rt'],
  idleLabel: 'Mindscape awaits your first seal',
  awakeningTag: 'Inner seal awakens',
  fallbackLabel: 'Mindscape unfolding',
}

const EMOTIONAL_FLOW_ZH = stage(
  {
    1: '流势 · 整体感受映起',
    2: '流言 · 表达方式浮现',
    3: '流联 · 联结慢慢显影',
    4: '流身 · 身感可被感知',
    5: '流息 · 波动逐渐平息',
    6: '流变 · 变化中的情感',
  },
  ['势', '言', '联', '身', '息', '变'],
  '映心等待第一笔映痕',
  '情脉展开',
  '映心渐明',
)

const EMOTIONAL_FLOW_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Current · whole feeling',
    2: 'Word · expression',
    3: 'Bond · connection',
    4: 'Body · felt sense',
    5: 'Rest · waves settle',
    6: 'Change · feeling shifts',
  },
  stageShort: ['Cu', 'Wd', 'Bd', 'By', 'Rs', 'Ch'],
  idleLabel: 'Heart Mirror awaits the first trace',
  awakeningTag: 'Feeling unfolds',
  fallbackLabel: 'Heart reflects',
}

const MIND_LIGHT_ZH = stage(
  {
    1: '思流 · 脉动初显',
    2: '学纹 · 新知入门',
    3: '专镜 · 一念久照',
    4: '辨光 · 影落有序',
    5: '创泉 · 点子涌动',
    6: '择印 · 印将落纸',
  },
  ['流', '学', '专', '辨', '创', '择'],
  '明思等待第一道光',
  '思脉觉醒',
  '明思渐亮',
)

const MIND_LIGHT_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Flow · thought moves',
    2: 'Learn · new pattern',
    3: 'Focus · mirror holds',
    4: 'Discern · light in order',
    5: 'Spring · ideas rise',
    6: 'Choose · seal falls',
  },
  stageShort: ['Fl', 'Ln', 'Fc', 'Ds', 'Sp', 'Ch'],
  idleLabel: 'Mind Light awaits the first ray',
  awakeningTag: 'Mind-path awakens',
  fallbackLabel: 'Mind light grows',
}

const BOND_THREAD_ZH = stage(
  {
    1: '丝近 · 靠近与退守',
    2: '丝温 · 情温传递',
    3: '丝距 · 距中有温',
    4: '丝信 · 信任渐织',
    5: '丝守 · 界石与桥',
    6: '丝复 · 断处再织',
  },
  ['近', '温', '距', '信', '守', '复'],
  '缘书等待第一缕丝',
  '缘丝展开',
  '缘书渐明',
)

const BOND_THREAD_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Near · approach and retreat',
    2: 'Warm · thread of warmth',
    3: 'Distance · space between',
    4: 'Trust · weave of faith',
    5: 'Guard · stone and bridge',
    6: 'Repair · thread rewoven',
  },
  stageShort: ['Nr', 'Wm', 'Ds', 'Tr', 'Gd', 'Rp'],
  idleLabel: 'Bond Book awaits the first thread',
  awakeningTag: 'Thread unfolds',
  fallbackLabel: 'Bond weaves',
}

const FLOW_BALANCE_ZH = stage(
  {
    1: '分力 · 能量之流',
    2: '守源 · 厚土护根',
    3: '雾行 · 雾中有步',
    4: '急缓 · 节奏自调',
    5: '转势 · 舵在中流',
    6: '定舟 · 压下不覆',
  },
  ['分', '源', '雾', '缓', '转', '舟'],
  '流衡等待第一记水纹',
  '中流觉醒',
  '流衡渐定',
)

const FLOW_BALANCE_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Split · force divides',
    2: 'Source · guard the well',
    3: 'Mist · steps in fog',
    4: 'Pace · haste and pause',
    5: 'Turn · rudder midstream',
    6: 'Boat · hold under pressure',
  },
  stageShort: ['Sp', 'Sr', 'Ms', 'Pc', 'Tn', 'Bt'],
  idleLabel: 'Flow Balance awaits the first ripple',
  awakeningTag: 'Current steadies',
  fallbackLabel: 'Balance forms',
}

const DIRECTION_LIGHT_ZH = stage(
  {
    1: '光向 · 方向初感',
    2: '光义 · 所重所轻',
    3: '步履 · 步跟光行',
    4: '共振 · 行动同频',
    5: '持愿 · 愿不轻灭',
    6: '探径 · 小步试光',
  },
  ['向', '义', '步', '振', '愿', '探'],
  '向光等待第一束光',
  '光径觉醒',
  '向光渐明',
)

const DIRECTION_LIGHT_EN: ProgressLabelSet = {
  stageLabels: {
    1: 'Beam · sense of direction',
    2: 'Meaning · weight of value',
    3: 'Step · walk with light',
    4: 'Resonance · action aligns',
    5: 'Vow · flame held',
    6: 'Probe · test the path',
  },
  stageShort: ['Bm', 'Mn', 'St', 'Rs', 'Vw', 'Pb'],
  idleLabel: 'Path Light awaits the first beam',
  awakeningTag: 'Path awakens',
  fallbackLabel: 'Light gathers',
}

const PSYCHE_TREE_JA: ProgressLabelSet = {
  stageLabels: {
    1: '界石 · 自我の垣',
    2: '映波 · 心湖に紋',
    3: '定息 · 波の帰处',
    4: '自照 · 鏡面に光',
    5: '内守 · 樹心を持',
    6: '根息 · 暗土に源',
  },
  stageShort: ['界', '波', '息', '照', '守', '根'],
  idleLabel: '心象は最初の印を待つ',
  awakeningTag: '内印覚醒',
  fallbackLabel: '心象漸明',
}

const EMOTIONAL_FLOW_JA: ProgressLabelSet = {
  stageLabels: {
    1: '流勢 · 全体の感映',
    2: '流言 · 表現の浮上',
    3: '流聯 · 結びの顕影',
    4: '流身 · 体感の知覚',
    5: '流息 · 波の鎮静',
    6: '流変 · 変化する情',
  },
  stageShort: ['勢', '言', '聯', '身', '息', '変'],
  idleLabel: '映心は最初の映痕を待つ',
  awakeningTag: '情脈展開',
  fallbackLabel: '映心漸明',
}

const MIND_LIGHT_JA: ProgressLabelSet = {
  stageLabels: {
    1: '思流 · 脈動初顕',
    2: '学紋 · 新知の入門',
    3: '専鏡 · 一念久照',
    4: '辨光 · 影落有序',
    5: '創泉 · 点子湧動',
    6: '擇印 · 印落紙上',
  },
  stageShort: ['流', '学', '専', '辨', '創', '擇'],
  idleLabel: '明思は最初の光を待つ',
  awakeningTag: '思脈覚醒',
  fallbackLabel: '明思漸亮',
}

const BOND_THREAD_JA: ProgressLabelSet = {
  stageLabels: {
    1: '糸近 · 近さと退守',
    2: '糸温 · 情温の伝達',
    3: '糸距 · 距の中の温',
    4: '糸信 · 信頼の織',
    5: '糸守 · 界石と橋',
    6: '糸復 · 断处再織',
  },
  stageShort: ['近', '温', '距', '信', '守', '復'],
  idleLabel: '縁書は最初の糸を待つ',
  awakeningTag: '縁糸展開',
  fallbackLabel: '縁書漸明',
}

const FLOW_BALANCE_JA: ProgressLabelSet = {
  stageLabels: {
    1: '分力 · エネルギーの流',
    2: '守源 · 厚土護根',
    3: '霧行 · 霧の中の歩',
    4: '急緩 · リズム自調',
    5: '転勢 · 舵在中流',
    6: '定舟 · 圧下不覆',
  },
  stageShort: ['分', '源', '霧', '緩', '転', '舟'],
  idleLabel: '流衡は最初の水紋を待つ',
  awakeningTag: '中流覚醒',
  fallbackLabel: '流衡漸定',
}

const DIRECTION_LIGHT_JA: ProgressLabelSet = {
  stageLabels: {
    1: '光向 · 方向初感',
    2: '光義 · 重きと軽き',
    3: '步履 · 歩光同行',
    4: '共振 · 行動同頻',
    5: '持願 · 願軽滅せず',
    6: '探径 · 小歩試光',
  },
  stageShort: ['向', '義', '步', '振', '願', '探'],
  idleLabel: '向光は最初の光を待つ',
  awakeningTag: '光径覚醒',
  fallbackLabel: '向光漸明',
}

const LABELS: Record<
  BookId,
  Record<'zh' | 'en' | 'ja', ProgressLabelSet>
> = {
  'psyche-tree': { zh: PSYCHE_TREE_ZH, en: PSYCHE_TREE_EN, ja: PSYCHE_TREE_JA },
  'emotional-flow': { zh: EMOTIONAL_FLOW_ZH, en: EMOTIONAL_FLOW_EN, ja: EMOTIONAL_FLOW_JA },
  'mind-light': { zh: MIND_LIGHT_ZH, en: MIND_LIGHT_EN, ja: MIND_LIGHT_JA },
  'bond-thread': { zh: BOND_THREAD_ZH, en: BOND_THREAD_EN, ja: BOND_THREAD_JA },
  'flow-balance': { zh: FLOW_BALANCE_ZH, en: FLOW_BALANCE_EN, ja: FLOW_BALANCE_JA },
  'direction-light': { zh: DIRECTION_LIGHT_ZH, en: DIRECTION_LIGHT_EN, ja: DIRECTION_LIGHT_JA },
}


export function getProgressLabels(
  bookId: BookId,
  locale: Locale,
): ProgressLabelSet {
  const labels = LABELS[bookId][resolveContentLocale(locale)]
  return locale === 'zhTw' ? convertStringsDeep(labels) : labels
}

export const AMBIENT_PHRASES: Array<{ zh: string; en: string; ja: string }> = [
  { zh: '六卷各照一面', en: 'Six volumes, six facets', ja: '六巻各一面を映す' },
  { zh: '光自顶冠落下', en: 'Light descends from the crown', ja: '光は頂冠から降りる' },
  { zh: '每一道光都是回答', en: 'Every light is an answer', ja: '一筋の光も答えである' },
  { zh: '雾中照见自己', en: 'See yourself in the mist', ja: '霧の中で自分を照見せよ' },
  { zh: '择一卷，向内探索', en: 'Choose one volume; turn inward', ja: '一巻を選び、内へ探れ' },
  { zh: '雾只收诚心，不收戏语', en: 'Mist receives sincerity, not jest', ja: '霧は誠心のみを受け、戯言を受けない' },
  { zh: '先静后感，再择光印', en: 'Be still, feel, then choose', ja: '先に静め、感じ、光印を選ぶ' },
  { zh: '不断优劣，只在雾中留痕', en: 'No ranking—only a trace in mist', ja: '優劣を断たず、霧に痕を残す' },
  { zh: '树与雾皆不催促', en: 'Tree and mist do not hurry you', ja: '樹も霧も急がせない' },
  { zh: '心流不追分，场域方不散', en: 'Flow, not scoring, keeps the field', ja: '心流は点数を追わず、場域を保つ' },
  { zh: '神谕呼应诸卷，不推翻已示', en: 'Oracles echo volumes; never overturn', ja: '神託は諸巻と呼应し、既示を否定しない' },
  { zh: '灵息涨落，如湖起纹', en: 'Spirit-breath rises and falls like ripples', ja: '霊息の涨落、湖の紋の如し' },
  { zh: '翻开即入卷场', en: 'Open a volume; enter its field', ja: '開けば巻場に入る' },
]
