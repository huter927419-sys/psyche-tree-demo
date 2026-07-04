import type { BookId } from '../books/types'
import type { Locale } from './locale'
import { convertStringsDeep, resolveContentLocale } from './traditionalChinese'

const guides = {
  'psyche-tree': {
    zh: {
      tag: '仪轨 · 入定',
      field: '卷场 · 心湖场',
      title: '放松身心，感能量之波',
      body: '请先松肩闭息，静察心灵能量的起伏——待内息稍定，再缓缓择印作答。此卷照见自我，不收戏语与妄答，唯以诚心，雾中方留痕。',
    },
    en: {
      tag: 'Rite · Stillness',
      field: 'Volume field · Lake of self',
      title: 'Relax. Feel the spirit\'s tide.',
      body: 'Release your shoulders; breathe in quiet—sense inner energy rise and fall. This volume mirrors the self. Only sincerity is received by the mist.',
    },
    ja: {
      tag: '儀 · 入定',
      field: '巻場 · 心湖場',
      title: '身を弛め、霊の波を感じよ',
      body: '肩の力を抜き、静かに息を整え——内なるエネルギーの起伏を察せ。此巻は自我を映す。戯言も妄答も受けず、誠心のみが霧に痕を残す。',
    },
  },
  'emotional-flow': {
    zh: {
      tag: '礼镜 · 感映',
      field: '卷场 · 情流域',
      title: '先静后感，诚心来答',
      body: '让呼吸落定，观照情感能量的涨落——心稍澄明，再逐题慢选。此卷照见情流，勿以轻心敷衍，所择须是此刻真实。',
    },
    en: {
      tag: 'Mirror Rite · Presence',
      field: 'Volume field · River of feeling',
      title: 'Be still. Feel. Then answer.',
      body: 'Let breath settle; watch emotion\'s quiet waves. This volume mirrors feeling. Choose only what is true in this moment.',
    },
    ja: {
      tag: '礼鏡 · 感映',
      field: '巻場 · 情流域',
      title: '先に静め、感じ、答えよ',
      body: '呼吸を落ち着かせ、感情の波の涨落を見よ——心がやや澄んだら、一問ずつゆっくり選べ。此巻は情流を映す。軽心で済ませず、今真実のものだけを。',
    },
  },
  'mind-light': {
    zh: {
      tag: '观星 · 明思',
      field: '卷场 · 思脉场',
      title: '息定神清，再观思脉',
      body: '闭息数息，令游光稍聚——待思流稍定，再逐印慢择。此卷照见思维，不断优劣，只在雾中留痕。',
    },
    en: {
      tag: 'Star Rite · Mind',
      field: 'Volume field · Mind-vein',
      title: 'Still breath. Clear thought.',
      body: 'Breathe inward until scattered light gathers. This volume mirrors thought. Leave a trace in mist—not judgment.',
    },
    ja: {
      tag: '観星 · 明思',
      field: '巻場 · 思脈場',
      title: '息定め、思脈を観よ',
      body: '息を閉じ数え、游ぶ光をやや集めよ——思流が定まったら、一印ずつゆっくり選べ。此巻は思考を映す。優劣を断たず、霧に痕を残すのみ。',
    },
  },
  'bond-thread': {
    zh: {
      tag: '礼丝 · 缘书',
      field: '卷场 · 缘丝场',
      title: '观距观温，诚心择印',
      body: '忆亲近与退守之交，令缘丝稍显——再读下方问印，如实择光。此卷照见联结，毋饰毋避。',
    },
    en: {
      tag: 'Thread Rite · Bond',
      field: 'Volume field · Thread of bond',
      title: 'Watch distance and warmth.',
      body: 'Recall nearness and retreat; let the thread appear. This volume mirrors connection. Choose in truth.',
    },
    ja: {
      tag: '礼糸 · 縁書',
      field: '巻場 · 縁糸場',
      title: '距と温を観し、誠心で選べ',
      body: '親しさと退守の交わりを思い、縁糸をやや顕らかにせよ——下の問印を読み、如実に光を選べ。此巻は結びを映す。飾らず、避けず。',
    },
  },
  'flow-balance': {
    zh: {
      tag: '观流 · 流衡',
      field: '卷场 · 守流场',
      title: '感流守源，再择印',
      body: '先感能量之流：进与守、急与缓——待舟稍定，再逐题慢选。此卷照见守衡，不迫你偏激进或偏止息。',
    },
    en: {
      tag: 'Flow Rite · Balance',
      field: 'Volume field · Guarded flow',
      title: 'Feel the tide. Hold the source.',
      body: 'Sense advance and guard, haste and pause. This volume mirrors balance. No summons to bolder or stiller—only truth.',
    },
    ja: {
      tag: '観流 · 流衡',
      field: '巻場 · 守流場',
      title: '流れを感じ、源を守り、印を選べ',
      body: '先にエネルギーの流れを感じよ——進と守、急と緩。舟がやや定まったら、一問ずつゆっくり選べ。此巻は守衡を映す。激进か止息かを迫らず、真実のみ。',
    },
  },
  'direction-light': {
    zh: {
      tag: '礼光 · 向光',
      field: '卷场 · 向光场',
      title: '感向感步，诚心来答',
      body: '立雾中，先感心内那束光——或明或渺。此卷照见方向与步履，不问「应当」，只问「此刻指向」。',
    },
    en: {
      tag: 'Light Rite · Path',
      field: 'Volume field · Beam of path',
      title: 'Feel the beam. Feel the step.',
      body: 'Stand in mist; feel the light within—bright or veiled. This volume mirrors direction, not duty—only the pointing of now.',
    },
    ja: {
      tag: '礼光 · 向光',
      field: '巻場 · 向光場',
      title: '向きと歩みを感じて',
      body: '霧の中に立ち、内なる光を感じよ——明るくとも、かすかでも。この巻は方向を映す。「すべき」ではなく「今、指すもの」を問う。',
    },
  },
} as const satisfies Record<
  BookId,
  Record<'zh' | 'en' | 'ja', { tag: string; field: string; title: string; body: string }>
>

export type OpeningGuideCopy = {
  tag: string
  field: string
  title: string
  body: string
}

export function getOpeningGuide(
  bookId: BookId,
  locale: Locale,
): OpeningGuideCopy {
  const copy = guides[bookId][resolveContentLocale(locale)]
  return locale === 'zhTw' ? convertStringsDeep(copy) : copy
}
