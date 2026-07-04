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
    '思考时较能先静后动，思流有节律，不急于落印。',
    '多数时候会先短停再行动，思流偏稳。',
    '思流时急时缓，随境而变。',
    '常先动后理，思流偏快或偏散。',
    '思流多被境带走，较难先静后辨。',
  ),
  2: level(
    '学新纹时，较能择适合之门——读、触、问或独照皆可。',
    '汲取新知有偏好，仍保一定弹性。',
    '学纹方式随题而变，尚未固定。',
    '学新纹时易迷失，门径常换。',
    '新纹难入，学径尚不清晰。',
  ),
  3: level(
    '一念既起，光较能停于专镜，深照而不易散。',
    '专注多数时候够用，偶有游光。',
    '专镜像潭也像风，深浅不定。',
    '光易游移，专镜难久。',
    '一念多散，专镜常碎。',
  ),
  4: level(
    '辨光时较能拆影亦观全，理路清晰。',
    '分析有偏好，仍能见整体。',
    '辨光时拆时全，尚未恒定。',
    '辨光偏乱或偏滞，理路常混。',
    '雾中多影，辨光路径不清。',
  ),
  5: level(
    '创泉常涌，联想自然，能连远亦连近。',
    '创意有源，时涌时默。',
    '创泉时开时塞，仍在寻脉。',
    '创泉偏涩，联想需外力引。',
    '创泉多掩于雾，点子难聚。',
  ),
  6: level(
    '择印时较能衡速与深，决断有光而不莽。',
    '择印多数时候得当，偶需再观。',
    '择印时决时拖，节奏不稳。',
    '常快决或久拖，择印偏偏。',
    '印难落纸，择路仍在雾中。',
  ),
  7: level(
    '思与感同场时，诸脉归光，整脉偏明。',
    '归光渐显，主脉大体可辨。',
    '诸脉交错，归光未定格。',
    '主光偏散，整脉仍杂。',
    '归光如雾，诸脉待更清晰的照见。',
  ),
}

const mysticalSymbols: LevelDescriptions = {
  1: level(
    '思流如稳河，先静后动，光不急于落印。',
    '思流有停有行，如河有浅滩。',
    '思流时急时缓，如风水交替。',
    '思流多先动，光后至。',
    '叶逐思风，静脉待返。',
  ),
  2: level(
    '学纹入门清晰，光沿合适之径入卷。',
    '学径有偏仍活，如光择窗而入。',
    '学纹多门并试，径未常定。',
    '新纹难附，光在门外徘徊。',
    '卷纹未开，学径尚在雾中。',
  ),
  3: level(
    '专镜像深潭，一念久照而不散。',
    '专镜多数时候明亮，偶有游丝。',
    '专镜深浅不定，如月有盈亏。',
    '光游多域，镜难久持。',
    '镜碎风急，专脉仍学。',
  ),
  4: level(
    '辨光能拆能合，影落有序。',
    '辨光有偏仍见全，如灯照一角见一室。',
    '拆全交替，辨光未恒定。',
    '影叠影乱，辨光仍练。',
    '雾中多影，灯尚未常亮。',
  ),
  5: level(
    '创泉涌动，星点连星，路自开。',
    '泉时涌时默，创意有节律。',
    '创泉开塞相间，仍在寻源。',
    '泉眼细流，需风引火。',
    '创泉掩雾，点子待聚。',
  ),
  6: level(
    '择印光稳，速深相衡，印落有声。',
    '择印大体得当，偶需再观天光。',
    '决与拖交替，印时落时悬。',
    '印偏急或偏迟，光未常中。',
    '印悬雾中，择路仍行。',
  ),
  7: level(
    '诸脉归一光，夜图初成，思情各得其位。',
    '主光渐明，余脉仍有余波。',
    '多光交错，归处未定格。',
    '光散如雾，主脉待认。',
    '归光未至，请信星会引脉。',
  ),
}

export const mindLightPack: LocalizedBookPack = {
  meta: {
    id: 'mind-light',
    shelfTitle: '明思',
    coverTitle: '明思',
    coverSubtitle: '六脉思维',
    coverTagline: '照见思光之星',
    coverHint: '六脉照见思维之流，末有归光之印；不含评判，只在雾中留痕。',
    spineLabel: '明思',
    accent: 'gold',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '思维',
    integrationLabel: '脉·归光',
  },
  content: {
    dimensions: [
      {
        id: 'mind-flow',
        dimensionIndex: 1,
        title: '思流',
        prompt: '岔路在前，未动之前，你的思流更常如何？',
        cards: [
          card('ml-steady-river', '稳流之河', '先静后动，思流如河有节律。', 2, 'steady-river'),
          card('ml-star', '星光探索者', '以小小试探照路，再决定方向。', 2, 'star-explorer'),
          card('ml-wind-leaf', '风中之叶', '思流易随境转，先动后理。', -1, 'wind-leaf'),
          card('ml-flexible', '灵活之风', '思流快而散，难久停于一处。', -2, 'flexible-wind'),
        ],
      },
      {
        id: 'mind-learn',
        dimensionIndex: 2,
        title: '学纹',
        prompt: '新纹入卷时，你更常如何汲取？',
        cards: [
          card('ml-seeking', '寻找之灯', '持灯细读，照见纹路。', 2, 'seeking-lamp'),
          card('ml-sensing', '感知之河', '亲手触纹，身感入心。', 1, 'sensing-river'),
          card('ml-resonance', '共振之光', '与人呼应，在对话中入纹。', 1, 'resonance-light'),
          card('ml-fog-walk', '雾中之行', '新纹难入，多在雾中摸索。', -2, 'fog-walk'),
        ],
      },
      {
        id: 'mind-focus',
        dimensionIndex: 3,
        title: '专镜',
        prompt: '一念既起，你的光更常停于何处？',
        cards: [
          card('ml-still-lake', '静湖之镜', '光停深潭，久照不散。', 2, 'still-lake'),
          card('ml-guardian', '守护之树', '光护一念，外扰难入。', 1, 'guardian-tree'),
          card('ml-wind-cloud', '风中之云', '光随云移，深浅不定。', -1, 'wind-cloud'),
          card('ml-wind-leaf2', '风中之叶', '光易游散，专镜难久。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'mind-analyze',
        dimensionIndex: 4,
        title: '辨光',
        prompt: '雾中多影时，你更常如何辨光？',
        cards: [
          card('ml-steady-path', '稳行之径', '拆步理影，逐一辨明。', 2, 'steady-path'),
          card('ml-star-guide', '星河指引', '观全象，再认主光。', 2, 'star-guide'),
          card('ml-cautious', '谨慎之山', '先立山观，再慢慢拆解。', 1, 'cautious-mountain'),
          card('ml-fog-path', '雾中之径', '影叠影乱，理路常混。', -2, 'fog-path'),
        ],
      },
      {
        id: 'mind-create',
        dimensionIndex: 5,
        title: '创泉',
        prompt: '泉眼将开时，你的点子更常从哪来？',
        cards: [
          card('ml-bloom', '绽放之树', '点子如枝展，连远亦连近。', 2, 'bloom-tree'),
          card('ml-star-explorer2', '星光探索者', '以试探连点成路。', 2, 'star-explorer'),
          card('ml-seed', '种子觉醒', '点子慢萌，需时待土。', 1, 'seed-awakening'),
          card('ml-drift', '随缘之舟', '泉眼难寻，点多散于雾。', -2, 'drift-boat'),
        ],
      },
      {
        id: 'mind-decide',
        dimensionIndex: 6,
        title: '择印',
        prompt: '印将落纸，你更常如何择路？',
        cards: [
          card('ml-mountain', '稳固之山', '久观后决，印落有声。', 2, 'stable-mountain'),
          card('ml-balance', '平衡之舟', '衡速与深，择中有度。', 2, 'balance-boat'),
          card('ml-flexible2', '灵活之风', '快决快改，印有时轻。', -1, 'flexible-wind'),
          card('ml-fog-walk2', '雾中之行', '久拖或难决，印悬雾中。', -2, 'fog-walk'),
        ],
      },
    ],
    integration: {
      id: 'mind-whole',
      dimensionIndex: 7,
      title: '脉·归光',
      prompt: '思与感同席——诸脉交织，主光更常落于？',
      cards: [
        card('ml-whole-star', '星河指引', '主光清晰，诸脉同向。', 2, 'star-guide'),
        card('ml-whole-lamp', '寻找之灯', '主光渐明，仍照途中。', 1, 'seeking-lamp'),
        card('ml-whole-wind', '风中之叶', '主光游移，脉仍交错。', -1, 'wind-leaf'),
        card('ml-whole-fog', '雾中之径', '主光未聚，诸脉待归。', -2, 'fog-path'),
      ],
    },
    attentionCardId: 'ml-still-lake',
    attentionCardLabel: '静湖之镜',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '星图在雾中展开——以下是思维光脉所映的一页。',
      '光沿脉而行，六印依次落下，照见此刻思流之形。',
    ],
    closings: [
      '愿你在雾中温柔照见思流——光不急于聚，脉自有其行。',
      '星不催促归位，镜不责备游光。你的归光，自有其时。',
    ],
    mysticalPromptTemplate: `你是一位照见思维象征的玄学解读者。
请根据以下思维画像，用庄严诗意的语言作玄学解读。
使用星光、光脉、专镜、辨光、创泉、印等象征；只谈思维认知，不涉及情感或关系专卷。
不要直接说"你的选择是XX"。
心理学思维画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`,
  },
  resultChapterLabels: ['终章 · 思光画像', '终章 · 明思神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of thought and mind.
Based on the mind portrait below, write a sacred poetic interpretation in English.
Use starlight, light-path, mirror, spring, and seal. Focus on thinking only.
Do not say "your choice was X".
Mind portrait:
[PSYCHOLOGY]
Write one coherent interpretation in English.`,
}
