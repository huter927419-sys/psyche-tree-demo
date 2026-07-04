import type { CardOption } from '../../types'

const card = (
  id: string,
  label: string,
  description: string,
  score: CardOption['score'],
  pattern: string,
): CardOption => ({ id, label, description, score, pattern })

export function buildEnDimensions() {
  return [
    {
      id: 'flow-overall',
      dimensionIndex: 1,
      title: 'Overall emotional flow',
      prompt: 'Which inner flow best matches your recent emotional state?',
      cards: [
        card('ef-calm-lake', 'Calm lake', 'Feelings like a quiet lake—steady and clear inside.', 2, 'still-lake'),
        card('ef-gushing-spring', 'Rising spring', 'Vitality rises gently, warm and manageable.', 1, 'gushing-spring'),
        card('ef-wind-ripple', 'Wind ripples', 'Occasional shifts, like breeze on water.', -1, 'wind-ripple'),
        card('ef-torrent-river', 'Torrent river', 'Strong waves, hard to settle quickly.', -2, 'torrent-river'),
      ],
    },
    {
      id: 'flow-expression',
      dimensionIndex: 2,
      title: 'Emotional expression',
      prompt: 'When you need to express feeling, what tendency appears most?',
      cards: [
        card('ef-soft-candle', 'Soft candle', 'Warm, clear expression flows naturally.', 2, 'soft-candle'),
        card('ef-resonance', 'Resonance light', 'Reserved yet sincere when words arrive.', 1, 'resonance-light'),
        card('ef-wind-leaf', 'Leaf in wind', 'Expression shifts with context—near or hidden.', -1, 'wind-leaf-emotion'),
        card('ef-fog-walk', 'Walk in fog', 'Hard to speak; much stays in inner mist.', -2, 'fog-walk'),
      ],
    },
    {
      id: 'flow-connection',
      dimensionIndex: 3,
      title: 'Emotional connection',
      prompt: 'When someone’s feeling draws near, your inner response is like…',
      cards: [
        card('ef-warm-hands', 'Warm hands', 'Open to closeness with responsive warmth.', 2, 'warm-hands'),
        card('ef-silk-bridge', 'Silk bridge', 'Connection deepens once safety is clear.', 1, 'silk-bridge'),
        card('ef-shield', 'Guardian shield', 'Some distance until trust has time.', -1, 'shield'),
        card('ef-stars-gaze', 'Stars gazing', 'Prefer distance, watching more than merging.', -2, 'stars-gaze'),
      ],
    },
    {
      id: 'flow-body',
      dimensionIndex: 4,
      title: 'Emotional body sense',
      prompt: 'Lately, emotion most often shows in your body as…',
      cards: [
        card('ef-steady-river', 'Steady river', 'Body and feeling move in steady rhythm.', 2, 'steady-river'),
        card('ef-sensing', 'Sensing river', 'You notice body signals and meet them kindly.', 1, 'sensing-river'),
        card('ef-wind-cloud', 'Cloud in wind', 'Heaviness or lightness shifts with mood.', -1, 'wind-cloud'),
        card('ef-flexible-wind', 'Flexible wind', 'Body follows emotional weather, hard to land.', -2, 'flexible-wind'),
      ],
    },
    {
      id: 'flow-recovery',
      dimensionIndex: 5,
      title: 'Waves and recovery',
      prompt: 'When emotional waves rise, you usually…',
      cards: [
        card('ef-still-mirror', 'Still mirror', 'Return to calm relatively quickly.', 2, 'still-lake'),
        card('ef-mountain', 'Stable mountain', 'Hold the core, then let feeling subside.', 1, 'stable-mountain'),
        card('ef-drift', 'Drifting boat', 'Need longer before feeling moored again.', -1, 'drift-boat'),
        card('ef-fog-path', 'Path in fog', 'Recovery path unclear; linger in mist.', -2, 'fog-path'),
      ],
    },
    {
      id: 'flow-change',
      dimensionIndex: 6,
      title: 'Feeling in change',
      prompt: 'When change stirs emotional waves, you…',
      cards: [
        card('ef-seed', 'Awakening seed', 'Change can nourish growth and meaning.', 2, 'seed-awakening'),
        card('ef-bloom', 'Blooming tree', 'Hope remains; feeling slowly opens.', 1, 'bloom-tree'),
        card('ef-balance-boat', 'Boat in balance', 'You try to stay level, yet it costs effort.', -1, 'balance-boat'),
        card('ef-cautious', 'Cautious mountain', 'You tighten to guard inner stability.', -2, 'cautious-mountain'),
      ],
    },
    {
      id: 'flow-integration',
      dimensionIndex: 7,
      title: 'Emotional integration',
      prompt: 'With mixed or contradictory feelings, you tend to…',
      cards: [
        card('ef-seeking-lamp', 'Seeking lamp', 'Light mixed tones and sort them slowly.', 2, 'seeking-lamp'),
        card('ef-steady-path', 'Steady path', 'Integrate with patience, step by step.', 1, 'steady-path'),
        card('ef-star-explorer', 'Star explorer', 'Still exploring; not fully woven yet.', -1, 'star-explorer'),
        card('ef-deep-fog', 'Deep fog path', 'Contradictions tangle; hard to unify now.', -2, 'fog-path'),
      ],
    },
    {
      id: 'flow-trend',
      dimensionIndex: 8,
      title: 'Flow of change',
      prompt: 'Intuitively, your recent feeling seems headed toward…',
      cards: [
        card('ef-star-guide', 'Star guide', 'Toward clearer, more harmonious flow.', 2, 'star-guide'),
        card('ef-guardian', 'Guardian tree', 'Gently upward; roots steadier, branches opening.', 1, 'guardian-tree'),
        card('ef-wind-leaf2', 'Leaf on wind', 'Direction unclear; drifting with circumstance.', -1, 'wind-leaf'),
        card('ef-torrent2', 'Undercurrent river', 'Energy still churns beneath; care is needed.', -2, 'torrent-river'),
      ],
    },
  ]
}
