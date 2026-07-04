import type { BookId } from '../books/types'
import type { Locale } from './locale'
import { convertStringsDeep, resolveContentLocale } from './traditionalChinese'

export type RiteStep = {
  sectionLabel: string
  title?: string
  paragraphs: string[]
  /** Optional one-line reflection before viewing results */
  journalPrompt?: string
}

export type VolumeEntryRite = {
  volumeTitle: string
  facetLabel: string
  steps: RiteStep[]
}

export type CoreProposition = {
  main: string
  sub: string
}

type LocalePack = Record<'zh' | 'en' | 'ja', CoreProposition>

const coreProposition: LocalePack = {
  zh: {
    main: '人的一生，不是在寻找答案，而是在不断校准自己看见世界、感受世界、与世界相处的方式。',
    sub: '世界未必因你而改变，但你看见世界的方式，会不断改变你自己。',
  },
  en: {
    main: 'A life is not a search for answers, but a continual calibration of how you see, feel, and meet the world.',
    sub: 'The world may not change because of you—but the way you see it keeps changing you.',
  },
  ja: {
    main: '人生は答えを探す旅ではなく、世界の見方・感じ方・向き合い方を調え続ける旅である。',
    sub: '世界はあなたのために変わらなくても、あなたの見方は、あなた自身を変え続ける。',
  },
}

export type ReturnTreePack = {
  tag: string
  title: string
  subtitle: string
  steps: RiteStep[]
  closing: string
}

const returnToTree: Record<'zh' | 'en' | 'ja', ReturnTreePack> = {
  zh: {
    tag: '终卷 · 归树',
    title: '归树',
    subtitle: '树一直在那里',
    steps: [
      {
        sectionLabel: '归树仪式',
        paragraphs: [
          '闭上眼。',
          '想像自己重新站在那棵树前。',
          '第一次来到这里时，树没有改变。',
          '今天再次回来，树依然没有改变。',
          '改变的是：你开始能够看见，以前没有看见的枝叶。',
        ],
      },
      {
        sectionLabel: '照见',
        paragraphs: [
          '于是你会明白：',
          '树从来不是答案。',
          '树只是照见你的镜子。',
          '成长的，不是树——是观看树的人。',
        ],
      },
    ],
    closing: '六向已齐。整象神谕在雾中等待——不是总结，而是归树之后，整片树影的一次开口。',
  },
  en: {
    tag: 'Final rite · Return to the Tree',
    title: 'Return to the Tree',
    subtitle: 'The tree was always there',
    steps: [
      {
        sectionLabel: 'Rite',
        paragraphs: [
          'Close your eyes.',
          'Imagine standing before the tree again.',
          'When you first arrived, the tree had not changed.',
          'When you return today, the tree still has not changed.',
          'What changed is this: you can now see branches you could not see before.',
        ],
      },
      {
        sectionLabel: 'Mirror',
        paragraphs: [
          'Then you may understand:',
          'The tree was never the answer.',
          'The tree is only a mirror that shows you to yourself.',
          'What grows is not the tree—but the one who watches it.',
        ],
      },
    ],
    closing:
      'All six facets are mirrored. The whole oracle waits in mist—not a summary, but the tree-shadow speaking after return.',
  },
  ja: {
    tag: '終巻 · 帰樹',
    title: '帰樹',
    subtitle: '樹はいつもそこにあった',
    steps: [
      {
        sectionLabel: '儀',
        paragraphs: [
          '目を閉じよ。',
          '再びその樹の前に立つことを想像せよ。',
          '初めて来たとき、樹は変わらなかった。',
          '今日戻ってきても、樹は依然として変わらない。',
          '変わったのは——以前見えなかった枝葉が、見えるようになったことだ。',
        ],
      },
      {
        sectionLabel: '鏡',
        paragraphs: [
          'そうして分かるだろう：',
          '樹は決して答えではない。',
          '樹はあなたを映す鏡に過ぎない。',
          '成長するのは樹ではなく——樹を見る者だ。',
        ],
      },
    ],
    closing:
      '六向は揃った。整象神託が霧の中で待つ——総括ではなく、帰樹のあとに樹影が語る。',
  },
}

const entryRites: Record<
  BookId,
  Record<'zh' | 'en' | 'ja', VolumeEntryRite>
> = {
  'psyche-tree': {
    zh: {
      volumeTitle: '第一卷 · 心象',
      facetLabel: '照见自我',
      steps: [
        {
          sectionLabel: '入卷仪式',
          paragraphs: [
            '阅读前，请安静坐三分钟。',
            '不要回忆今天发生了什么。',
            '不要计划接下来要做什么。',
            '只需要观察：此刻，我在哪里？',
            '不是身体在哪里。',
            '而是：我的心，此刻停留在哪里？',
          ],
        },
        {
          sectionLabel: '观照方式',
          paragraphs: [
            '阅读时，不要急着回答。',
            '如果一个问题让你沉默，请允许沉默。',
            '因为：沉默，本身就是一种回答。',
          ],
        },
        {
          sectionLabel: '冥想方式',
          paragraphs: [
            '闭上眼睛。',
            '想像自己站在一片湖边。',
            '湖面没有风。',
            '不要刻意寻找倒影。',
            '只是等待。',
            '直到湖面慢慢出现你的影子。',
            '如果影子模糊，不用调整。',
            '因为：湖不会骗人。',
            '真正需要安静的，不是湖，而是观看的人。',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume I · Mindscape',
      facetLabel: 'Mirroring the self',
      steps: [
        {
          sectionLabel: 'Entry rite',
          paragraphs: [
            'Before reading, sit quietly for three minutes.',
            'Do not replay what happened today.',
            'Do not plan what comes next.',
            'Only observe: Where am I—right now?',
            'Not where the body is.',
            'But: Where has my heart paused?',
          ],
        },
        {
          sectionLabel: 'Contemplation',
          paragraphs: [
            'While reading, do not hurry to answer.',
            'If a question brings silence, allow the silence.',
            'Silence, too, is an answer.',
          ],
        },
        {
          sectionLabel: 'Meditation',
          paragraphs: [
            'Close your eyes.',
            'Imagine standing by a lake with no wind on the water.',
            'Do not hunt for your reflection.',
            'Only wait—until your shadow slowly appears on the lake.',
            'If the shadow is blurred, do not adjust.',
            'The lake does not lie.',
            'What needs stillness is not the lake—but the one who watches.',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第一巻 · 心象',
      facetLabel: '自我を映す',
      steps: [
        {
          sectionLabel: '入巻の儀',
          paragraphs: [
            '読む前に、三分間静かに座れ。',
            '今日起きたことを振り返るな。',
            'これからすることを計画するな。',
            'ただ見よ：今、私はどこにいるか？',
            '身体の場所ではない。',
            '心が、今どこに留まっているか。',
          ],
        },
        {
          sectionLabel: '観照',
          paragraphs: [
            '読みながら、急いで答えるな。',
            '問いが沈黙を生むなら、沈黙を許せ。',
            '沈黙も、答えの一つだ。',
          ],
        },
        {
          sectionLabel: '瞑想',
          paragraphs: [
            '目を閉じ、湖のほとりに立つことを想像せよ。',
            '湖面に風はない。',
            '倒影を探すな。ただ待て——影がゆっくり浮かぶまで。',
            '影がぼやけても、整えるな。',
            '湖は嘘をつかない。',
            '静めるべきは湖ではなく——見る者だ。',
          ],
        },
      ],
    },
  },
  'emotional-flow': {
    zh: {
      volumeTitle: '第二卷 · 映心',
      facetLabel: '照见情感',
      steps: [
        {
          sectionLabel: '入卷',
          title: '不控制，只流动',
          paragraphs: [
            '这里不建议「控制情绪」。',
            '而是：让情绪拥有流动的权利。',
          ],
        },
        {
          sectionLabel: '冥想',
          paragraphs: [
            '想像自己站在一条河边。',
            '每一种情绪，都是一片叶子。',
            '不要捡起来。不要追赶。',
            '让它顺流而去。',
            '直到河面重新平静。',
            '然后问自己：还有什么，没有流走？',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume II · Heart Mirror',
      facetLabel: 'Mirroring feeling',
      steps: [
        {
          sectionLabel: 'Entry',
          title: 'Do not control—let flow',
          paragraphs: [
            'This volume does not ask you to control emotion.',
            'It asks you to let feeling have the right to move.',
          ],
        },
        {
          sectionLabel: 'Meditation',
          paragraphs: [
            'Imagine standing by a river.',
            'Each emotion is a leaf.',
            'Do not pick it up. Do not chase it.',
            'Let it drift downstream.',
            'Until the surface is calm again.',
            'Then ask: What has not yet flowed away?',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第二巻 · 映心',
      facetLabel: '感情を映す',
      steps: [
        {
          sectionLabel: '入巻',
          title: '制御せず、流れを',
          paragraphs: [
            'ここでは感情を「制御」しない。',
            '感情が流れる権利を持つことを許せ。',
          ],
        },
        {
          sectionLabel: '瞑想',
          paragraphs: [
            '川辺に立つことを想像せよ。',
            'それぞれの感情は一枚の葉。',
            '拾うな。追うな。流れに任せよ。',
            '河面が再び静まるまで。',
            'そして問え：まだ流れていないものは何か。',
          ],
        },
      ],
    },
  },
  'mind-light': {
    zh: {
      volumeTitle: '第三卷 · 明思',
      facetLabel: '照见思维',
      steps: [
        {
          sectionLabel: '观照',
          paragraphs: [
            '思考，不是不断增加答案。',
            '而是不断减少噪音。',
          ],
        },
        {
          sectionLabel: '冥想',
          paragraphs: [
            '想像夜空。',
            '每一个念头，都是一颗星。',
            '不要数。不要命名。',
            '直到：整片天空，开始出现真正的北极星。',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume III · Mind Light',
      facetLabel: 'Mirroring thought',
      steps: [
        {
          sectionLabel: 'Contemplation',
          paragraphs: [
            'Thinking is not piling on answers.',
            'It is stripping away noise.',
          ],
        },
        {
          sectionLabel: 'Meditation',
          paragraphs: [
            'Imagine the night sky.',
            'Each thought is a star.',
            'Do not count. Do not name.',
            'Until the whole sky reveals its true North Star.',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第三巻 · 明思',
      facetLabel: '思考を映す',
      steps: [
        {
          sectionLabel: '観照',
          paragraphs: ['思考とは、答えを増やすことではない。', '雑音を減らすことだ。'],
        },
        {
          sectionLabel: '瞑想',
          paragraphs: [
            '夜空を想像せよ。',
            '一つ一つの念は星。',
            '数えるな。名付けるな。',
            'やがて、本当の北極星が現れるまで。',
          ],
        },
      ],
    },
  },
  'bond-thread': {
    zh: {
      volumeTitle: '第四卷 · 缘书',
      facetLabel: '照见关系',
      steps: [
        {
          sectionLabel: '观照',
          paragraphs: [
            '不要想：别人怎么看你。',
            '而是：当别人靠近时，你的心，发生了什么？',
          ],
        },
        {
          sectionLabel: '仪式',
          paragraphs: [
            '想像自己手中有一根丝线。',
            '另一端，连接着重要的人。',
            '不要拉近。也不要剪断。',
            '只是观察：它现在是什么颜色？有没有重量？有没有温度？',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume IV · Bond Book',
      facetLabel: 'Mirroring connection',
      steps: [
        {
          sectionLabel: 'Contemplation',
          paragraphs: [
            'Do not ask how others see you.',
            'Ask: When someone draws near, what happens in your heart?',
          ],
        },
        {
          sectionLabel: 'Rite',
          paragraphs: [
            'Imagine a thread in your hand.',
            'At the other end, someone who matters.',
            'Do not pull it close. Do not cut it.',
            'Only observe: What color is it? Does it weigh? Is it warm?',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第四巻 · 縁書',
      facetLabel: '関係を映す',
      steps: [
        {
          sectionLabel: '観照',
          paragraphs: [
            '他人の見方を考えるな。',
            '他人が近づくとき、心に何が起きるか。',
          ],
        },
        {
          sectionLabel: '儀',
          paragraphs: [
            '手に糸を持つことを想像せよ。',
            '向こうには大切な人。',
            '引き寄せるな。切るな。',
            'ただ見よ：色は？重さは？温かさは？',
          ],
        },
      ],
    },
  },
  'flow-balance': {
    zh: {
      volumeTitle: '第五卷 · 流衡',
      facetLabel: '照见节奏',
      steps: [
        {
          sectionLabel: '观照',
          paragraphs: [
            '人生真正的问题，不是努力。',
            '而是：力量流向哪里。',
          ],
        },
        {
          sectionLabel: '冥想',
          paragraphs: [
            '想像自己是一条船。',
            '不是暴风雨。也不是大海。',
            '而是船。',
            '风不会停止。浪不会停止。',
            '真正需要稳定的，只有船心。',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume V · Flow Balance',
      facetLabel: 'Mirroring rhythm',
      steps: [
        {
          sectionLabel: 'Contemplation',
          paragraphs: [
            'The real question in life is not effort.',
            'It is: Where does your force flow?',
          ],
        },
        {
          sectionLabel: 'Meditation',
          paragraphs: [
            'Imagine you are a boat.',
            'Not the storm. Not the ocean.',
            'The boat.',
            'Wind will not stop. Waves will not stop.',
            'Only the heart of the boat must hold steady.',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第五巻 · 流衡',
      facetLabel: 'リズムを映す',
      steps: [
        {
          sectionLabel: '観照',
          paragraphs: ['人生の問いは努力ではない。', '力はどこへ流れるか。'],
        },
        {
          sectionLabel: '瞑想',
          paragraphs: [
            '自分が舟であることを想像せよ。',
            '嵐でも海でもなく、舟。',
            '風は止まらない。波も止まらない。',
            '安定すべきは舟の心だけ。',
          ],
        },
      ],
    },
  },
  'direction-light': {
    zh: {
      volumeTitle: '第六卷 · 向光',
      facetLabel: '照见方向',
      steps: [
        {
          sectionLabel: '观照',
          paragraphs: [
            '不要问：未来在哪里。',
            '而是：今天这一小步，是不是朝向真正重要的地方。',
          ],
        },
        {
          sectionLabel: '冥想',
          paragraphs: [
            '想像远方有一点微光。',
            '不用走过去。',
            '只需要：今天，朝它走一步。就够了。',
          ],
        },
      ],
    },
    en: {
      volumeTitle: 'Volume VI · Path Light',
      facetLabel: 'Mirroring direction',
      steps: [
        {
          sectionLabel: 'Contemplation',
          paragraphs: [
            'Do not ask where the future is.',
            'Ask: Is today’s small step toward what truly matters?',
          ],
        },
        {
          sectionLabel: 'Meditation',
          paragraphs: [
            'Imagine a faint light in the distance.',
            'You need not reach it yet.',
            'Only: today, take one step toward it. That is enough.',
          ],
        },
      ],
    },
    ja: {
      volumeTitle: '第六巻 · 向光',
      facetLabel: '方向を映す',
      steps: [
        {
          sectionLabel: '観照',
          paragraphs: [
            '未来はどこかと問うな。',
            '今日の一歩は、本当に大切な方へ向かっているか。',
          ],
        },
        {
          sectionLabel: '瞑想',
          paragraphs: [
            '遠くに微かな光を想像せよ。',
            '今すぐ辿り着く必要はない。',
            '今日、その光へ一歩。それで足りる。',
          ],
        },
      ],
    },
  },
}

const exitRites: Record<
  BookId,
  Record<'zh' | 'en' | 'ja', RiteStep[]>
> = {
  'psyche-tree': {
    zh: [
      {
        sectionLabel: '离卷仪式',
        paragraphs: [
          '完成后，不要马上查看分析。',
          '请写下一句话：',
        ],
        journalPrompt: '今天，我第一次真正看见了什么？',
      },
    ],
    en: [
      {
        sectionLabel: 'Closing rite',
        paragraphs: [
          'When you are done, do not rush to the analysis.',
          'Write one sentence:',
        ],
        journalPrompt: 'What did I truly see—for the first time—today?',
      },
    ],
    ja: [
      {
        sectionLabel: '離巻の儀',
        paragraphs: ['完了したら、すぐ分析を見るな。', '一文を書け：'],
        journalPrompt: '今日、初めて本当に見えたものは何か？',
      },
    ],
  },
  'emotional-flow': {
    zh: [
      {
        sectionLabel: '离卷',
        paragraphs: [
          '合卷前，请再静息片刻。',
          '不必命名刚才流过的一切——让湖仍留在湖上。',
        ],
      },
    ],
    en: [
      {
        sectionLabel: 'Closing',
        paragraphs: [
          'Before closing the volume, breathe once more.',
          'You need not name everything that flowed—let the lake remain a lake.',
        ],
      },
    ],
    ja: [
      {
        sectionLabel: '離巻',
        paragraphs: [
          '合冊前に、もう一度息を整えよ。',
          '流れたものすべてに名を付ける必要はない——湖は湖のままでよい。',
        ],
      },
    ],
  },
  'mind-light': {
    zh: [
      {
        sectionLabel: '离卷',
        paragraphs: ['合卷前，请让最后一个念头自行熄灭，再进入照见。'],
      },
    ],
    en: [
      {
        sectionLabel: 'Closing',
        paragraphs: ['Before closing, let the last thought fade on its own—then enter the mirror.'],
      },
    ],
    ja: [
      {
        sectionLabel: '離巻',
        paragraphs: ['合冊前に、最後の念が自ら消えるのを待ち、照見へ入れ。'],
      },
    ],
  },
  'bond-thread': {
    zh: [
      {
        sectionLabel: '离卷',
        paragraphs: ['合卷前，请再看一眼手中的丝线——不断，不拉，只是知道它还在。'],
      },
    ],
    en: [
      {
        sectionLabel: 'Closing',
        paragraphs: [
          'Before closing, glance at the thread once more—neither cut nor pulled, only known to be there.',
        ],
      },
    ],
    ja: [
      {
        sectionLabel: '離巻',
        paragraphs: ['合冊前に、手の糸をもう一度見よ——切らず、引かず、在ることを知るだけ。'],
      },
    ],
  },
  'flow-balance': {
    zh: [
      {
        sectionLabel: '离卷',
        paragraphs: ['合卷前，请感船心仍在中流——不必靠岸，只需知所。'],
      },
    ],
    en: [
      {
        sectionLabel: 'Closing',
        paragraphs: ['Before closing, feel the boat-heart still midstream—no need to dock, only to know your place.'],
      },
    ],
    ja: [
      {
        sectionLabel: '離巻',
        paragraphs: ['合冊前に、舟の心が中流にあることを感じよ——岸に着けなくてよい、在り処を知れ。'],
      },
    ],
  },
  'direction-light': {
    zh: [
      {
        sectionLabel: '离卷',
        paragraphs: ['合卷前，请确认：今天的那一步，已经迈出。'],
      },
    ],
    en: [
      {
        sectionLabel: 'Closing',
        paragraphs: ['Before closing, confirm: today’s one step has already been taken.'],
      },
    ],
    ja: [
      {
        sectionLabel: '離巻',
        paragraphs: ['合冊前に、今日の一歩はもう踏み出されたことを確かめよ。'],
      },
    ],
  },
}

function pickLocalePack<T extends Record<'zh' | 'en' | 'ja', unknown>>(
  pack: T,
  locale: Locale,
): T['zh'] {
  const key = resolveContentLocale(locale)
  const copy = pack[key] as T['zh']
  return locale === 'zhTw' ? convertStringsDeep(copy) : copy
}

export function getCoreProposition(locale: Locale): CoreProposition {
  return pickLocalePack(coreProposition, locale)
}

export function getVolumeEntryRite(bookId: BookId, locale: Locale): VolumeEntryRite {
  return pickLocalePack(entryRites[bookId], locale)
}

export function getVolumeExitRite(bookId: BookId, locale: Locale): RiteStep[] {
  return pickLocalePack(exitRites[bookId], locale)
}

export function getReturnToTreeRite(locale: Locale): ReturnTreePack {
  return pickLocalePack(returnToTree, locale)
}
