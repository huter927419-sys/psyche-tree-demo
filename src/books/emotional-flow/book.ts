import type { CardOption } from '../../types'
import type { Locale } from '../../i18n/locale'
import type { BookDefinition } from '../types'
import {
  buildPsychologyPromptInput,
  generateMysticalFromSymbols,
  generatePsychologyProfile,
  type LevelDescriptions,
} from '../shared/profileHelpers'
import { buildEnDimensions } from './enDimensions'
import {
  enClosings,
  enMeta,
  enMysticalPromptTemplate,
  enMysticalSymbols,
  enOpenings,
  enPsychDescriptions,
  enResultChapterLabels,
} from './enBundle'

const card = (
  id: string,
  label: string,
  description: string,
  score: CardOption['score'],
  pattern: string,
): CardOption => ({ id, label, description, score, pattern })

const dimensions = [
  {
    id: 'flow-overall',
    dimensionIndex: 1,
    title: '整体情感流动',
    prompt: '当你感受最近的情感状态时，最像哪一种内在流动？',
    cards: [
      card('ef-calm-lake', '平静之湖', '情感如平静的湖水，内心较为安稳且清澈。', 2, 'still-lake'),
      card('ef-gushing-spring', '涌动之泉', '情感有自然涌动的活力，但较为温和可控。', 1, 'gushing-spring'),
      card('ef-wind-ripple', '风中涟漪', '情感偶尔起伏，像风吹过的水面。', -1, 'wind-ripple'),
      card('ef-torrent-river', '激流之河', '情感如激流，波动较大，较难平静。', -2, 'torrent-river'),
    ],
  },
  {
    id: 'flow-expression',
    dimensionIndex: 2,
    title: '情感表达方式',
    prompt: '当你需要表达内心情感时，最常出现的倾向是？',
    cards: [
      card('ef-soft-candle', '柔光之烛', '情感以温和、清晰的方式自然流露。', 2, 'soft-candle'),
      card('ef-resonance', '共振之光', '表达含蓄却真诚，像光与光之间的呼应。', 1, 'resonance-light'),
      card('ef-wind-leaf', '风中之叶', '表达随情境摇摆，时显时隐。', -1, 'wind-leaf-emotion'),
      card('ef-fog-walk', '雾中之行', '情感难以言说，更多留在内在迷雾里。', -2, 'fog-walk'),
    ],
  },
  {
    id: 'flow-connection',
    dimensionIndex: 3,
    title: '情感联结状态',
    prompt: '当他人的情感靠近你时，你的内在反应更像？',
    cards: [
      card('ef-warm-hands', '温暖之手', '愿意以开放与回应接纳情感的靠近。', 2, 'warm-hands'),
      card('ef-silk-bridge', '柔丝之桥', '在确认安全后，逐步加深情感交汇。', 1, 'silk-bridge'),
      card('ef-shield', '守护之盾', '保持一定距离，联结需要更多时间。', -1, 'shield'),
      card('ef-stars-gaze', '星河相望', '情感上保持距离，更习惯远观而非靠近。', -2, 'stars-gaze'),
    ],
  },
  {
    id: 'flow-body',
    dimensionIndex: 4,
    title: '情感身体感',
    prompt: '最近你的情感状态，在身体上最常体现为？',
    cards: [
      card('ef-steady-river', '稳流之河', '身体与情感协调，内在流动感平稳。', 2, 'steady-river'),
      card('ef-sensing', '感知之河', '能觉察身体信号，并与之温和对话。', 1, 'sensing-river'),
      card('ef-wind-cloud', '风中之云', '身体感时轻时重，随情绪云影飘动。', -1, 'wind-cloud'),
      card('ef-flexible-wind', '灵活之风', '身体常随情感波动，较难找到稳定落点。', -2, 'flexible-wind'),
    ],
  },
  {
    id: 'flow-recovery',
    dimensionIndex: 5,
    title: '波动与恢复',
    prompt: '当情感起伏出现时，你通常？',
    cards: [
      card('ef-still-mirror', '静湖之镜', '能较快回到内在平静，如湖面重归明镜。', 2, 'still-lake'),
      card('ef-mountain', '稳固之山', '先稳住核心，再让情感缓慢回落。', 1, 'stable-mountain'),
      card('ef-drift', '随缘之舟', '起伏后需要较长时间才能靠岸。', -1, 'drift-boat'),
      card('ef-fog-path', '雾中之径', '恢复路径不清，常在迷雾中徘徊。', -2, 'fog-path'),
    ],
  },
  {
    id: 'flow-change',
    dimensionIndex: 6,
    title: '变化中的情感',
    prompt: '面对关系或环境变化带来的情感浪潮，你？',
    cards: [
      card('ef-seed', '种子觉醒', '将变化视为情感成长与转化的契机。', 2, 'seed-awakening'),
      card('ef-bloom', '绽放之树', '在适应中保持希望，情感逐步舒展。', 1, 'bloom-tree'),
      card('ef-balance-boat', '平衡之舟', '在波动中努力维持平衡，但仍感吃力。', -1, 'balance-boat'),
      card('ef-cautious', '谨慎之山', '倾向收紧情感，以守护内在稳定。', -2, 'cautious-mountain'),
    ],
  },
  {
    id: 'flow-integration',
    dimensionIndex: 7,
    title: '情感整合',
    prompt: '对于复杂或矛盾的情感，你内在的处理方式更像？',
    cards: [
      card('ef-seeking-lamp', '寻找之灯', '能照亮混杂感受，逐步理清内在脉络。', 2, 'seeking-lamp'),
      card('ef-steady-path', '稳行之径', '以耐心整合不同面向，缓慢而坚定。', 1, 'steady-path'),
      card('ef-star-explorer', '星光探索者', '仍在探索中，尚未完全整合。', -1, 'star-explorer'),
      card('ef-deep-fog', '深雾之径', '矛盾情感交织，暂时难以归整。', -2, 'fog-path'),
    ],
  },
  {
    id: 'flow-trend',
    dimensionIndex: 8,
    title: '流动趋势',
    prompt: '若感受最近情感可能的走向，你直觉上更像？',
    cards: [
      card('ef-star-guide', '星河指引', '感到情感正朝向更清晰、更和谐的方向流动。', 2, 'star-guide'),
      card('ef-guardian', '守护之树', '趋势温和上升，根基渐稳，枝叶将展。', 1, 'guardian-tree'),
      card('ef-wind-leaf2', '随风之叶', '走向尚不明朗，随势漂流。', -1, 'wind-leaf'),
      card('ef-torrent2', '暗涌之河', '感到情感能量仍在暗涌，需更多关照。', -2, 'torrent-river'),
    ],
  },
]

const psychDescriptions: LevelDescriptions = {
  1: {
    high: '整体情感能量平稳清澈，如静湖映星，内在流动较为安定。',
    'mid-high': '情感有温和涌动的活力，总体可控，像泉水缓缓上升。',
    mid: '情感时起时落，如风吹涟漪，仍在寻找自己的节奏。',
    'mid-low': '情感波动偏频繁，恢复平静需要更多时间与空间。',
    low: '情感如激流奔涌，内在较难迅速归于安稳。',
  },
  2: {
    high: '您能以温和清晰的方式表达情感，内在与外在较为一致。',
    'mid-high': '表达含蓄而真诚，情感在合适时机会自然流露。',
    mid: '表达方式随情境变化，有时清晰，有时退入内在。',
    'mid-low': '情感表达较为困难，常停留在未说出的层面。',
    low: '情感多藏于雾中，表达路径尚不清晰。',
  },
  3: {
    high: '对他人的情感靠近持开放态度，联结中既有温度也有边界。',
    'mid-high': '在确认安全感后，愿意逐步加深情感交汇。',
    mid: '在靠近与守护之间摆动，联结方式因人因地而异。',
    'mid-low': '倾向保持心理距离，联结需要较长时间建立。',
    low: '情感上较为疏离，更习惯守护内在空间。',
  },
  4: {
    high: '身体与情感协调，能感知并善待身体的情感信号。',
    'mid-high': '对身体感受有一定觉察，并能与之温和对话。',
    mid: '身体感随情绪波动，稳定性时强时弱。',
    'mid-low': '情感常体现为身体的紧张或飘浮感，较难落地。',
    low: '身心之间的连结较弱，情感波动容易牵动整体状态。',
  },
  5: {
    high: '情感起伏后较快回归平静，恢复力较强。',
    'mid-high': '会先稳住核心，再让情感缓慢回落。',
    mid: '恢复速度因事件而异，有时快有时慢。',
    'mid-low': '起伏后需要较长时间才能感到重新站稳。',
    low: '情感波动后较难找到回到平静的路径。',
  },
  6: {
    high: '能将变化中的情感浪潮转化为成长与理解。',
    'mid-high': '在变化中保持适应，情感逐步找到新平衡。',
    mid: '对变化中的情感反应不一，仍在学习应对方式。',
    'mid-low': '变化易引发情感收紧或飘移，稳定感不足。',
    low: '面对变化时情感容易失控或冻结，适应路径尚模糊。',
  },
  7: {
    high: '能整合复杂情感，在矛盾中看见更完整的内在图景。',
    'mid-high': '以耐心梳理混杂感受，逐步走向内在一致。',
    mid: '整合能力时强时弱，复杂情感仍偶有拉扯。',
    'mid-low': '矛盾情感常并存，尚未找到清晰的内在秩序。',
    low: '复杂感受交织成雾，暂时难以归整与命名。',
  },
  8: {
    high: '直觉上感到情感正朝向更清晰、更和谐的方向流动。',
    'mid-high': '趋势温和向好，根基渐稳，仍有展开空间。',
    mid: '走向尚不明朗，在观察与等待中感受变化。',
    'mid-low': '感到情感仍在漂游，方向感偏弱。',
    low: '直觉上情感暗涌未平，需要更多自我关照。',
  },
}

const mysticalSymbols: LevelDescriptions = {
  1: {
    high: '情感如静湖，生命之树下映出整片星光，流动缓慢而透明。',
    'mid-high': '泉水自根处涌出，银线沿树干上升，活力温和而不惊扰。',
    mid: '风过湖面，涟漪轻起，您的情感之流正在寻找自己的形状。',
    'mid-low': '河面风急，树影摇曳，平静仍在深处等待被触及。',
    low: '激流穿石，情感能量奔涌——请记得河流终将汇入更宽阔的海。',
  },
  2: {
    high: '柔光自枝梢滴落，您的表达如丝如星，真诚而清晰。',
    'mid-high': '共振之光在叶与叶之间传递，话语不多，却彼此照亮。',
    mid: '叶随风转，表达时近时远，内在仍在选择合适的声音。',
    'mid-low': '雾中行步，未说之语如薄雾缠绕枝梢。',
    low: '情感藏于深雾，等待一盏灯、一次呼吸、一次向内的倾听。',
  },
  3: {
    high: '温暖之手与柔丝之桥同时显现，联结在树脉间轻轻脉动。',
    'mid-high': '丝线缓缓延伸，跨越距离，在确认中织就信任。',
    mid: '星河相望，靠近与距离如双轨并行，各有其神圣。',
    'mid-low': '盾牌护心，联结之门半掩，等待合适的温度。',
    low: '远星相望，守护本身亦是情感智慧的一种面容。',
  },
  4: {
    high: '稳流之河与树干同频，身心如根与枝，彼此呼应。',
    'mid-high': '感知之河绕根而行，身体的声音被温柔听见。',
    mid: '云影掠过枝头，身体与情感在天光下交替显影。',
    'mid-low': '风叶无根，身心尚需更多时间找到同一节拍。',
    low: '激流牵动全身，请先向大地与根系索取一次深呼吸。',
  },
  5: {
    high: '静湖重归镜面，波动如暮光中的叶，轻轻归位。',
    'mid-high': '山峰不动，潮涌自退，恢复如年轮缓慢闭合。',
    mid: '潮汐有涨有落，您的恢复力正在季节中成熟。',
    'mid-low': '小舟迟归，请允许自己多泊一会儿岸。',
    low: '雾径漫长，但每向前一步，都在情感之树上留下光痕。',
  },
  6: {
    high: '种子破土，变化成为情感树上新芽的养分。',
    'mid-high': '枝展向光，适应如慢镜头中的生长。',
    mid: '云行风随，变化既带来释放也带来不确定。',
    'mid-low': '山守不动，情感暂收，等待更清晰的季节。',
    low: '暗潮未平，变化正在召唤更深层的自我对话。',
  },
  7: {
    high: '寻灯者照亮交错丝线，矛盾在光中化为完整图案。',
    'mid-high': '稳径延伸，整合如路径在根间慢慢显形。',
    mid: '星路分叉，您仍在夜空中辨认属于自己的那一束光。',
    'mid-low': '深雾中多种感受并存，整合尚需时日。',
    low: '迷雾织网，请相信树脉终将牵引您走出纠缠。',
  },
  8: {
    high: '星河指引前方，情感之流将趋向更清澈的开阔地。',
    'mid-high': '守护之树展枝，趋势温和上升，根脉渐深。',
    mid: '叶随风去，走向未定时，观察本身即是修行。',
    'mid-low': '暗涌在河底，趋势尚在积聚，需要耐心与关照。',
    low: '激流未息，请先以静湖为愿，而非以急流为罚。',
  },
}

const openings = [
  '在生命之树的静默中，您的情感之流如银色河脉缓缓显影。',
  '河流、星光与丝线交织成一幅内在地图——以下是您当前情感能量的流动图景。',
  '如古老智慧在低语，情感并非风暴或静止，而是树与河之间永恒的对话。',
]

const closings = [
  '愿您以温柔注视自己的情感之流——它不急于抵达，却始终在流动。',
  '河流不会催促自己的方向，树不会责备叶子的飘落。您的节奏，自有神圣的时间。',
  '当下一阵风吹过枝梢，请记得：每一次感受，都是情感之树在生长。',
]

const mysticalPromptTemplate = `你是一位擅长意象与象征的心理学写作者。
请根据以下心理学情感画像，用温柔而诗意的语言进行整合性描述。
可使用河流、星光、丝线、雾、光等象征元素，但避免预言或命运论断。
重点描述当前情感状态的多维面向，以及可能的自我关照方向。
不要直接说"你的选择是XX"，而是描述情感状态与内在体验。
心理学情感画像：
[PSYCHOLOGY]
请生成一段连贯的情感整合描述。`

export const emotionalFlowBook: BookDefinition = {
  meta: {
    id: 'emotional-flow',
    shelfTitle: '映心',
    coverTitle: '映心',
    coverSubtitle: '八维情感',
    coverTagline: '照见此刻感受',
    coverHint:
      '每一页映照一种情感面向；翻页之间，只是记录此刻的内在状态，不含评判。',
    spineLabel: '映心',
    accent: 'silver',
    dimensionCount: 8,
    treeProgressMax: 7,
    hasAttentionChecks: false,
  },
  questions: dimensions.map((d) => ({ type: 'dimension' as const, ...d })),
  generatePsychologyProfile: (dims) =>
    generatePsychologyProfile(dims, psychDescriptions),
  buildPsychologyPromptInput: (dims) =>
    buildPsychologyPromptInput(dims, psychDescriptions),
  generateMysticalReading: (dims) =>
    generateMysticalFromSymbols(dims, mysticalSymbols, openings, closings),
  buildMysticalPrompt: (input) =>
    mysticalPromptTemplate.replace('[PSYCHOLOGY]', input),
  resultChapterLabels: ['终章 · 情感画像', '终章 · 整合描述', '封底 · 合卷'],
}

export function createEmotionalFlowBook(locale: Locale): BookDefinition {
  if (locale === 'zh') return emotionalFlowBook

  const enDimensions = buildEnDimensions()
  return {
    meta: enMeta,
    questions: enDimensions.map((d) => ({ type: 'dimension' as const, ...d })),
    generatePsychologyProfile: (dims) =>
      generatePsychologyProfile(dims, enPsychDescriptions),
    buildPsychologyPromptInput: (dims) =>
      buildPsychologyPromptInput(dims, enPsychDescriptions),
    generateMysticalReading: (dims) =>
      generateMysticalFromSymbols(dims, enMysticalSymbols, enOpenings, enClosings),
    buildMysticalPrompt: (input) =>
      enMysticalPromptTemplate.replace('[PSYCHOLOGY]', input),
    resultChapterLabels: enResultChapterLabels,
  }
}
