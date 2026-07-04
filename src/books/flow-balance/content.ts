import type { LocalizedBookPack } from '../shared/createBook'
import { card } from '../shared/card'
import type { LevelDescriptions } from '../shared/profileHelpers'

const level = (
  high: string,
  midHigh: string,
  mid: string,
  midLow: string,
  low: string,
) => ({ high, 'mid-high': midHigh, mid, 'mid-low': midLow, low })

const psychDescriptions: LevelDescriptions = {
  1: level(
    '面对资源与精力分配，较能稳核分流，守衡而不僵。',
    '分配大体得当，偶有偏倚。',
    '分力随境而变。',
    '常偏守或偏放，守衡仍在学。',
    '分力易乱，守衡路径不清。',
  ),
  2: level(
    '不确定时较能先守源，再探新向，资源不轻散。',
    '守源与试探并存。',
    '守源时紧时松。',
    '偏守旧源，新向难开。',
    '源感模糊，守放皆难。',
  ),
  3: level(
    '雾中行路，较能辨步而不慌，中流有定。',
    '雾中多数时候能缓行。',
    '雾行时稳时乱。',
    '雾中易失向，需久停。',
    '雾径常迷，定所难寻。',
  ),
  4: level(
    '急缓之间，较能自调，不迫不拖。',
    '急缓大体合宜。',
    '节奏随压而变。',
    '易偏急或偏拖。',
    '急缓难衡，流常失衡。',
  ),
  5: level(
    '势变时较能转势而不散，如舟转舵。',
    '转势有学，仍保核心。',
    '转势时顺时涩。',
    '势变易乱，转舵偏迟。',
    '势变则散，定舟仍在寻。',
  ),
  6: level(
    '压力之下，较能定舟不覆，守中有行。',
    '定舟多数时候可用。',
    '舟时稳时晃。',
    '压力下易失衡。',
    '舟常随波，定所难留。',
  ),
  7: level(
    '诸流交汇，整流偏匀——分、守、行大致同向。',
    '整流渐明，诸衡大体和谐。',
    '整流仍在成形，诸力时有交错。',
    '整流偏散，诸衡未归。',
    '整流如雾，守衡仍待更清晰的照见。',
  ),
}

const mysticalSymbols: LevelDescriptions = {
  1: level(
    '平衡之舟中流，分力如河有渠，不溢不涸。',
    '舟行有偏仍返中流。',
    '分力随风，渠尚在寻。',
    '或守或放，衡在摇摆。',
    '流乱无渠，舟待定锚。',
  ),
  2: level(
    '厚土护源，新向小口试探，守而不僵。',
    '源与向并存，如根与枝。',
    '守源时紧时松，如季。',
    '源门常合，新向难开。',
    '源在深处，守放皆难。',
  ),
  3: level(
    '雾径有步，舟缓行而不覆。',
    '雾中多数时候有灯。',
    '雾步时稳时停。',
    '雾浓则久泊。',
    '雾径迷，定所待寻。',
  ),
  4: level(
    '急缓相衡，如潮有律。',
    '节奏大体合宜，偶有湍急。',
    '急缓随风，不必自责。',
    '或急或拖，流常失衡。',
    '流无律，舟难定。',
  ),
  5: level(
    '势变则舵，舟转而不散。',
    '转势有学，舵渐灵。',
    '舵时灵时涩。',
    '势变则迟，舟易偏。',
    '散流无主，舵待重修。',
  ),
  6: level(
    '压下仍定舟，山立而舟不覆。',
    '舟晃而不倾，守中有行。',
    '舟随浪摇，仍在学定。',
    '浪急则失衡。',
    '舟随波，定所难留。',
  ),
  7: level(
    '诸流归一河，整流如地图初成。',
    '整流渐明，余湍仍有余波。',
    '多流交错，整图未定格。',
    '流散如风，整衡待聚。',
    '整流未至，请信舟会靠岸。',
  ),
}

export const flowBalancePack: LocalizedBookPack = {
  meta: {
    id: 'flow-balance',
    shelfTitle: '流衡',
    coverTitle: '流衡',
    coverSubtitle: '六衡守变',
    coverTagline: '照见中流之舟',
    coverHint: '六衡照见守衡与应变，末有整流之印；不含评判，只在雾中留痕。',
    spineLabel: '流衡',
    accent: 'gold',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '平衡',
    integrationLabel: '衡·整流',
  },
  content: {
    dimensions: [
      {
        id: 'balance-split',
        dimensionIndex: 1,
        title: '分力',
        prompt: '当力与资源需分配，你更常如何分力？',
        cards: [
          card('fb-balance', '平衡之舟', '稳核分流，守衡而不僵。', 2, 'balance-boat'),
          card('fb-sensing', '感知之河', '先感流势，再自然分配。', 2, 'sensing-river'),
          card('fb-flexible', '灵活之风', '随境调整，偶有偏倚。', 1, 'flexible-wind'),
          card('fb-cautious', '谨慎之山', '偏守现有，新向难开。', -1, 'cautious-mountain'),
        ],
      },
      {
        id: 'balance-source',
        dimensionIndex: 2,
        title: '守源',
        prompt: '不确定临头，你更常如何守源？',
        cards: [
          card('fb-mountain', '稳固之山', '先守厚土，再探小口。', 2, 'stable-mountain'),
          card('fb-guardian', '守护之树', '护根守干，源不轻散。', 1, 'guardian-tree'),
          card('fb-star', '星光探索者', '守中有探，以小试开新向。', 2, 'star-explorer'),
          card('fb-drift', '随缘之舟', '源感模糊，守放皆难。', -2, 'drift-boat'),
        ],
      },
      {
        id: 'balance-mist',
        dimensionIndex: 3,
        title: '雾行',
        prompt: '雾中行路，你更常如何定步？',
        cards: [
          card('fb-steady-path', '稳行之径', '缓步辨路，不急于出雾。', 2, 'steady-path'),
          card('fb-seeking', '寻找之灯', '持灯徐行，雾中有光。', 1, 'seeking-lamp'),
          card('fb-fog-walk', '雾中之行', '常停常惑，但仍向里行。', -1, 'fog-walk'),
          card('fb-fog-path', '雾中之径', '雾径常迷，定所难寻。', -2, 'fog-path'),
        ],
      },
      {
        id: 'balance-pace',
        dimensionIndex: 4,
        title: '急缓',
        prompt: '急缓之间，你的流更常如何？',
        cards: [
          card('fb-steady-river', '稳流之河', '急缓有律，如河有渠。', 2, 'steady-river'),
          card('fb-mountain2', '稳固之山', '偏缓偏稳，不轻躁进。', 1, 'stable-mountain'),
          card('fb-wind-cloud', '风中之云', '急缓随风，律尚在寻。', -1, 'wind-cloud'),
          card('fb-wind-leaf', '风中之叶', '易偏急或偏拖，流常失衡。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'balance-turn',
        dimensionIndex: 5,
        title: '转势',
        prompt: '势变突至，你更常如何转势？',
        cards: [
          card('fb-bloom', '绽放之树', '势变作养，转势而不散。', 2, 'bloom-tree'),
          card('fb-balance2', '平衡之舟', '转舵中流，守核不散。', 2, 'balance-boat'),
          card('fb-wind', '灵活之风', '转得快，有时失定。', -1, 'flexible-wind'),
          card('fb-drift2', '随缘之舟', '势变则散，舵偏迟。', -2, 'drift-boat'),
        ],
      },
      {
        id: 'balance-boat',
        dimensionIndex: 6,
        title: '定舟',
        prompt: '压力之下，你更常如何定舟？',
        cards: [
          card('fb-mountain3', '稳固之山', '山立舟稳，压下不覆。', 2, 'stable-mountain'),
          card('fb-guardian2', '守护之树', '护干定舟，守中有行。', 1, 'guardian-tree'),
          card('fb-balance3', '平衡之舟', '舟晃而不倾，仍在学定。', 1, 'balance-boat'),
          card('fb-torrent', '激流之河', '浪急则失衡，定所难留。', -2, 'torrent-river'),
        ],
      },
    ],
    integration: {
      id: 'balance-whole',
      dimensionIndex: 7,
      title: '衡·整流',
      prompt: '诸流交汇——若此刻只映一河，整流更接近？',
      cards: [
        card('fb-whole-boat', '平衡之舟', '诸流归中，整流偏匀。', 2, 'balance-boat'),
        card('fb-whole-river', '稳流之河', '整流有律，余湍可平。', 1, 'steady-river'),
        card('fb-whole-wind', '风中之叶', '整流仍散，诸衡交错。', -1, 'wind-leaf'),
        card('fb-whole-torrent', '激流之河', '整流多湍，定所待寻。', -2, 'torrent-river'),
      ],
    },
    attentionCardId: 'fb-star',
    attentionCardLabel: '星光探索者',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '中流在雾中显形——以下是守衡与应变所映的一页。',
      '舟与山之间，六印依次落下，照见此刻整流之形。',
    ],
    closings: [
      '愿你在雾中温柔照见守衡——流不急于归槽，舟自有其泊。',
      '河不责备曲折，山不催促不动。你的整流，自有其时。',
    ],
    mysticalPromptTemplate: `你是一位照见守衡象征的玄学解读者。
请根据以下平衡画像，用庄严诗意的语言作玄学解读。
使用舟、山、流、雾、源等象征；只谈守衡与应变，不涉及情感或方向专卷。
不要直接说"你的选择是XX"。
心理学平衡画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`,
  },
  resultChapterLabels: ['终章 · 流衡画像', '终章 · 流衡神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of balance and flow.
Based on the balance portrait below, write a sacred poetic interpretation in English.
Use boat, mountain, river, mist, and source. Focus on balance only.
Do not say "your choice was X".
Balance portrait:
[PSYCHOLOGY]
Write one coherent interpretation in English.`,
}
