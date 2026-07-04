import type { CardOption, QuestionItem } from '../types'
import { buildQuestionFlowEn } from './questions.en'

const dimensions = [
  {
    id: 'flow-autonomy',
    dimensionIndex: 1,
    title: '自主流动之感',
    prompt: '当你回想最近一次面对重要选择的时候，你最常感受到的内在状态是怎样的？',
    cards: [
      {
        id: 'steady-river',
        label: '稳流之河',
        description: '内心像一条安静却清晰的河流，先感受自己的节奏，再自然向前。',
        score: 2 as const,
        pattern: 'steady-river',
      },
      {
        id: 'wind-leaf',
        label: '随风之叶',
        description: '容易被周围的风轻轻带动，方向随环境自然转动。',
        score: -2 as const,
        pattern: 'wind-leaf',
      },
      {
        id: 'mountain-guard',
        label: '山中守者',
        description: '先稳稳守护自己的位置和界限，再清晰地迈出下一步。',
        score: 1 as const,
        pattern: 'mountain-guard',
      },
      {
        id: 'star-explorer',
        label: '星光探索者',
        description: '喜欢通过小小的尝试，去感受哪条路径最与自己共鸣。',
        score: 2 as const,
        pattern: 'star-explorer',
      },
    ],
  },
  {
    id: 'life-direction',
    dimensionIndex: 2,
    title: '生命方向之光',
    prompt: '当你偶尔停下来思考自己的人生时，最常浮现的感受是？',
    cards: [
      {
        id: 'deep-root-tree',
        label: '根深之树',
        description: '感觉自己像一棵有根的树，有方向却也在缓慢生长。',
        score: 2 as const,
        pattern: 'deep-root-tree',
      },
      {
        id: 'fog-path',
        label: '雾中之径',
        description: '方向感有时清晰，有时像在雾里，需要慢慢寻找。',
        score: -1 as const,
        pattern: 'fog-path',
      },
      {
        id: 'star-guide',
        label: '星河指引',
        description: '有隐约的星光或内在声音在指引下一步。',
        score: 2 as const,
        pattern: 'star-guide',
      },
      {
        id: 'drift-boat',
        label: '随缘之舟',
        description: '更多随生活的水流漂流，较少刻意规划。',
        score: -2 as const,
        pattern: 'drift-boat',
      },
    ],
  },
  {
    id: 'connection',
    dimensionIndex: 3,
    title: '联结之脉',
    prompt: '在与重要的人相处时，你最常出现的自然感受或行为是？',
    cards: [
      {
        id: 'warm-hands',
        label: '温暖之手',
        description: '自然地靠近并给予支持，也容易感受到对方的温暖回应。',
        score: 2 as const,
        pattern: 'warm-hands',
      },
      {
        id: 'shield',
        label: '守护之盾',
        description: '会本能地保持一些距离，来守护自己的内心空间。',
        score: -2 as const,
        pattern: 'shield',
      },
      {
        id: 'silk-bridge',
        label: '柔丝之桥',
        description: '努力搭建联结，但需要在安全感确认后才会更放松。',
        score: 1 as const,
        pattern: 'silk-bridge',
      },
      {
        id: 'stars-gaze',
        label: '星河相望',
        description: '享受彼此都有独立的空间，也能在需要时自然交汇。',
        score: 1 as const,
        pattern: 'stars-gaze',
      },
    ],
  },
  {
    id: 'balance-flow',
    dimensionIndex: 4,
    title: '流动与守衡',
    prompt: '当生活中出现不确定或需要分配资源时，你最典型的反应是？',
    cards: [
      {
        id: 'balance-boat',
        label: '平衡之舟',
        description: '会稳住核心，逐步分配，保持整体的流动平衡。',
        score: 2 as const,
        pattern: 'balance-boat',
      },
      {
        id: 'cautious-mountain',
        label: '谨慎之山',
        description: '倾向先保守守护现有资源，再慢慢探索新方向。',
        score: -1 as const,
        pattern: 'cautious-mountain',
      },
      {
        id: 'flexible-wind',
        label: '灵活之风',
        description: '容易随情况调整分配方式，行为较为灵活。',
        score: 1 as const,
        pattern: 'flexible-wind',
      },
      {
        id: 'sensing-river',
        label: '感知之河',
        description: '先感受内在的节奏，再自然地调整流动的方向。',
        score: 2 as const,
        pattern: 'sensing-river',
      },
    ],
  },
  {
    id: 'inner-peace',
    dimensionIndex: 5,
    title: '内在安住',
    prompt: '当你遇到情绪波动或内心不安的时候，最常出现的处理方式是？',
    cards: [
      {
        id: 'still-lake',
        label: '静湖之镜',
        description: '会先安静下来，像湖面一样照见自己的感受。',
        score: 2 as const,
        pattern: 'still-lake',
      },
      {
        id: 'soft-candle',
        label: '柔光之烛',
        description: '用温和的方式安抚自己，慢慢让光亮回来。',
        score: 2 as const,
        pattern: 'soft-candle',
      },
      {
        id: 'guardian-tree',
        label: '守护之树',
        description: '会先守护自己的核心，再慢慢处理情绪。',
        score: 1 as const,
        pattern: 'guardian-tree',
      },
      {
        id: 'wind-leaf-emotion',
        label: '风中之叶',
        description: '情绪容易随外在波动，较难快速安住。',
        score: -2 as const,
        pattern: 'wind-leaf-emotion',
      },
    ],
  },
  {
    id: 'bloom-adapt',
    dimensionIndex: 6,
    title: '绽放与适应',
    prompt: '当面对新的变化或需要调整的时候，你最自然的倾向是？',
    cards: [
      {
        id: 'bloom-tree',
        label: '绽放之树',
        description: '把变化当作滋养的土壤，自然伸展去适应并成长。',
        score: 2 as const,
        pattern: 'bloom-tree',
      },
      {
        id: 'stable-mountain',
        label: '稳固之山',
        description: '先稳住自己的位置，谨慎观察后再慢慢调整。',
        score: 1 as const,
        pattern: 'stable-mountain',
      },
      {
        id: 'wind-cloud',
        label: '风中之云',
        description: '随变化轻轻流动，灵活但有时会觉得轻飘。',
        score: -1 as const,
        pattern: 'wind-cloud',
      },
      {
        id: 'seed-awakening',
        label: '种子觉醒者',
        description: '会在内心先安静孕育，然后通过日常小行动慢慢展开。',
        score: 2 as const,
        pattern: 'seed-awakening',
      },
    ],
  },
  {
    id: 'efficacy-resonance',
    dimensionIndex: 7,
    title: '效能与共振',
    prompt: '当你回顾自己的行动与内心向往时，最常感受到的是？',
    cards: [
      {
        id: 'resonance-light',
        label: '共振之光',
        description: '行动与内心重视的价值，大体保持着自然的共鸣。',
        score: 2 as const,
        pattern: 'resonance-light',
      },
      {
        id: 'seeking-lamp',
        label: '寻找之灯',
        description: '有时感到力量感较弱，需要更多内在或外在的支持。',
        score: -1 as const,
        pattern: 'seeking-lamp',
      },
      {
        id: 'steady-path',
        label: '稳行之径',
        description: '相信通过自己的步伐，能逐步靠近重要的事物。',
        score: 2 as const,
        pattern: 'steady-path',
      },
      {
        id: 'fog-walk',
        label: '雾中之行',
        description: '偶尔觉得行动与内心向往之间还有距离，需要更多澄清。',
        score: -2 as const,
        pattern: 'fog-walk',
      },
    ],
  },
]

export const dimensionQuestions: QuestionItem[] = dimensions.map((d) => ({
  type: 'dimension' as const,
  ...d,
}))

export const attentionChecks: QuestionItem[] = [
  {
    type: 'attention',
    id: 'attention-star-explorer',
    prompt: '为了确认您在与自己对话，请选择「星光探索者」。',
    requiredCardId: 'star-explorer',
    requiredCardLabel: '星光探索者',
  },
  {
    type: 'attention',
    id: 'attention-stable-mountain',
    prompt: '请直接选择「稳固之山」，以验证您正在认真感受。',
    requiredCardId: 'stable-mountain',
    requiredCardLabel: '稳固之山',
  },
]

/** Interleave attention checks after dimensions 2 and 5 */
export function buildQuestionFlow(): QuestionItem[] {
  const flow: QuestionItem[] = []
  dimensionQuestions.forEach((q, index) => {
    flow.push(q)
    if (index === 1) flow.push(attentionChecks[0])
    if (index === 4) flow.push(attentionChecks[1])
  })
  return flow
}

export const allQuestions = buildQuestionFlow()

export function getPsycheTreeQuestions(locale: 'zh' | 'en'): QuestionItem[] {
  return locale === 'en' ? buildQuestionFlowEn() : allQuestions
}

export function findCardById(cardId: string) {
  for (const q of dimensionQuestions) {
    if (q.type !== 'dimension') continue
    const card = q.cards.find((c: CardOption) => c.id === cardId)
    if (card) return { card, dimension: q }
  }
  return null
}
