import { buildGuideContent } from './chapterTemplate'
import type { GuideChapterDef, GuideContent, GuideSpread } from './types'

const zhPreface: GuideSpread[] = [
  {
    left: [{ kind: 'part', text: '序' }],
    right: [
      {
        kind: 'lines',
        lines: ['同观', '序卷'],
      },
      {
        kind: 'hook',
        lines: ['岸尚未远，', '雾尚未深。'],
      },
    ],
  },
  {
    left: [{ kind: 'part', text: '引导' }],
    right: [
      {
        kind: 'phenomenon',
        section: 'guide',
        lines: [
          '六卷在雾下，',
          '各照一面。',
          '读之前，',
          '可先知：',
          '雾岸在照什么。',
        ],
      },
    ],
  },
]

const zhChapter1: GuideChapterDef = {
  part: '壹 · 起问',
  hook: ['未入卷前，', '不急着照见自己。'],
  phenomenon: {
    left: [
      '越来越多人',
      '走向「认识自己」。',
      '越来越多人',
      '拥有很多答案。',
    ],
    right: ['可是，', '真正停下来的人，', '却越来越少。'],
  },
  turn: [
    '于是，',
    '问题或许不是：',
    '答案够不够。',
    '而是：',
    '有没有真正看见。',
  ],
  tongguan: {
    east: {
      source: '《庄子》',
      text: '吾生也有涯，而知也无涯。',
    },
    modern: {
      source: 'William James',
      text: '意识不是一块，而是流动的河。',
    },
    footer: [
      '雾岸不以此证明自己。',
      '只与诸家同席。',
      '各自照见不同的一面。',
    ],
  },
  shoreView: [
    '因此，',
    '雾岸不问：你是什么。',
    '只问：这一息，',
    '你怎样接。',
  ],
  shoreQuestions: {
    reality: '最近一次，真正停下来，是什么时候？',
    introspection: '如果今天没有任何名字，你会怎样认识自己？',
  },
  shoreQuestionLabels: { reality: '现实', introspection: '内观' },
  breath: { label: '此息停', lines: ['此页，', '不必急着翻。'] },
  volumeMeaning: {
    label: '入卷义',
    lines: ['因为，', '识己不是积累答案，', '而是允许被照见。'],
  },
  close: ['照见未完。', '下一章。'],
}

const zhChapter2: GuideChapterDef = {
  part: '贰 · 观法',
  hook: ['名可立，', '态难住。'],
  phenomenon: {
    left: [
      '今日之我，',
      '常与昨日不同。',
      '同一张问卷，',
      '两次作答，',
    ],
    right: ['未必相同。', '可标签一旦贴上，', '人便以为已说尽。'],
  },
  turn: [
    '于是，',
    '问题或许不是：',
    '你是哪一类。',
    '而是：',
    '此刻，你如何应。',
  ],
  tongguan: {
    east: {
      source: '《道德经》',
      text: '道可道，非常道；名可名，非常名。',
    },
    modern: {
      source: '现象学',
      text: '先描述如何显现，再谈它是什么。',
    },
    footer: [
      '雾岸不以此证明自己。',
      '只与诸家同席。',
      '各自照见不同的一面。',
    ],
  },
  shoreView: [
    '故六卷者，',
    '非六型名，',
    '乃六向照——',
    '各问一面，',
    '合而为一象。',
  ],
  shoreQuestions: {
    reality: '今日若有变故，你最先变的是做法，还是对自己的说法？',
    introspection: '于汝而言，「照见」与「定义」，差在何处？',
  },
  shoreQuestionLabels: { reality: '现实', introspection: '内观' },
  breath: { label: '此息停', lines: ['可停一息。'] },
  volumeMeaning: {
    label: '入卷义',
    lines: ['因为，', '人不是固定名词，', '而是正在发生的应答。'],
  },
  close: ['照见未完。', '下一章。'],
}

const zhChapter3: GuideChapterDef = {
  part: '叁 · 岸制',
  hook: ['数可计，', '命难终。'],
  phenomenon: {
    left: [
      '人们习惯',
      '要一个总分，',
      '要一张名签，',
      '要一次说尽。',
    ],
    right: ['仿佛读完报告，', '便可毕业。', '仿佛有了分数，', '便已识己。'],
  },
  turn: [
    '于是，',
    '问题或许不是：',
    '结果够不够准。',
    '而是：',
    '生命该不该被一次统计。',
  ],
  tongguan: {
    east: {
      source: '《中庸》',
      text: '君子之道，造端必渐，及其至也，虽圣人亦有所不知。',
    },
    modern: {
      source: 'Carl Rogers',
      text: '人是一个过程，而非一件产品。',
    },
    footer: [
      '雾岸不以此证明自己。',
      '只与诸家同席。',
      '各自照见不同的一面。',
    ],
  },
  shoreView: [
    '故不设总分——',
    '数止于果，',
    '命行于流；',
    '许再入卷，',
    '整象非六报。',
  ],
  shoreQuestions: {
    reality: '若无分数与定论，你还愿在雾中花时间照见吗？',
    introspection: '你信一次说尽，还是信分面向、慢慢相照？',
  },
  shoreQuestionLabels: { reality: '现实', introspection: '内观' },
  breath: { label: '此息停', lines: ['此页，', '可停一息。'] },
  volumeMeaning: {
    label: '入卷义',
    lines: [
      '因为，',
      '生命不是一次统计；',
      '无人格可封，',
      '无毕业可办——',
      '归树在最后，',
      '神谕非命令。',
    ],
  },
  close: ['照见未完。', '下一章。'],
}

const zhChapter4: GuideChapterDef = {
  part: '肆 · 入雾',
  hook: ['同观已足，', '入雾在你。'],
  phenomenon: {
    left: ['六卷在下，', '各照一面。', '择一可入，'],
    right: ['不择，', '亦在岸。', '无卷催促，', '无岸驱逐。'],
  },
  turn: [
    '于是，',
    '问题或许不是：',
    '先读哪一卷。',
    '而是：',
    '愿否此刻迈步。',
  ],
  tongguan: {
    east: {
      source: '《金刚经》',
      text: '应无所住，而生其心。',
    },
    modern: {
      source: 'ACT',
      text: '与所感同在，仍向所重而行。',
    },
    footer: [
      '雾岸不以此证明自己。',
      '只与诸家同席。',
      '各自照见不同的一面。',
    ],
  },
  shoreView: [
    '若愿入雾，',
    '择卷即行；',
    '若仍留岸，',
    '同观亦足。',
  ],
  shoreQuestions: {
    reality: '六向并看，你此刻最想先照哪一面向？',
    introspection: '若只选一卷，是因为需要答案，还是需要一面镜子？',
  },
  shoreQuestionLabels: { reality: '现实', introspection: '内观' },
  breath: { label: '此息停', lines: ['可停一息。'] },
  volumeMeaning: {
    label: '入卷义',
    lines: ['因为，', '入卷不是被定义，', '而是择一面向，', '与己相照。'],
  },
  close: ['若愿，', '便入雾。'],
}

const zhEpilogue: GuideSpread[] = [
  {
    left: [
      {
        kind: 'lines',
        lines: ['同观已足。', '若愿入雾，', '六卷在下。'],
      },
    ],
    right: [
      {
        kind: 'lines',
        lines: ['择卷即行，', '或仍留岸。', '若愿，', '便入雾。'],
      },
    ],
  },
]

const enPreface: GuideSpread[] = [
  {
    left: [{ kind: 'part', text: 'Preface' }],
    right: [
      { kind: 'lines', lines: ['Shared View', 'Prologue'] },
      { kind: 'hook', lines: ['The shore is near;', 'the mist not yet deep.'] },
    ],
  },
  {
    left: [{ kind: 'part', text: 'Guide' }],
    right: [
      {
        kind: 'phenomenon',
        section: 'guide',
        lines: [
          'Six volumes wait below—',
          'each mirrors one facet.',
          'Before you enter,',
          'know what the mist shore mirrors.',
        ],
      },
    ],
  },
]

const enChapter1: GuideChapterDef = {
  part: 'I · The Question',
  hook: ['Before any volume,', 'no rush to mirror yourself.'],
  phenomenon: {
    left: [
      'More walk the path',
      'of knowing oneself.',
      'More carry many answers.',
    ],
    right: ['Yet fewer pause', 'long enough', 'to truly stop.'],
  },
  turn: [
    'Perhaps the question',
    'is not whether answers',
    'are enough—',
    'but whether anything',
    'has truly been seen.',
  ],
  tongguan: {
    east: { source: 'Zhuangzi', text: 'Life has bounds; knowing has none.' },
    modern: {
      source: 'William James',
      text: 'Consciousness is not a thing—it is a flowing stream.',
    },
    footer: [
      'The mist shore does not prove itself by these.',
      'It only sits at the same table.',
      'Each tradition mirrors a different facet.',
    ],
  },
  shoreView: [
    'So the shore does not ask',
    'what you are—',
    'only how,',
    'in this breath, you respond.',
  ],
  shoreQuestions: {
    reality: 'When did you last truly stop?',
    introspection: 'If you had no name today, how would you know yourself?',
  },
  shoreQuestionLabels: { reality: 'In life', introspection: 'Within' },
  breath: { label: 'Pause', lines: ['This page need not', 'be turned yet.'] },
  volumeMeaning: {
    label: 'Why this volume',
    lines: ['Because knowing yourself', 'is not hoarding answers—', 'but allowing mirror-light.'],
  },
  close: ['Mirroring continues.', 'Next chapter.'],
}

const enChapter2: GuideChapterDef = {
  part: 'II · How the shore sees',
  hook: ['Names may stick;', 'states do not stay.'],
  phenomenon: {
    left: [
      'Today’s self',
      'differs from yesterday’s.',
      'The same questions,',
      'twice answered,',
    ],
    right: ['may not match—', 'yet a label', 'feels like enough.'],
  },
  turn: [
    'Perhaps the question',
    'is not which type you are—',
    'but how you respond,',
    'right now.',
  ],
  tongguan: {
    east: {
      source: 'Daodejing',
      text: 'The way that can be told is not the constant way.',
    },
    modern: {
      source: 'Phenomenology',
      text: 'Describe how it appears before naming what it is.',
    },
    footer: [
      'The mist shore does not prove itself by these.',
      'It only sits at the same table.',
      'Each tradition mirrors a different facet.',
    ],
  },
  shoreView: [
    'Six volumes are not six type-names—',
    'but six directions of mirroring;',
    'each asks one facet,',
    'together one image.',
  ],
  shoreQuestions: {
    reality: 'When life shifts today, what changes first—your actions or your self-story?',
    introspection: 'For you, where does mirroring end and defining begin?',
  },
  shoreQuestionLabels: { reality: 'In life', introspection: 'Within' },
  breath: { label: 'Pause', lines: ['Rest one breath.'] },
  volumeMeaning: {
    label: 'Why this volume',
    lines: ['Because a person is not a fixed noun—', 'but a response still happening.'],
  },
  close: ['Mirroring continues.', 'Next chapter.'],
}

const enChapter3: GuideChapterDef = {
  part: 'III · Shore design',
  hook: ['Numbers can be counted;', 'a life cannot be closed.'],
  phenomenon: {
    left: [
      'We want one total score,',
      'one label,',
      'one sentence that finishes it.',
    ],
    right: [
      'As if a report graduates us—',
      'as if a number',
      'already knew us.',
    ],
  },
  turn: [
    'Perhaps the question',
    'is not accuracy of result—',
    'but whether life',
    'should be counted once.',
  ],
  tongguan: {
    east: {
      source: 'Doctrine of the Mean',
      text: 'The way begins in small steps; at its height, even sages do not know all.',
    },
    modern: {
      source: 'Carl Rogers',
      text: 'A person is a process, not a product.',
    },
    footer: [
      'The mist shore does not prove itself by these.',
      'It only sits at the same table.',
      'Each tradition mirrors a different facet.',
    ],
  },
  shoreView: [
    'No total score—',
    'numbers end at outcome, life moves in flow;',
    'return is allowed;',
    'the whole is not six reports.',
  ],
  shoreQuestions: {
    reality: 'Without score or verdict, would you still mirror in the mist?',
    introspection: 'Do you trust one sentence—or many facets, slowly seen?',
  },
  shoreQuestionLabels: { reality: 'In life', introspection: 'Within' },
  breath: { label: 'Pause', lines: ['This page may wait.'] },
  volumeMeaning: {
    label: 'Why this volume',
    lines: [
      'Because life is not one statistic;',
      'no personality to seal,',
      'no graduation—',
      'the tree comes last;',
      'oracle is not command.',
    ],
  },
  close: ['Mirroring continues.', 'Next chapter.'],
}

const enChapter4: GuideChapterDef = {
  part: 'IV · Enter the mist',
  hook: ['Shared view is enough;', 'entering is yours to choose.'],
  phenomenon: {
    left: ['Six volumes below—', 'each one facet.', 'Choose one to enter;'],
    right: ['choose none—', 'still on shore.', 'No volume hurries;', 'no shore expels.'],
  },
  turn: [
    'Perhaps the question',
    'is not which volume first—',
    'but whether you step',
    'now.',
  ],
  tongguan: {
    east: {
      source: 'Diamond Sutra',
      text: 'Abide nowhere; let the heart arise.',
    },
    modern: {
      source: 'ACT',
      text: 'Stay with what is felt; still move toward what matters.',
    },
    footer: [
      'The mist shore does not prove itself by these.',
      'It only sits at the same table.',
      'Each tradition mirrors a different facet.',
    ],
  },
  shoreView: [
    'If you would enter, choose a volume;',
    'if you remain, shared view is enough.',
  ],
  shoreQuestions: {
    reality: 'Of six facets, which calls to be mirrored first?',
    introspection: 'If you choose one volume—is it for an answer, or for a mirror?',
  },
  shoreQuestionLabels: { reality: 'In life', introspection: 'Within' },
  breath: { label: 'Pause', lines: ['Rest one breath.'] },
  volumeMeaning: {
    label: 'Why this volume',
    lines: ['Because entering is not being defined—', 'but choosing one facet to mirror with.'],
  },
  close: ['If you wish,', 'enter the mist.'],
}

const enEpilogue: GuideSpread[] = [
  {
    left: [
      {
        kind: 'lines',
        lines: ['Shared view is enough.', 'If you would enter,', 'six volumes wait below.'],
      },
    ],
    right: [
      {
        kind: 'lines',
        lines: ['Choose a volume—or remain.', 'If you wish,', 'enter the mist.'],
      },
    ],
  },
]

const jaPreface: GuideSpread[] = [
  {
    left: [{ kind: 'part', text: '序' }],
    right: [
      { kind: 'lines', lines: ['同観', '序巻'] },
      { kind: 'hook', lines: ['岸は未だ遠からず、', '霧は未だ深からず。'] },
    ],
  },
  {
    left: [{ kind: 'part', text: '導き' }],
    right: [
      {
        kind: 'phenomenon',
        section: 'guide',
        lines: [
          '六巻は霧の下に、',
          '各一面を映す。',
          '入る前に、',
          '霧岸が何を映すか知れ。',
        ],
      },
    ],
  },
]

const jaChapter1: GuideChapterDef = {
  part: '壹 · 起問',
  hook: ['巻に入る前、', '急いで己を照すな。'],
  phenomenon: {
    left: [
      'ますます多くの人が',
      '「自分を知る」へ向かう。',
      'ますます多くの答えを',
      '手にする。',
    ],
    right: ['だが、', '本当に立ち止まる人は、', 'ますます少ない。'],
  },
  turn: [
    'ゆえに問いは、',
    '答えが足りるかではなく、',
    '本当に見えたか、',
    'にあるのかもしれない。',
  ],
  tongguan: {
    east: { source: '『荘子』', text: '吾生也有涯、而知も無涯。' },
    modern: {
      source: 'William James',
      text: '意識は塊ではなく、流れる河である。',
    },
    footer: [
      '霧岸はこれで自らを証せず。',
      '諸家と同じ席にのみ坐す。',
      'それぞれ異なる一面を映す。',
    ],
  },
  shoreView: [
    'ゆえに霧岸は問わず、',
    '汝は何かを。',
    'ただ問う、この一息、',
    '如何に応ずるか。',
  ],
  shoreQuestions: {
    reality: '最近、本当に立ち止まったのはいつか。',
    introspection: '今日すべての名がなかったら、どう己を知るか。',
  },
  shoreQuestionLabels: { reality: '現実', introspection: '内観' },
  breath: { label: '此息停', lines: ['此の頁、', '急いでめくるな。'] },
  volumeMeaning: {
    label: '入巻義',
    lines: ['なぜなら、', '識己は答を積むことに非ず、', '照されることを許すこと。'],
  },
  close: ['照見未だ尽せず。', '次章へ。'],
}

const jaChapter2: GuideChapterDef = {
  part: '贰 · 観法',
  hook: ['名は立てられ、', '態は住まず。'],
  phenomenon: {
    left: [
      '今日の我は',
      '昨日と異なる。',
      '同じ問いに',
      '二度答えても、',
    ],
    right: ['必ずしも同じでない。', 'だが名を貼れば、', 'もう言い尽くしたと思う。'],
  },
  turn: [
    'ゆえに問いは、',
    '汝はどの型かではなく、',
    '今、如何に応ずるか、',
    'にあるのかもしれない。',
  ],
  tongguan: {
    east: { source: '『道德経』', text: '道可道、非常道。名可名、非常名。' },
    modern: {
      source: '現象学',
      text: '何であるかの前に、如何に現れるかを記述せよ。',
    },
    footer: [
      '霧岸はこれで自らを証せず。',
      '諸家と同じ席にのみ坐す。',
      'それぞれ異なる一面を映す。',
    ],
  },
  shoreView: [
    '故に六巻は、',
    '六つの型名に非ず、',
    '六向の照見なり——',
    '各一面を問い、',
    '合して一象を成す。',
  ],
  shoreQuestions: {
    reality: '今日変があれば、先に変わるのは作法か、己への説明か。',
    introspection: '「照見」と「定義」の境は、汝に何か。',
  },
  shoreQuestionLabels: { reality: '現実', introspection: '内観' },
  breath: { label: '此息停', lines: ['一息停まれ。'] },
  volumeMeaning: {
    label: '入巻義',
    lines: ['なぜなら、', '人は固定の名詞に非ず、', '今起こる応答なり。'],
  },
  close: ['照見未だ尽せず。', '次章へ。'],
}

const jaChapter3: GuideChapterDef = {
  part: '叁 · 岸制',
  hook: ['数は計られ、', '命は終えられず。'],
  phenomenon: {
    left: [
      '人は総点を欲し、',
      '名签を欲し、',
      '一度で言い尽くしたがる。',
    ],
    right: ['報告を読めば卒業したかのように。', '点数があれば、', 'もう識れたかのように。'],
  },
  turn: [
    'ゆえに問いは、',
    '結果の正確さではなく、',
    '命が一度の統計であるべきか、',
    'にあるのかもしれない。',
  ],
  tongguan: {
    east: {
      source: '『中庸』',
      text: '君子の道、造端必ず漸、及其び至也、雖聖人も亦有所不知。',
    },
    modern: {
      source: 'Carl Rogers',
      text: '人は過程であり、製品に非ず。',
    },
    footer: [
      '霧岸はこれで自らを証せず。',
      '諸家と同じ席にのみ坐す。',
      'それぞれ異なる一面を映す。',
    ],
  },
  shoreView: [
    '故に総点なし——',
    '数は果に止まり、命は流れの中に；',
    '再入を許し、',
    '整象は六報に非ず。',
  ],
  shoreQuestions: {
    reality: '点数も定論もなければ、まだ霧の中で照したいか。',
    introspection: '一度で言い切るか、面向ごとゆっくり見るか、どちらを信ずるか。',
  },
  shoreQuestionLabels: { reality: '現実', introspection: '内観' },
  breath: { label: '此息停', lines: ['此の頁、', '一息停まれ。'] },
  volumeMeaning: {
    label: '入巻義',
    lines: [
      'なぜなら、',
      '命は一度の統計に非ず；',
      '人格を封ず、',
      '卒業なし——',
      '帰樹は最後に、',
      '神託は命令に非ず。',
    ],
  },
  close: ['照見未だ尽せず。', '次章へ。'],
}

const jaChapter4: GuideChapterDef = {
  part: '肆 · 入霧',
  hook: ['同観足る、', '入霧は汝に在る。'],
  phenomenon: {
    left: ['六巻は下に、', '各一面を映す。', '一巻を選べば入る；'],
    right: ['選ばなくとも、', '岸に在る。', '巻は急かず、', '岸は逐わず。'],
  },
  turn: [
    'ゆえに問いは、',
    'どの巻を先にかではなく、',
    '今、步を踏むか、',
    'にあるのかもしれない。',
  ],
  tongguan: {
    east: { source: '『金剛経』', text: '応無所住して而生其心。' },
    modern: {
      source: 'ACT',
      text: '感じるものと共に在り、大切な方へ仍り行く。',
    },
    footer: [
      '霧岸はこれで自らを証せず。',
      '諸家と同じ席にのみ坐す。',
      'それぞれ異なる一面を映す。',
    ],
  },
  shoreView: [
    '霧に入るなら、巻を選べ；',
    '岸に留まるなら、同観も足る。',
  ],
  shoreQuestions: {
    reality: '六向を並べ、今いちばん先に照したい面はどれか。',
    introspection: '一巻だけ選ぶなら、答えのためか、鏡のためか。',
  },
  shoreQuestionLabels: { reality: '現実', introspection: '内観' },
  breath: { label: '此息停', lines: ['一息停まれ。'] },
  volumeMeaning: {
    label: '入巻義',
    lines: ['なぜなら、', '入巻は定義されることに非ず、', '一面を選び、己と相照すること。'],
  },
  close: ['若くば、', '霧に入れ。'],
}

const jaEpilogue: GuideSpread[] = [
  {
    left: [
      {
        kind: 'lines',
        lines: ['同観足る。', '霧に入るなら、', '六巻は下に。'],
      },
    ],
    right: [
      {
        kind: 'lines',
        lines: ['巻を選べば入る。', '岸に留まってもよい。', '若くば、', '霧に入れ。'],
      },
    ],
  },
]

const contentByLocale = {
  zh: buildGuideContent(zhPreface, [zhChapter1, zhChapter2, zhChapter3, zhChapter4], zhEpilogue),
  en: buildGuideContent(enPreface, [enChapter1, enChapter2, enChapter3, enChapter4], enEpilogue),
  ja: buildGuideContent(jaPreface, [jaChapter1, jaChapter2, jaChapter3, jaChapter4], jaEpilogue),
} as const

export function getGuideContent(contentLocale: 'zh' | 'en' | 'ja'): GuideContent {
  return contentByLocale[contentLocale]
}
