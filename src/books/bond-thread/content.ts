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
    '与重要之人相处，较能自然靠近并给予温度，亦保留自己的岸。',
    '靠近与退守并存，丝温适中。',
    '丝近丝远随境而变。',
    '较常先退后近，丝温偏 cautious。',
    '丝多守距，靠近需久候。',
  ),
  2: level(
    '联结中较能传递真实温度，不饰不避。',
    '情温多数时候真诚，偶有保留。',
    '丝温时暖时淡。',
    '情温难传，多留于内。',
    '丝寒于表，温在深处待启。',
  ),
  3: level(
    '较能在亲近与距离间找到合适之距，如星河相望。',
    '丝距大体得当，偶需微调。',
    '丝距随人随境变。',
    '丝距常偏紧或偏松。',
    '丝距难定，近远皆不安。',
  ),
  4: level(
    '较能在关系中建立信任，丝桥稳固。',
    '信任渐织，桥时有试探。',
    '丝信时厚时薄。',
    '信任易损，桥常重修。',
    '丝信尚薄，桥仍在雾中。',
  ),
  5: level(
    '边界清晰而柔，丝守不拒光。',
    '能守能开，界石与桥并存。',
    '丝守时紧时松。',
    '边界偏紧，丝多向内。',
    '丝守过厚，光难入桥。',
  ),
  6: level(
    '关系受挫后，较能修复或温柔收束，丝复有路。',
    '修复需时，但仍愿再织。',
    '丝复时快时慢。',
    '修复偏难，多留断丝。',
    '丝断难续，仍在学复。',
  ),
  7: level(
    '诸缘交织，整丝偏匀——近、温、距、信大致同向。',
    '整缘渐明，诸丝大体和谐。',
    '整缘仍在成形，诸丝时有张力。',
    '整缘偏散，诸丝未归。',
    '整缘如雾，缘丝仍待更清晰的照见。',
  ),
}

const mysticalSymbols: LevelDescriptions = {
  1: level(
    '温暖之手伸出，丝桥同时显现，缘在光中脉动。',
    '丝近而不迫，温而不烫。',
    '丝随境弯，缘有松紧。',
    '丝多向内，桥半掩。',
    '远星相望，缘在守候。',
  ),
  2: level(
    '情温如柔光沿丝传递，真而不锐。',
    '温丝时明时隐，仍向对方面去。',
    '丝温随风，不必责备。',
    '温留心底，丝面偏淡。',
    '雾缠丝端，温待再传。',
  ),
  3: level(
    '星河相望，距中有温，近中有岸。',
    '丝距大体合宜，如双轨并行。',
    '距与温仍在校准。',
    '丝偏紧或偏松，距在寻中。',
    '缘距未定，请允许多试。',
  ),
  4: level(
    '柔桥承重，丝信如纹深植。',
    '桥渐牢，信有回响。',
    '桥时稳时摇，信在生长。',
    '桥易断，信需再织。',
    '桥在雾中，信待初光。',
  ),
  5: level(
    '界石立而门开，丝守而不绝缘。',
    '守中有开，缘有界亦有光。',
    '界石时移，守开交替。',
    '界偏厚，丝难外出。',
    '门常合，缘在门后等风。',
  ),
  6: level(
    '断丝再织，桥复有纹，缘有续。',
    '修复如慢针，丝仍向对。',
    '断处仍在结，缘在愈合。',
    '丝断久悬，桥待新木。',
    '缘折仍记，复路在雾中。',
  ),
  7: level(
    '诸丝归一图，整缘如织锦初成。',
    '整缘渐明，余丝仍有余波。',
    '多丝交错，整图未定格。',
    '丝散如风，整缘待聚。',
    '整缘未至，请信缘有其时。',
  ),
}

export const bondThreadPack: LocalizedBookPack = {
  meta: {
    id: 'bond-thread',
    shelfTitle: '缘书',
    coverTitle: '缘书',
    coverSubtitle: '六丝联结',
    coverTagline: '照见缘丝之桥',
    coverHint: '六丝照见联结面向，末有整缘之印；不含评判，只在雾中留痕。',
    spineLabel: '缘书',
    accent: 'silver',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '联结',
    integrationLabel: '缘·整丝',
  },
  content: {
    dimensions: [
      {
        id: 'bond-near',
        dimensionIndex: 1,
        title: '丝近',
        prompt: '与重要之人相处时，你的丝更常如何靠近？',
        cards: [
          card('bt-warm', '温暖之手', '自然靠近，亦留己岸。', 2, 'warm-hands'),
          card('bt-silk', '柔丝之桥', '确认安全后，逐步加深。', 1, 'silk-bridge'),
          card('bt-stars', '星河相望', '近中有距，如双星轨道。', 1, 'stars-gaze'),
          card('bt-shield', '守护之盾', '先护心距，靠近需时。', -2, 'shield'),
        ],
      },
      {
        id: 'bond-warm',
        dimensionIndex: 2,
        title: '丝温',
        prompt: '联结中，你更常如何传递温度？',
        cards: [
          card('bt-resonance', '共振之光', '温在呼应，真而不饰。', 2, 'resonance-light'),
          card('bt-soft', '柔光之烛', '温以柔光，不迫不避。', 2, 'soft-candle'),
          card('bt-guardian', '守护之树', '温在守中，不轻易外露。', 1, 'guardian-tree'),
          card('bt-fog', '雾中之行', '温多留于内，丝面偏淡。', -2, 'fog-walk'),
        ],
      },
      {
        id: 'bond-distance',
        dimensionIndex: 3,
        title: '丝距',
        prompt: '亲近与距离之间，你的丝距更常如何？',
        cards: [
          card('bt-stars2', '星河相望', '距中有温，近中有岸。', 2, 'stars-gaze'),
          card('bt-silk2', '柔丝之桥', '距随信任慢慢调整。', 1, 'silk-bridge'),
          card('bt-mountain', '稳固之山', '距偏稳，不轻易摇摆。', 1, 'stable-mountain'),
          card('bt-shield2', '守护之盾', '距常偏紧，桥半掩。', -2, 'shield'),
        ],
      },
      {
        id: 'bond-trust',
        dimensionIndex: 4,
        title: '丝信',
        prompt: '当信任将织，你更常如何落丝？',
        cards: [
          card('bt-bridge', '柔丝之桥', '以试探织桥，信渐厚。', 2, 'silk-bridge'),
          card('bt-warm2', '温暖之手', '以行动传信，温信并行。', 2, 'warm-hands'),
          card('bt-cautious', '谨慎之山', '信来得慢，但一经落丝较稳。', 1, 'cautious-mountain'),
          card('bt-shield3', '守护之盾', '信易损，丝常重修。', -2, 'shield'),
        ],
      },
      {
        id: 'bond-guard',
        dimensionIndex: 5,
        title: '丝守',
        prompt: '缘风渐起，你更常如何守界？',
        cards: [
          card('bt-mountain2', '稳固之山', '界石清晰，守而不绝光。', 2, 'stable-mountain'),
          card('bt-guard-tree', '守护之树', '守干护心，缘在守中续。', 1, 'guardian-tree'),
          card('bt-balance', '平衡之舟', '守开相衡，随境调整。', 1, 'balance-boat'),
          card('bt-wind', '风中之叶', '界易随风，守力偏薄。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'bond-repair',
        dimensionIndex: 6,
        title: '丝复',
        prompt: '缘丝受挫后，你更常如何面对？',
        cards: [
          card('bt-seed', '种子觉醒', '视折损为再织之机。', 2, 'seed-awakening'),
          card('bt-steady', '稳行之径', '慢针续丝，桥复有纹。', 1, 'steady-path'),
          card('bt-drift', '随缘之舟', '需久泊岸，再愿织桥。', -1, 'drift-boat'),
          card('bt-fog-path', '雾中之径', '断丝久悬，复路未明。', -2, 'fog-path'),
        ],
      },
    ],
    integration: {
      id: 'bond-whole',
      dimensionIndex: 7,
      title: '缘·整丝',
      prompt: '诸缘交织——若此刻只映一图，整丝更接近？',
      cards: [
        card('bt-whole-silk', '柔丝之桥', '诸丝归桥，整缘偏匀。', 2, 'silk-bridge'),
        card('bt-whole-stars', '星河相望', '整缘有距有温，大体合宜。', 1, 'stars-gaze'),
        card('bt-whole-wind', '风中之叶', '整缘仍散，诸丝交错。', -1, 'wind-leaf'),
        card('bt-whole-shield', '守护之盾', '整缘偏守，桥未全开。', -2, 'shield'),
      ],
    },
    attentionCardId: 'bt-stars2',
    attentionCardLabel: '星河相望',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '缘丝在雾中轻轻显影——以下是联结所映的一页。',
      '桥与相望之间，六印依次落下，照见此刻缘丝之形。',
    ],
    closings: [
      '愿你在雾中温柔照见缘丝——距与温，各有其神圣之时。',
      '桥不催促合拢，星不责备相望。你的整缘，自有其时。',
    ],
    mysticalPromptTemplate: `你是一位照见缘分象征的玄学解读者。
请根据以下联结画像，用温柔诗意的语言作玄学解读。
使用丝、桥、相望、界石、温手等象征；只谈关系联结，不涉及自我或思维专卷。
不要直接说"你的选择是XX"。
心理学联结画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`,
  },
  resultChapterLabels: ['终章 · 缘丝画像', '终章 · 缘书神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of bond and connection.
Based on the bond portrait below, write a gentle poetic interpretation in English.
Use thread, bridge, distant stars, and warm hands. Focus on relationship only.
Do not say "your choice was X".
Bond portrait:
[PSYCHOLOGY]
Write one coherent interpretation in English.`,
}
