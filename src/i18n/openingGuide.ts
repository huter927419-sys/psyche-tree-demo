import type { BookId } from '../books/types'
import type { Locale } from './locale'

const guides = {
  'psyche-tree': {
    zh: {
      tag: '仪轨 · 入定',
      title: '放松身心，感能量之波',
      body: '请先松肩闭息，静察心灵能量的起伏——待内息稍定，再缓缓择印作答。此卷不收戏语与妄答，唯以诚心，雾中方留痕。',
    },
    en: {
      tag: 'Rite · Stillness',
      title: 'Relax. Feel the spirit\'s tide.',
      body: 'Release your shoulders; breathe in quiet—sense how inner energy rises and falls. Then answer slowly. Jest and haste leave no mark; only sincerity is received by the mist.',
    },
  },
  'emotional-flow': {
    zh: {
      tag: '礼镜 · 感映',
      title: '先静后感，诚心来答',
      body: '让呼吸落定，观照情感能量的涨落——心稍澄明，再逐题慢选。勿以轻心敷衍，勿以乱答戏弄；所择映心，须是此刻真实。',
    },
    en: {
      tag: 'Mirror Rite · Presence',
      title: 'Be still. Feel. Then answer.',
      body: 'Let breath settle; watch emotion\'s quiet waves. When the heart clears, choose each page with care—not in mockery, not at random—only what is true in this moment.',
    },
  },
} as const

export type OpeningGuideCopy = (typeof guides)[BookId][Locale]

export function getOpeningGuide(
  bookId: BookId,
  locale: Locale,
): OpeningGuideCopy {
  return guides[bookId][locale]
}
