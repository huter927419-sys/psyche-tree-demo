import type { DimensionResult } from '../types'

export const mysticalSymbolsEn: Record<
  number,
  Record<DimensionResult['level'], string>
> = {
  1: {
    high: 'On the tree, autonomous flow is a silver river from source to horizon, each bend mirroring inner rhythm.',
    'mid-high': 'The mountain guards the river mouth; energy balances boundary and flow.',
    mid: 'Ripples and shifting winds—the life-stream seeks its channel.',
    'mid-low': 'Leaves in cloud-shadow; the inner compass whispers you home.',
    low: 'A leaf turns in wind; outer forces guide for now, yet source waits beneath.',
  },
  2: {
    high: 'Roots in earth, branches in stars—direction shines on the tree’s axis.',
    'mid-high': 'Shadow and star-path weave; direction glimmers in the night.',
    mid: 'A fog path lengthens; each step nears an inner light.',
    'mid-low': 'A walker in mist; stars not yet gathered, but the way appears underfoot.',
    low: 'A small boat drifts; the tree’s shade is gentle—drift can be waiting.',
  },
  3: {
    high: 'Threads and starlight connect; where warm hands meet, branches tremble together.',
    'mid-high': 'A silk bridge spans banks; trust is woven slowly.',
    mid: 'Two stars share sky—distance and meeting in one orbit.',
    'mid-low': 'A half-open gate; connection waits for the right warmth.',
    low: 'The inner temple door rests closed—guarding is also wisdom.',
  },
  4: {
    high: 'The balance boat on the resource river; sap flows where branches need.',
    'mid-high': 'Wind and leaf dance—flexible, still rooted.',
    mid: 'Mountain and river speak; conserve and explore alternate on the tree.',
    'mid-low': 'Deep soil guards seed until season calls.',
    low: 'The river bends around stone; balance is still being learned.',
  },
  5: {
    high: 'Still lake mirrors stars; waves settle in sacred inner space.',
    'mid-high': 'Soft candle in the heart hall; the guardian tree holds you.',
    mid: 'Lake and wind alternate; depth shifts like tide.',
    'mid-low': 'Leaves shake; returning to mirror needs patience.',
    low: 'Leaf in wind seeks landing—every leaf returns to the tree.',
  },
  6: {
    high: 'Blooming branch meets season; seed wakes—change is rich rain.',
    'mid-high': 'Mountain still, gaze far; adaptation grows in slow tree-shadow.',
    mid: 'Cloud follows wind—flexible and light are both sky’s faces.',
    'mid-low': 'Cloud passes the crown; adaptation seeks root and flow together.',
    low: 'Change is wind; seed power waits in small daily acts.',
  },
  7: {
    high: 'Resonance light climbs the trunk; action and longing share one frequency.',
    'mid-high': 'Steady path among roots; belief rings year by year.',
    mid: 'Walker in fog; distant light waits—clarifying is the path.',
    'mid-low': 'Lamp in dark; strength gathers; stars will make a road.',
    low: 'Longing like a far star calls you inward to hear true want.',
  },
}

export const openingsEn = [
  'In the tree’s silence, your energy appears like ancient script.',
  'The tree opens a door inward—this is how life-energy moves now.',
  'Old wisdom murmurs: each branch mirrors your present inner state.',
]

export const closingsEn = [
  'May you speak gently with yourself under the tree; river, star, and root take shape in time.',
  'The tree does not hurry leaves; the river does not hurry its course—your rhythm has its time.',
  'When wind crosses the branches, each inward listening etches new light on the tree.',
]

export const mysticalPromptTemplateEn = `You are a reader of life symbol and inner wisdom.
Based on the psychological profile below, write a sacred, poetic interpretation in English.
Use the tree of life, river, starlight, thread, and mountain as symbols.
Tone: gentle and timeless. Do not say "your choice was X"; describe energy and flow.
Profile:
[PSYCHOLOGY]
Write one coherent interpretation in English.`
