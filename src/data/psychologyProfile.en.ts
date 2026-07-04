import type { DimensionResult } from '../types'

export const dimensionDescriptionsEn: Record<
  number,
  Record<DimensionResult['level'], string>
> = {
  1: {
    high: 'In important choices you sense inner rhythm first, then move with clear steady flow—strong autonomy.',
    'mid-high': 'You guard boundaries while choosing—grounded, with room to explore.',
    mid: 'Your way of choosing shifts with context—sometimes inner-led, sometimes environment-led.',
    'mid-low': 'Important choices are often shaped by outside information or others’ expectations.',
    low: 'Direction feels unclear in choice; you tend to drift with circumstance.',
  },
  2: {
    high: 'You sense life direction clearly—rooted like a tree or guided like stars while you grow.',
    'mid-high': 'You hold a basic sense of direction and allow calibration through exploration.',
    mid: 'Direction is bright at times, dim at others—you are mapping your own chart.',
    'mid-low': 'Direction is not yet stable; you walk between fog and small paths.',
    low: 'You rarely plan direction actively; life’s current carries you.',
  },
  3: {
    high: 'In close ties you lean toward warmth, support, and response—connection feels open.',
    'mid-high': 'You value bond and deepen trust once safety is felt.',
    mid: 'You balance nearness and guarding; style shifts with each relationship.',
    'mid-low': 'You keep psychological distance until trust has time to form.',
    low: 'You protect inner space; closeness arrives cautiously.',
  },
  4: {
    high: 'With uncertainty you steady the core and flex allocation—overall balance holds.',
    'mid-high': 'You adjust to context while keeping some conservative guard.',
    mid: 'Flow and guard trade places depending on pressure and setting.',
    'mid-low': 'You conserve resources first and watch new directions carefully.',
    low: 'Under uncertainty, balance in sharing and deciding is hard to find quickly.',
  },
  5: {
    high: 'When emotions rise you can quiet down and mirror feeling, or soothe gently.',
    'mid-high': 'You guard the core first, then process and transform emotion.',
    mid: 'Capacity to settle varies—sometimes stable, sometimes easily stirred.',
    'mid-low': 'After waves, you need more time to feel steady again.',
    low: 'Emotions follow the outer world; quick settling is still growing.',
  },
  6: {
    high: 'You treat change as nourishment and adapt by stretching and growing.',
    'mid-high': 'You root first, observe, then adjust with care.',
    mid: 'You are open yet reserved; pace of adaptation depends on the change.',
    'mid-low': 'You flow with change but sometimes lack a firm landing place.',
    low: 'Adaptation paths are unclear; you move mostly with the moment.',
  },
  7: {
    high: 'Action and inner values largely resonate—you trust steps toward what matters.',
    'mid-high': 'You have basic confidence in efficacy while still aligning longing and deed.',
    mid: 'Action and longing align sometimes; other times need clearer bridge.',
    'mid-low': 'Strength feels low at times; support is needed between will and walk.',
    low: 'A noticeable gap remains between action and what the heart seeks.',
  },
}

export const incompleteDimensionEn = 'Information for this dimension is incomplete.'
