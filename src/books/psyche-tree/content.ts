import type { LocalizedBookPack } from '../shared/createBook'
import { card } from '../shared/card'
import type { LevelDescriptions } from '../shared/profileHelpers'

const psychDescriptions: LevelDescriptions = {
  1: {
    high: '您较能守护内在空间，在靠近与退守之间自有界石，不被轻易牵动。',
    'mid-high': '您会保留边界，也在信任中逐步敞开，界石与门扉并存。',
    mid: '内在空间的开阖随情境而变，有时近、有时远。',
    'mid-low': '界石偏紧，您较常先退守以护心。',
    low: '内在空间较易被打扰，界石尚在寻觅更稳的位置。',
  },
  2: {
    high: '心湖起纹时，您较能先照见波动，而不立刻被浪带走。',
    'mid-high': '您会觉察情绪之纹，再决定如何回应。',
    mid: '映波时明时隐，觉察与卷入交替出现。',
    'mid-low': '波动常先于照见，需片刻才能辨认纹路。',
    low: '心湖多被浪先占据，映波的能力仍在养成。',
  },
  3: {
    high: '波动之后，您较能令湖静、守火或柔光自返，定息有归处。',
    'mid-high': '您会先稳住核心，再让内在慢慢沉定。',
    mid: '定息随境而异，有时快、有时需时。',
    'mid-low': '归息之路偏长，波动后需更多耐心。',
    low: '定息之所有时难寻，叶仍逐风而行。',
  },
  4: {
    high: '您较常以静湖自照，辨认内在真实，而不急于向外求证。',
    'mid-high': '自照时诚时缓，仍能看见心底微光。',
    mid: '自照与迷雾交替，真相时清时渺。',
    'mid-low': '镜面积尘，自照需更多息与耐心。',
    low: '自照少行，内在景象仍多在雾中。',
  },
  5: {
    high: '您较能内守核心，不被外风轻易摇散，如树心自持。',
    'mid-high': '内守与开放并存，先护后展。',
    mid: '内守时紧时松，随压力而变。',
    'mid-low': '外扰易入，内守需刻意召回。',
    low: '内守之垣尚薄，心易随境飘移。',
  },
  6: {
    high: '您较能感根息之稳，内在有源，如根深扎于暗土。',
    'mid-high': '根息渐显，虽偶有风，仍能回源。',
    mid: '根息时感时失，仍在辨认自己的源。',
    'mid-low': '根息偏浅，易觉浮于表面。',
    low: '根息未明，如舟暂泊，源仍在深处等待。',
  },
  7: {
    high: '诸力交汇时，整象偏稳——界、湖、根彼此呼应，如树影完整。',
    'mid-high': '整象渐明，自我诸面向大体同向。',
    mid: '整象仍在成形，诸印时有张力。',
    'mid-low': '整象偏散，诸力尚未归一。',
    low: '整象如雾，自我诸面仍待更清晰的照见。',
  },
}

const mysticalSymbols: LevelDescriptions = {
  1: {
    high: '界石立于心湖之畔，内外分明，却不拒光。',
    'mid-high': '界石与柔桥并存，门扉半开，候合适之温。',
    mid: '界石时移，开阖如潮。',
    'mid-low': '界石偏高，门扉轻合。',
    low: '界石未立，心湖易受外风入。',
  },
  2: {
    high: '湖纹先被看见，再慢慢止息，如镜初明。',
    'mid-high': '映波有觉，浪未至前已有光。',
    mid: '湖纹与风同行，觉照时近时远。',
    'mid-low': '浪先于镜，映波仍在学。',
    low: '叶逐波行，镜光待返。',
  },
  3: {
    high: '定息如湖归镜，柔烛重明。',
    'mid-high': '守火不熄，潮自退。',
    mid: '息与波交替，如月有盈亏。',
    'mid-low': '归息路长，请允许多泊一岸。',
    low: '风仍拂湖，定息之所有待寻。',
  },
  4: {
    high: '静湖自照，星与云各得其位。',
    'mid-high': '镜面积光，真相缓显。',
    mid: '雾遮镜面，光仍在后。',
    'mid-low': '自照少行，影多于光。',
    low: '镜未常开，内在仍多雾。',
  },
  5: {
    high: '树心内守，枝仍可风而不折。',
    'mid-high': '内守与展枝并行。',
    mid: '干时紧时松，随季而变。',
    'mid-low': '外风易入干中。',
    low: '心干尚幼，守力在养。',
  },
  6: {
    high: '根息深扎，暗土亦有星。',
    'mid-high': '根脉渐长，源有回响。',
    mid: '根息时感时失，仍在向下。',
    'mid-low': '根浅，易觉浮。',
    low: '源在深处，尚未常触。',
  },
  7: {
    high: '整象如树，根湖界一脉相通。',
    'mid-high': '诸印渐合，一象将成。',
    mid: '整象未定格，诸力仍在对话。',
    'mid-low': '整象偏散，雾仍织网。',
    low: '整象待明，请信树会引路。',
  },
}

export const psycheTreePack: LocalizedBookPack = {
  meta: {
    id: 'psyche-tree',
    shelfTitle: '心象',
    coverTitle: '心象',
    coverSubtitle: '六印自我',
    coverTagline: '照见内在之雾',
    coverHint: '六印照见自我结构，末有整象之印；翻页之间，不含评判。',
    spineLabel: '心象',
    accent: 'gold',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '自我',
    integrationLabel: '观·整象',
  },
  content: {
    dimensions: [
      {
        id: 'psyche-boundary',
        dimensionIndex: 1,
        title: '界石',
        prompt: '当外界期待靠近你时，你的内在空间更常如何自处？',
        cards: [
          card('shield', '守护之盾', '先护住内心空间，距离是温柔的守。', -2, 'shield'),
          card('silk-bridge', '柔丝之桥', '在确认安全后，才逐步敞开。', 1, 'silk-bridge'),
          card('warm-hands', '温暖之手', '自然靠近，也保留自己的岸。', 2, 'warm-hands'),
          card('star-explorer', '星光探索者', '以小步试探靠近，保留退守的星路。', 2, 'star-explorer'),
        ],
      },
      {
        id: 'psyche-wave',
        dimensionIndex: 2,
        title: '映波',
        prompt: '心湖起纹时，你最常先发生什么？',
        cards: [
          card('still-lake', '静湖之镜', '先照见纹路，再决定如何回应。', 2, 'still-lake'),
          card('soft-candle', '柔光之烛', '以温和之光照见，不急于行动。', 2, 'soft-candle'),
          card('guardian-tree', '守护之树', '先稳住干，再理波纹。', 1, 'guardian-tree'),
          card('wind-leaf-emotion', '风中之叶', '常先被浪带走，后知起纹。', -2, 'wind-leaf-emotion'),
        ],
      },
      {
        id: 'psyche-still',
        dimensionIndex: 3,
        title: '定息',
        prompt: '波动之后，你通常如何令心归息？',
        cards: [
          card('psyche-still-lake', '静湖之镜', '候湖自平，如天映水。', 2, 'still-lake'),
          card('psyche-soft-candle', '柔光之烛', '以柔光慢慢暖回自己。', 2, 'soft-candle'),
          card('psyche-guardian', '守护之树', '先护核心，再待潮退。', 1, 'guardian-tree'),
          card('psyche-wind-leaf', '风中之叶', '息路偏长，叶仍逐风。', -2, 'wind-leaf-emotion'),
        ],
      },
      {
        id: 'psyche-mirror',
        dimensionIndex: 4,
        title: '自照',
        prompt: '当你向内在照镜子，最常看见的是？',
        cards: [
          card('psyche-mirror-lake', '静湖之镜', '湖面尚清，能辨心底光暗。', 2, 'still-lake'),
          card('psyche-seeking', '寻找之灯', '持灯缓行，真相渐显。', 1, 'seeking-lamp'),
          card('psyche-fog-walk', '雾中之行', '镜常蒙雾，仍向里行。', -1, 'fog-walk'),
          card('psyche-star', '星光探索者', '以试探照见，不急于定论。', 2, 'star-explorer'),
        ],
      },
      {
        id: 'psyche-guard',
        dimensionIndex: 5,
        title: '内守',
        prompt: '外风渐起时，你更常如何内守？',
        cards: [
          card('psyche-guard-tree', '守护之树', '干稳不动，护住树心。', 2, 'guardian-tree'),
          card('psyche-mountain', '稳固之山', '如山守位，不轻动摇。', 1, 'stable-mountain'),
          card('psyche-shield', '守护之盾', '合盾护心，候风过去。', -1, 'shield'),
          card('psyche-wind', '风中之叶', '守力较薄，易随风飘。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'psyche-root',
        dimensionIndex: 6,
        title: '根息',
        prompt: '当你感内在之源，最接近哪一象？',
        cards: [
          card('deep-root-tree', '根深之树', '源在暗土，稳而静默。', 2, 'deep-root-tree'),
          card('seed-awakening', '种子觉醒', '源在萌动，仍在破土。', 1, 'seed-awakening'),
          card('fog-path', '雾中之径', '源时隐时现，如雾中径。', -1, 'fog-path'),
          card('drift-boat', '随缘之舟', '源尚远，如舟暂泊。', -2, 'drift-boat'),
        ],
      },
    ],
    integration: {
      id: 'psyche-whole',
      dimensionIndex: 7,
      title: '观·整象',
      prompt: '立雾中自观——界石、湖纹、根息交织，此刻整象更接近？',
      cards: [
        card('psyche-whole-lake', '静湖之镜', '诸力归湖，整象偏稳而明。', 2, 'still-lake'),
        card('psyche-whole-tree', '守护之树', '诸力归干，整象偏守而定。', 1, 'guardian-tree'),
        card('psyche-whole-star', '星光探索者', '整象仍在探路，光未全聚。', -1, 'star-explorer'),
        card('psyche-whole-wind', '风中之叶', '整象仍散，诸力未归。', -2, 'wind-leaf'),
      ],
    },
    attentionCardId: 'star-explorer',
    attentionCardLabel: '星光探索者',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '在雾中，自我如树影缓缓显形——以下是界石与根息所映的一页。',
      '心湖之畔，六印依次落下，照见此刻内在的自处之形。',
    ],
    closings: [
      '愿你在雾中温柔照见自己——界石与根息，各有其神圣之时。',
      '树不急于展枝，湖不急于止波。你的整象，自有归息之时。',
    ],
    mysticalPromptTemplate: `你是一位深谙自我象征的玄学解读者。
请根据以下心理学自我画像，用庄严诗意的语言作玄学解读。
使用界石、心湖、根息、树影、雾等象征；只谈自我内在，不涉及情感专卷或思维专卷。
不要直接说"你的选择是XX"。
心理学画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`,
  },
  resultChapterLabels: ['终章 · 心象画像', '终章 · 根息神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of the inner self.
Based on the psychological self-portrait below, write a sacred poetic interpretation in English.
Use boundary stone, inner lake, root-breath, tree-shadow, and mist. Focus on selfhood only.
Do not say "your choice was X".
Psychological portrait:
[PSYCHOLOGY]
Write one coherent interpretation in English.`,
}
