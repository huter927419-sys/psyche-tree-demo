import type { BookId } from '../types'
import type { LevelDescriptions } from '../shared/profileHelpers'
import type { BookEnStrings } from './buildEnPack'

const lv = (
  high: string,
  midHigh: string,
  mid: string,
  midLow: string,
  low: string,
) => ({ high, 'mid-high': midHigh, mid, 'mid-low': midLow, low })

const PSYCHE_TREE: BookEnStrings = {
  meta: {
    shelfTitle: 'Mindscape',
    coverTitle: 'Mindscape',
    spineLabel: 'Mindscape',
    coverSubtitle: 'Six inner seals',
    coverTagline: 'Mirror the inner mist',
    coverHint:
      'Six seals mirror the inner self; one seal gathers the whole—no judgment, only this page in mist.',
    domainLabel: 'Inner self',
    integrationLabel: 'Observe · Whole',
  },
  dimensionTitles: [
    'Boundary stone',
    'Ripple mirror',
    'Still breath',
    'Inner mirror',
    'Tree-heart guard',
    'Root breath',
  ],
  dimensionPrompts: [
    'When the outer world expects closeness, how does your inner space usually respond?',
    'When ripples rise on the inner lake, what happens first?',
    'After a wave passes, how do you usually return to stillness?',
    'When you mirror yourself inward, what do you most often see?',
    'When outer winds rise, how do you usually guard within?',
    'When you sense your inner source, which image feels closest?',
  ],
  integrationTitle: 'Observe · Whole',
  integrationPrompt:
    'Standing in mist—boundary, lake, and root woven together—which whole image feels closest now?',
  attentionCardLabel: 'Star explorer',
  psychDescriptions: {
    1: lv(
      'You tend to keep a clear inner boundary—nearness and retreat find their own stone.',
      'You guard and open in turn; door and wall share the same shore.',
      'Inner space opens and closes with the hour.',
      'The boundary sits tight; retreat comes before reach.',
      'Inner space is easily stirred; the boundary stone is still finding its place.',
    ),
    2: lv(
      'When the lake ripples, you often see the wave before you are carried by it.',
      'You notice the ripple, then choose your response.',
      'Ripple-awareness comes and goes.',
      'The wave often arrives before the mirror.',
      'The lake is taken by waves first; mirror-skill is still growing.',
    ),
    3: lv(
      'After disturbance, you often return to still lake, guarded flame, or soft light.',
      'You steady the core, then let feeling settle.',
      'Return to stillness varies with the season.',
      'The path back is long; patience is part of the rite.',
      'Stillness is hard to find; the leaf still follows wind.',
    ),
    4: lv(
      'You often mirror yourself in still water without rushing outward for proof.',
      'Self-mirror is slow but honest; light still appears.',
      'Mirror and fog alternate.',
      'Dust on the mirror; self-seeing needs time.',
      'Inward mirror is rare; much remains in mist.',
    ),
    5: lv(
      'You guard the tree-heart; outer wind seldom scatters you.',
      'Guard and openness share one trunk.',
      'Inner guard tightens and loosens with pressure.',
      'Outer stir reaches inward; guard must be recalled.',
      'The inner wall is thin; self scatters easily.',
    ),
    6: lv(
      'You sense root-breath—source steady in dark soil.',
      'Roots are forming; you can still return to source.',
      'Root-sense flickers; source is still being named.',
      'Roots feel shallow; you float above your source.',
      'Source feels distant; the boat waits for mooring.',
    ),
    7: lv(
      'Forces meet in a steady whole—boundary, lake, and root echo one tree-shadow.',
      'The whole image clarifies; facets mostly align.',
      'The whole is still forming; some tension remains.',
      'The whole scatters; forces not yet one.',
      'Whole image stays in fog; clearer seeing is still arriving.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'In mist the self appears as tree-shadow—boundary and root on one page.',
    'Six seals fall by the inner lake; this is how you hold yourself in this hour.',
  ],
  closings: [
    'May you mirror yourself gently—boundary and root each have their sacred season.',
    'The tree does not hurry branches; the lake does not hurry stillness.',
  ],
  resultChapterLabels: [
    'Final · Inner portrait',
    'Final · Root oracle',
    'Back · Close',
  ],
}

PSYCHE_TREE.mysticalSymbols = PSYCHE_TREE.psychDescriptions

const EMOTIONAL_FLOW: BookEnStrings = {
  meta: {
    shelfTitle: 'Heart Mirror',
    coverTitle: 'Heart Mirror',
    spineLabel: 'Heart Mirror',
    coverSubtitle: 'Six feeling currents',
    coverTagline: 'Mirror the feeling lake',
    coverHint:
      'Six currents mirror emotion; one lake gathers all—no judgment, only this reflection.',
    domainLabel: 'Feeling',
    integrationLabel: 'Observe · Whole lake',
  },
  dimensionTitles: [
    'Current tide',
    'Word of feeling',
    'Bond current',
    'Body current',
    'Resting wave',
    'Change in feeling',
  ],
  dimensionPrompts: [
    'When you sense recent feeling, which inner flow is it most like?',
    'When feeling must be expressed, what tendency appears most often?',
    'When another’s feeling draws near, how does your inner self respond?',
    'Lately, how does feeling show itself in the body?',
    'When emotional waves rise, what do you usually do?',
    'When change stirs feeling in bonds or place, how do you respond?',
  ],
  integrationTitle: 'Observe · Whole lake',
  integrationPrompt:
    'Feelings have surged and stilled—if only one lake-face remains, which is closest?',
  attentionCardLabel: 'Warm hands',
  psychDescriptions: {
    1: lv(
      'Overall feeling energy is clear and steady, like a still lake under stars.',
      'Feeling moves with gentle force—mostly contained.',
      'Feeling rises and falls like wind on water.',
      'Feeling runs quick; calm needs more time and space.',
      'Feeling pours like a torrent—hard to still at once.',
    ),
    2: lv(
      'You express feeling with gentle clarity; inner and outer mostly align.',
      'Expression is sincere though quiet; words come when the hour is right.',
      'Expression shifts with setting—clear, then withdrawn.',
      'Much feeling stays unspoken beneath the surface.',
      'Feeling hides in fog; the voice path is unclear.',
    ),
    3: lv(
      'You welcome emotional nearness with warmth and workable boundaries.',
      'Bond deepens after safety is felt.',
      'Near and far alternate with the relationship.',
      'Distance is kept; trust needs time.',
      'Feeling stays remote; guarding the inner room is primary.',
    ),
    4: lv(
      'Body and feeling move together; bodily signals are kindly heard.',
      'Body sense is present and conversed with gently.',
      'Body-feeling shifts with mood.',
      'Tension or float in the body carries unsettled feeling.',
      'Body and feeling are thinly linked; waves move the whole self.',
    ),
    5: lv(
      'After waves, you return to calm with relative ease.',
      'You steady the core, then let feeling ebb.',
      'Recovery speed varies with the event.',
      'Long mooring is needed before shore feels near.',
      'The path back to calm is hard to find.',
    ),
    6: lv(
      'Change becomes nourishment for emotional growth.',
      'You adapt; feeling finds new balance in time.',
      'Response to change is still learning its shape.',
      'Change tightens or scatters feeling; stability thins.',
      'Change overwhelms; the adaptive path is unclear.',
    ),
    7: lv(
      'Feelings meet in a clear lake—currents mostly share one direction.',
      'The whole lake clarifies; minor ripples remain.',
      'The whole lake is still forming.',
      'The lake runs cloudy; feelings not yet one.',
      'Whole lake stays in mist; trust the river to lead shoreward.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'In the river’s silence your feeling-currents trace silver lines.',
    'River, star, and thread weave a map of how feeling moves now.',
  ],
  closings: [
    'May you watch your feeling-currents with tenderness—they are not late.',
    'The river does not hurry its direction; your rhythm has its time.',
  ],
  resultChapterLabels: [
    'Final · Emotional portrait',
    'Final · Heart oracle',
    'Back · Close',
  ],
}

EMOTIONAL_FLOW.mysticalSymbols = EMOTIONAL_FLOW.psychDescriptions

const MIND_LIGHT: BookEnStrings = {
  meta: {
    shelfTitle: 'Mind Light',
    coverTitle: 'Mind Light',
    spineLabel: 'Mind Light',
    coverSubtitle: 'Six thought currents',
    coverTagline: 'Mirror the star of mind',
    coverHint:
      'Six lights mirror thought; one ray gathers all—no judgment, only traces in mist.',
    domainLabel: 'Thought',
    integrationLabel: 'Observe · Returning light',
  },
  dimensionTitles: [
    'Thought flow',
    'Learning pattern',
    'Focus mirror',
    'Discerning light',
    'Creative spring',
    'Choosing seal',
  ],
  dimensionPrompts: [
    'Before a crossroads moves, how does your thought-flow usually run?',
    'When new pattern enters the scroll, how do you usually take it in?',
    'When one thought begins, where does your light usually rest?',
    'When many shadows fill the fog, how do you discern light?',
    'When the spring opens, where do your ideas usually rise from?',
    'When the seal is ready to fall, how do you usually choose?',
  ],
  integrationTitle: 'Observe · Returning light',
  integrationPrompt:
    'Thought and feeling share one table—where does the main light fall?',
  attentionCardLabel: 'Still lake',
  psychDescriptions: {
    1: lv(
      'Thought moves with rhythm—pause before motion, flow before haste.',
      'You mostly pause briefly, then act with measure.',
      'Thought-flow speeds and slows with the day.',
      'Action often precedes reflection.',
      'Thought scatters with the setting; stillness is hard to hold.',
    ),
    2: lv(
      'You learn through the door that fits—reading, touch, dialogue, or solitude.',
      'Learning has preference yet stays flexible.',
      'Study paths shift; no single door yet constant.',
      'New pattern enters with difficulty.',
      'The learning path is still unclear in mist.',
    ),
    3: lv(
      'Attention holds like a deep mirror—one beam, long held.',
      'Focus is usually enough; wanderings are brief.',
      'Focus deepens and thins like tide.',
      'Light moves often; mirror cracks quickly.',
      'Thought fragments; focus is hard to sustain.',
    ),
    4: lv(
      'You sort shadow into order—part and whole both seen.',
      'Analysis has bias yet glimpses the whole room.',
      'Sort and sweep alternate; clarity not constant.',
      'Shadows tangle; reasoning stumbles.',
      'Many images in fog; discernment path unclear.',
    ),
    5: lv(
      'Creative spring runs—links near and far with ease.',
      'Ideas have season—surge and hush.',
      'Spring opens and seals; source still sought.',
      'Links come slowly; outside spark often needed.',
      'Ideas hide in fog; gathering is hard.',
    ),
    6: lv(
      'You choose with balance—speed and depth weigh together.',
      'Choices mostly land; occasional re-see needed.',
      'Decide and delay alternate.',
      'Haste or long stall skews the seal.',
      'Seal hangs in fog; path not yet chosen.',
    ),
    7: lv(
      'Lights return to one constellation—thought paths mostly align.',
      'Main light clarifies; secondary rays remain.',
      'Many lights cross; return-point unset.',
      'Light scatters; main path unclear.',
      'Returning light still behind mist.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'Star-map opens in mist—these are the light-paths of thought now.',
    'Light walks the channels; six seals mark how mind moves this hour.',
  ],
  closings: [
    'May you mirror thought without haste—light gathers in its season.',
    'Stars do not punish wandering light; your return has its time.',
  ],
  resultChapterLabels: ['Final · Mind portrait', 'Final · Mind oracle', 'Back · Close'],
}

MIND_LIGHT.mysticalSymbols = MIND_LIGHT.psychDescriptions

const BOND_THREAD: BookEnStrings = {
  meta: {
    shelfTitle: 'Bond Book',
    coverTitle: 'Bond Book',
    spineLabel: 'Bond Book',
    coverSubtitle: 'Six bond threads',
    coverTagline: 'Mirror the thread bridge',
    coverHint:
      'Six threads mirror connection; one weave gathers all—no judgment, only a line in mist.',
    domainLabel: 'Bond',
    integrationLabel: 'Observe · Whole weave',
  },
  dimensionTitles: [
    'Thread near',
    'Thread warm',
    'Thread distance',
    'Thread trust',
    'Thread guard',
    'Thread repair',
  ],
  dimensionPrompts: [
    'With someone important, how does your thread usually approach?',
    'In bond, how do you usually pass warmth?',
    'Between closeness and distance, where does your thread rest?',
    'When trust is woven, how do you usually lay the thread?',
    'When bond-winds rise, how do you guard the thread?',
    'When a thread frays, how do you usually respond?',
  ],
  integrationTitle: 'Observe · Whole weave',
  integrationPrompt:
    'Threads cross—if one weave-image appears, which feels closest?',
  attentionCardLabel: 'Distant stars',
  psychDescriptions: {
    1: lv(
      'You draw near with warmth while keeping your shore.',
      'Nearness and retreat share one bridge.',
      'Thread near and far shifts with the bond.',
      'Distance comes first; closeness waits.',
      'Thread stays far; guarding inner space is primary.',
    ),
    2: lv(
      'Warmth passes sincerely—felt without performance.',
      'Warmth is quiet but real when offered.',
      'Warmth on the thread varies with mood.',
      'Warmth stays inward; expression is thin.',
      'Warmth hides; the thread feels cool.',
    ),
    3: lv(
      'Distance holds warmth—space and nearness together.',
      'Thread distance is mostly workable.',
      'Distance tightens and loosens with trust.',
      'Thread runs tight or slack without center.',
      'Distance unsettled; bond feels unstable.',
    ),
    4: lv(
      'Trust weaves slowly but holds weight when laid.',
      'Trust grows through tested steps.',
      'Trust thickens and thins with time.',
      'Trust frays easily; repair is frequent.',
      'Trust is faint; bridge still in fog.',
    ),
    5: lv(
      'Boundary is clear yet not cold—gate and bridge coexist.',
      'Guard and openness share one stone.',
      'Guard tightens under stress.',
      'Boundary thick; thread barely outward.',
      'Gate stays closed; bond waits for wind.',
    ),
    6: lv(
      'Frays become re-weaving—breaks can nourish new thread.',
      'Repair is slow but willing.',
      'Repair uneven; some breaks linger.',
      'Frays last; re-weave is tiring.',
      'Breaks tangle; repair path unclear.',
    ),
    7: lv(
      'Threads meet in one weave—near, warm, distance, trust mostly align.',
      'Whole weave clarifies; loose threads remain.',
      'Weave still forming; pulls remain.',
      'Weave scatters; bond image unset.',
      'Whole weave in mist; patience for the pattern.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'Bond threads appear in mist—this is how you meet and guard connection.',
    'Bridge and distant star—six seals on the weave of bond.',
  ],
  closings: [
    'May you mirror bond gently—distance and warmth each have their hour.',
    'Bridge does not hurry to close; stars do not blame distance.',
  ],
  resultChapterLabels: ['Final · Bond portrait', 'Final · Bond oracle', 'Back · Close'],
}

BOND_THREAD.mysticalSymbols = BOND_THREAD.psychDescriptions

const FLOW_BALANCE: BookEnStrings = {
  meta: {
    shelfTitle: 'Flow Balance',
    coverTitle: 'Flow Balance',
    spineLabel: 'Flow Balance',
    coverSubtitle: 'Six balance measures',
    coverTagline: 'Mirror the midstream boat',
    coverHint:
      'Six measures mirror balance; one current gathers all—no judgment, only the boat in mist.',
    domainLabel: 'Balance',
    integrationLabel: 'Observe · Whole current',
  },
  dimensionTitles: [
    'Split force',
    'Guard source',
    'Mist walk',
    'Haste and pause',
    'Turn the tide',
    'Hold the boat',
  ],
  dimensionPrompts: [
    'When force and resource must be divided, how do you usually split?',
    'When uncertainty comes, how do you guard your source?',
    'Walking in fog, how do you usually find your step?',
    'Between haste and pause, where does your flow rest?',
    'When the tide turns suddenly, how do you turn with it?',
    'Under pressure, how do you keep the boat from capsizing?',
  ],
  integrationTitle: 'Observe · Whole current',
  integrationPrompt:
    'Currents meet—if one river-face reflects the whole, which is closest?',
  attentionCardLabel: 'Star explorer',
  psychDescriptions: {
    1: lv(
      'You divide force from center—flow balanced, not rigid.',
      'Allocation mostly fair; bias appears at edges.',
      'Splitting shifts with pressure.',
      'Guard or spend skews; balance still learning.',
      'Force scatters; midstream unsettled.',
    ),
    2: lv(
      'You guard the well before opening new channels.',
      'Source and exploration share one plan.',
      'Guard tightens and loosens with risk.',
      'Source hoarded; new paths narrow.',
      'Source unclear; guard and spend both hard.',
    ),
    3: lv(
      'Steps in fog are slow but not lost.',
      'Mist walk mostly steady with a lamp.',
      'Pause and stumble alternate in fog.',
      'Fog long; mooring frequent.',
      'Path in fog often lost.',
    ),
    4: lv(
      'Haste and pause keep rhythm like tide.',
      'Pace mostly fit; occasional surge or stall.',
      'Rhythm shifts with stress.',
      'Rush or delay dominates.',
      'Flow without measure; boat unsteady.',
    ),
    5: lv(
      'Rudder turns without losing center.',
      'Turning learns with each season.',
      'Turns sometimes late or sharp.',
      'Tide scatters direction.',
      'Turn path unclear in churn.',
    ),
    6: lv(
      'Boat holds under weight—mountain inside the hull.',
      'Boat sways but does not sink.',
      'Boat rocks; balance practiced.',
      'Pressure tips balance often.',
      'Boat follows every wave.',
    ),
    7: lv(
      'Currents share one river-face—split, guard, and move align.',
      'Whole current clarifies; eddies remain.',
      'Whole current forming; cross-pulls remain.',
      'Current scatters in mist.',
      'Whole current not yet visible.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'Midstream appears in mist—this is how you hold and move through uncertainty.',
    'Boat and mountain—six seals on the measure of balance.',
  ],
  closings: [
    'May you mirror balance without blame—flow finds its channel.',
    'River does not punish the boat; mountain does not hurry stillness.',
  ],
  resultChapterLabels: [
    'Final · Balance portrait',
    'Final · Balance oracle',
    'Back · Close',
  ],
}

FLOW_BALANCE.mysticalSymbols = FLOW_BALANCE.psychDescriptions

const DIRECTION_LIGHT: BookEnStrings = {
  meta: {
    shelfTitle: 'Path Light',
    coverTitle: 'Path Light',
    spineLabel: 'Path Light',
    coverSubtitle: 'Six path bearings',
    coverTagline: 'Mirror the beam ahead',
    coverHint:
      'Six bearings mirror direction; one light gathers all—no judgment, only footprints in mist.',
    domainLabel: 'Direction',
    integrationLabel: 'Observe · Whole light',
  },
  dimensionTitles: [
    'Beam direction',
    'Weight of value',
    'Walking step',
    'Resonance',
    'Held vow',
    'Probe the path',
  ],
  dimensionPrompts: [
    'When you pause to feel direction, what is the inner beam like?',
    'Between what is heavy and light in you, what clarifies?',
    'Between heart-direction and footstep, how do you usually walk?',
    'Looking back at action and longing, what resonance do you feel?',
    'When short fog arrives, how do you hold your vow?',
    'When the path is unclear, how do you probe for light?',
  ],
  integrationTitle: 'Observe · Whole light',
  integrationPrompt:
    'Bearings cross—if one whole light appears, which is closest?',
  attentionCardLabel: 'Star explorer',
  psychDescriptions: {
    1: lv(
      'Direction feels rooted—beam steady like tree toward sky.',
      'Beam mostly present; fine tuning continues.',
      'Direction brightens and dims like weather.',
      'Beam faint; path searched in mist.',
      'Direction ungathered; boat moored in waiting.',
    ),
    2: lv(
      'What matters is named; values anchor action.',
      'Meaning mostly clear; occasional veil.',
      'Values shift with season.',
      'Meaning thin; naming is hard.',
      'Values hide in fog.',
    ),
    3: lv(
      'Steps follow the beam—foot and heart mostly aligned.',
      'Alignment mostly holds; gaps appear at turns.',
      'Step and heart alternate lead.',
      'Feet lag heart or heart lags feet.',
      'Step and longing noticeably apart.',
    ),
    4: lv(
      'Action echoes what matters—resonance felt in the body.',
      'Resonance usually present; doubt occasional.',
      'Resonance strong and weak by task.',
      'Force feels thin; resonance needs support.',
      'Action and longing clearly distant.',
    ),
    5: lv(
      'Vow holds through short fog—flame guarded not extinguished.',
      'Vow mostly steady; wind tests it.',
      'Vow shifts with pressure.',
      'Vow bends to circumstance.',
      'Vow flickers; candle needs shelter.',
    ),
    6: lv(
      'Small steps test light—neither rash nor frozen.',
      'Probing patient; lamp advances slowly.',
      'Probe and pause alternate.',
      'Fear of wrong step stalls; rash step also appears.',
      'Path probe mostly lost in fog.',
    ),
    7: lv(
      'Bearings meet in one light—direction, step, vow mostly one.',
      'Whole light gathers; stray beams remain.',
      'Whole light forming; pulls remain.',
      'Light scatters among paths.',
      'Whole light still behind mist.',
    ),
  },
  mysticalSymbols: {} as LevelDescriptions,
  openings: [
    'Direction-light appears in mist—bearings and steps on one page.',
    'Beam and path—six seals on how you orient and walk.',
  ],
  closings: [
    'May you mirror direction without haste—the beam shows in its season.',
    'Star does not punish slow steps; path light returns.',
  ],
  resultChapterLabels: ['Final · Path portrait', 'Final · Path oracle', 'Back · Close'],
}

DIRECTION_LIGHT.mysticalSymbols = DIRECTION_LIGHT.psychDescriptions

export const BOOK_EN_STRINGS: Record<BookId, BookEnStrings> = {
  'psyche-tree': PSYCHE_TREE,
  'emotional-flow': EMOTIONAL_FLOW,
  'mind-light': MIND_LIGHT,
  'bond-thread': BOND_THREAD,
  'flow-balance': FLOW_BALANCE,
  'direction-light': DIRECTION_LIGHT,
}
