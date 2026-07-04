import type { QuestionItem } from '../types'

const dimensions = [
  {
    id: 'flow-autonomy',
    dimensionIndex: 1,
    title: 'Sense of autonomous flow',
    prompt:
      'When you recall a recent important choice, which inner state do you feel most often?',
    cards: [
      {
        id: 'steady-river',
        label: 'Steady river',
        description:
          'Like a quiet, clear river—first feel your rhythm, then move forward naturally.',
        score: 2 as const,
        pattern: 'steady-river',
      },
      {
        id: 'wind-leaf',
        label: 'Leaf in wind',
        description: 'Easily stirred by the breeze; direction turns with the environment.',
        score: -2 as const,
        pattern: 'wind-leaf',
      },
      {
        id: 'mountain-guard',
        label: 'Mountain keeper',
        description: 'First guard your place and boundary, then step forward with clarity.',
        score: 1 as const,
        pattern: 'mountain-guard',
      },
      {
        id: 'star-explorer',
        label: 'Star explorer',
        description: 'Small trials reveal which path resonates most with you.',
        score: 2 as const,
        pattern: 'star-explorer',
      },
    ],
  },
  {
    id: 'life-direction',
    dimensionIndex: 2,
    title: 'Light of life direction',
    prompt: 'When you pause to think about your life, what feeling arises most often?',
    cards: [
      {
        id: 'deep-root-tree',
        label: 'Deep-rooted tree',
        description: 'Rooted like a tree—direction exists and growth is slow but real.',
        score: 2 as const,
        pattern: 'deep-root-tree',
      },
      {
        id: 'fog-path',
        label: 'Path in fog',
        description: 'Direction is sometimes clear, sometimes searched for in mist.',
        score: -1 as const,
        pattern: 'fog-path',
      },
      {
        id: 'star-guide',
        label: 'Star guide',
        description: 'A faint starlight or inner voice hints at the next step.',
        score: 2 as const,
        pattern: 'star-guide',
      },
      {
        id: 'drift-boat',
        label: 'Drifting boat',
        description: 'More drift with life’s current than deliberate planning.',
        score: -2 as const,
        pattern: 'drift-boat',
      },
    ],
  },
  {
    id: 'connection',
    dimensionIndex: 3,
    title: 'Pulse of connection',
    prompt: 'With people who matter, what do you naturally feel or do most often?',
    cards: [
      {
        id: 'warm-hands',
        label: 'Warm hands',
        description: 'Move closer and support; warmth is often returned.',
        score: 2 as const,
        pattern: 'warm-hands',
      },
      {
        id: 'shield',
        label: 'Guardian shield',
        description: 'Keep some distance instinctively to protect inner space.',
        score: -2 as const,
        pattern: 'shield',
      },
      {
        id: 'silk-bridge',
        label: 'Silk bridge',
        description: 'Build connection, but relax only after safety is confirmed.',
        score: 1 as const,
        pattern: 'silk-bridge',
      },
      {
        id: 'stars-gaze',
        label: 'Stars gazing',
        description: 'Enjoy independent space that can meet when needed.',
        score: 1 as const,
        pattern: 'stars-gaze',
      },
    ],
  },
  {
    id: 'balance-flow',
    dimensionIndex: 4,
    title: 'Flow and balance',
    prompt: 'When life is uncertain or resources must be shared, you typically…',
    cards: [
      {
        id: 'balance-boat',
        label: 'Boat in balance',
        description: 'Steady the core, allocate step by step, keep flow balanced.',
        score: 2 as const,
        pattern: 'balance-boat',
      },
      {
        id: 'cautious-mountain',
        label: 'Cautious mountain',
        description: 'Guard what you have before exploring new directions.',
        score: -1 as const,
        pattern: 'cautious-mountain',
      },
      {
        id: 'flexible-wind',
        label: 'Flexible wind',
        description: 'Adjust allocation easily; behavior stays flexible.',
        score: 1 as const,
        pattern: 'flexible-wind',
      },
      {
        id: 'sensing-river',
        label: 'Sensing river',
        description: 'Feel inner rhythm first, then adjust the direction of flow.',
        score: 2 as const,
        pattern: 'sensing-river',
      },
    ],
  },
  {
    id: 'inner-peace',
    dimensionIndex: 5,
    title: 'Inner settling',
    prompt: 'When emotions surge or unease appears, you most often…',
    cards: [
      {
        id: 'still-lake',
        label: 'Still lake',
        description: 'Grow quiet first; like a lake mirroring what you feel.',
        score: 2 as const,
        pattern: 'still-lake',
      },
      {
        id: 'soft-candle',
        label: 'Soft candle',
        description: 'Gently soothe yourself until light returns.',
        score: 2 as const,
        pattern: 'soft-candle',
      },
      {
        id: 'guardian-tree',
        label: 'Guardian tree',
        description: 'Protect your core first, then process the feeling.',
        score: 1 as const,
        pattern: 'guardian-tree',
      },
      {
        id: 'wind-leaf-emotion',
        label: 'Leaf in wind',
        description: 'Emotions shift with the outer world; hard to settle quickly.',
        score: -2 as const,
        pattern: 'wind-leaf-emotion',
      },
    ],
  },
  {
    id: 'bloom-adapt',
    dimensionIndex: 6,
    title: 'Bloom and adapt',
    prompt: 'Facing change or the need to adjust, your natural tendency is…',
    cards: [
      {
        id: 'bloom-tree',
        label: 'Blooming tree',
        description: 'Treat change as soil; stretch and grow into it.',
        score: 2 as const,
        pattern: 'bloom-tree',
      },
      {
        id: 'stable-mountain',
        label: 'Stable mountain',
        description: 'Hold your ground, observe, then adjust slowly.',
        score: 1 as const,
        pattern: 'stable-mountain',
      },
      {
        id: 'wind-cloud',
        label: 'Cloud in wind',
        description: 'Flow with change—flexible, sometimes light.',
        score: -1 as const,
        pattern: 'wind-cloud',
      },
      {
        id: 'seed-awakening',
        label: 'Awakening seed',
        description: 'Nurture quietly within, then unfold through small daily acts.',
        score: 2 as const,
        pattern: 'seed-awakening',
      },
    ],
  },
  {
    id: 'efficacy-resonance',
    dimensionIndex: 7,
    title: 'Efficacy and resonance',
    prompt: 'Looking at your actions and what you long for, you most often feel…',
    cards: [
      {
        id: 'resonance-light',
        label: 'Resonance light',
        description: 'Action and values stay largely in natural harmony.',
        score: 2 as const,
        pattern: 'resonance-light',
      },
      {
        id: 'seeking-lamp',
        label: 'Seeking lamp',
        description: 'Strength feels low at times; more inner or outer support helps.',
        score: -1 as const,
        pattern: 'seeking-lamp',
      },
      {
        id: 'steady-path',
        label: 'Steady path',
        description: 'Trust that your steps can reach what matters.',
        score: 2 as const,
        pattern: 'steady-path',
      },
      {
        id: 'fog-walk',
        label: 'Walk in fog',
        description: 'Action and longing still need clearer alignment.',
        score: -2 as const,
        pattern: 'fog-walk',
      },
    ],
  },
]

export const dimensionQuestionsEn: QuestionItem[] = dimensions.map((d) => ({
  type: 'dimension' as const,
  ...d,
}))

export const attentionChecksEn: QuestionItem[] = [
  {
    type: 'attention',
    id: 'attention-star-explorer',
    prompt: 'To confirm you are present, please choose “Star explorer”.',
    requiredCardId: 'star-explorer',
    requiredCardLabel: 'Star explorer',
  },
  {
    type: 'attention',
    id: 'attention-stable-mountain',
    prompt: 'Please choose “Stable mountain” to show you are reading carefully.',
    requiredCardId: 'stable-mountain',
    requiredCardLabel: 'Stable mountain',
  },
]

export function buildQuestionFlowEn(): QuestionItem[] {
  const flow: QuestionItem[] = []
  dimensionQuestionsEn.forEach((q, index) => {
    flow.push(q)
    if (index === 1) flow.push(attentionChecksEn[0])
    if (index === 4) flow.push(attentionChecksEn[1])
  })
  return flow
}
