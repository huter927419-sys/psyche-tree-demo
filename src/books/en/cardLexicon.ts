/** English card copy keyed by image pattern (shared art). */
export const CARD_LEXICON_EN: Record<
  string,
  { label: string; description: string }
> = {
  'steady-river': {
    label: 'Steady river',
    description: 'Inner flow moves with a quiet, clear rhythm.',
  },
  'wind-leaf': {
    label: 'Leaf in wind',
    description: 'Easily stirred by the breeze; direction turns with the moment.',
  },
  'mountain-guard': {
    label: 'Mountain keeper',
    description: 'Guard your ground first, then step forward with clarity.',
  },
  'star-explorer': {
    label: 'Star explorer',
    description: 'Small trials reveal which path resonates now.',
  },
  'deep-root-tree': {
    label: 'Deep-rooted tree',
    description: 'Rooted in dark soil—source steady and silent.',
  },
  'fog-path': {
    label: 'Path in fog',
    description: 'The way appears and vanishes; still you walk inward.',
  },
  'star-guide': {
    label: 'Star guide',
    description: 'A faint starlight hints at the next step.',
  },
  'drift-boat': {
    label: 'Drifting boat',
    description: 'Moored for now; source still waits in depth.',
  },
  'warm-hands': {
    label: 'Warm hands',
    description: 'Draw near with warmth while keeping your own shore.',
  },
  'shield': {
    label: 'Guardian shield',
    description: 'Close the shield to guard the heart until the wind passes.',
  },
  'silk-bridge': {
    label: 'Silk bridge',
    description: 'Open gradually once safety is felt.',
  },
  'stars-gaze': {
    label: 'Distant stars',
    description: 'Warmth at a distance—nearness and space together.',
  },
  'balance-boat': {
    label: 'Balance boat',
    description: 'Hold the center midstream; energy stays in flow.',
  },
  'cautious-mountain': {
    label: 'Cautious mountain',
    description: 'Hold the high ground; guard before you move.',
  },
  'flexible-wind': {
    label: 'Flexible wind',
    description: 'Shift with the moment—sometimes light, sometimes unmoored.',
  },
  'sensing-river': {
    label: 'Sensing river',
    description: 'Feel the current first, then adjust naturally.',
  },
  'still-lake': {
    label: 'Still lake',
    description: 'See the ripple before you answer it.',
  },
  'soft-candle': {
    label: 'Soft candle',
    description: 'Return warmth to yourself with gentle light.',
  },
  'guardian-tree': {
    label: 'Guardian tree',
    description: 'Trunk steady—protect the heart within.',
  },
  'wind-leaf-emotion': {
    label: 'Leaf in wind',
    description: 'Waves arrive before the mirror; rest returns slowly.',
  },
  'bloom-tree': {
    label: 'Blooming tree',
    description: 'Change becomes soil; branches reach toward light.',
  },
  'stable-mountain': {
    label: 'Stable mountain',
    description: 'Stand like a mountain—unmoved until you choose to move.',
  },
  'wind-cloud': {
    label: 'Cloud in wind',
    description: 'Mood drifts like cloud shadow—still finding ground.',
  },
  'seed-awakening': {
    label: 'Awakening seed',
    description: 'Source stirs underground—still breaking through.',
  },
  'resonance-light': {
    label: 'Resonance light',
    description: 'What matters shines clear; action echoes it.',
  },
  'seeking-lamp': {
    label: 'Seeking lamp',
    description: 'Carry a small lamp; truth gathers slowly.',
  },
  'steady-path': {
    label: 'Steady path',
    description: 'Steps follow the light—patient and rooted.',
  },
  'fog-walk': {
    label: 'Walk in fog',
    description: 'Mirror clouded, yet you keep walking inward.',
  },
  'gushing-spring': {
    label: 'Gushing spring',
    description: 'Feeling rises with gentle, usable force.',
  },
  'wind-ripple': {
    label: 'Wind ripple',
    description: 'Surface stirs—still searching its shape.',
  },
  'torrent-river': {
    label: 'Torrent river',
    description: 'Current runs strong—hard to still at once.',
  },
}

export function englishCard(
  pattern: string,
  fallbackLabel: string,
  fallbackDescription: string,
) {
  const entry = CARD_LEXICON_EN[pattern]
  return {
    label: entry?.label ?? fallbackLabel,
    description: entry?.description ?? fallbackDescription,
  }
}
