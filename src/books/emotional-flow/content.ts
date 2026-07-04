import type { LocalizedBookPack } from '../shared/createBook'
import { card } from '../shared/card'
import type { LevelDescriptions } from '../shared/profileHelpers'

const psychDescriptions: LevelDescriptions = {
  1: {
    high: '整体情感能量平稳清澈，如静湖映星，流动缓慢而透明。',
    'mid-high': '情感有温和涌动的活力，总体可控，像泉水缓缓上升。',
    mid: '情感时起时落，如风吹涟漪，仍在寻找自己的节奏。',
    'mid-low': '情感波动偏频繁，恢复平静需要更多时间与空间。',
    low: '情感如激流奔涌，内在较难迅速归于安稳。',
  },
  2: {
    high: '您能以温和清晰的方式表达情感，内在与外在较为一致。',
    'mid-high': '表达含蓄而真诚，情感在合适时机会自然流露。',
    mid: '表达方式随情境变化，有时清晰，有时退入内在。',
    'mid-low': '情感表达较为困难，常停留在未说出的层面。',
    low: '情感多藏于雾中，表达路径尚不清晰。',
  },
  3: {
    high: '对他人的情感靠近持开放态度，联结中既有温度也有边界。',
    'mid-high': '在确认安全感后，愿意逐步加深情感交汇。',
    mid: '在靠近与守护之间摆动，联结方式因人因地而异。',
    'mid-low': '倾向保持心理距离，联结需要较长时间建立。',
    low: '情感上较为疏离，更习惯守护内在空间。',
  },
  4: {
    high: '身体与情感协调，能感知并善待身体的情感信号。',
    'mid-high': '对身体感受有一定觉察，并能与之温和对话。',
    mid: '身体感随情绪波动，稳定性时强时弱。',
    'mid-low': '情感常体现为身体的紧张或飘浮感，较难落地。',
    low: '身心之间的连结较弱，情感波动容易牵动整体状态。',
  },
  5: {
    high: '情感起伏后较快回归平静，恢复力较强。',
    'mid-high': '会先稳住核心，再让情感缓慢回落。',
    mid: '恢复速度因事件而异，有时快有时慢。',
    'mid-low': '起伏后需要较长时间才能感到重新站稳。',
    low: '情感波动后较难找到回到平静的路径。',
  },
  6: {
    high: '能将变化中的情感浪潮转化为成长与理解。',
    'mid-high': '在变化中保持适应，情感逐步找到新平衡。',
    mid: '对变化中的情感反应不一，仍在学习应对方式。',
    'mid-low': '变化易引发情感收紧或飘移，稳定感不足。',
    low: '面对变化时情感容易失控或冻结，适应路径尚模糊。',
  },
  7: {
    high: '诸情交汇时，心湖整象偏澄——流、言、身大致同向。',
    'mid-high': '整湖渐明，情感诸脉大体和谐。',
    mid: '整湖仍在成形，诸情时有交错。',
    'mid-low': '整湖偏浊，诸情尚未归处。',
    low: '整湖如雾，情感诸面仍待更清晰的映见。',
  },
}

const mysticalSymbols: LevelDescriptions = {
  1: {
    high: '情感如静湖，映出整片星光，流动缓慢而透明。',
    'mid-high': '泉水自根处涌出，银线沿河道上升，活力温和。',
    mid: '风过湖面，涟漪轻起，情感之流寻找形状。',
    'mid-low': '河面风急，树影摇曳，平静在深处等待。',
    low: '激流穿石，情感能量奔涌——河终将入海。',
  },
  2: {
    high: '柔光自枝梢滴落，表达如丝如星，真诚而清晰。',
    'mid-high': '共振之光在叶与叶之间传递，话语不多却彼此照亮。',
    mid: '叶随风转，表达时近时远，内在仍在选声。',
    'mid-low': '雾中行步，未说之语如薄雾缠绕枝梢。',
    low: '情感藏于深雾，等待一盏灯、一次向内的倾听。',
  },
  3: {
    high: '温暖之手与柔丝之桥同时显现，联结在河脉间轻轻脉动。',
    'mid-high': '丝线缓缓延伸，跨越距离，在确认中织就信任。',
    mid: '星河相望，靠近与距离如双轨并行，各有其义。',
    'mid-low': '盾牌护心，联结之门半掩，等待合适温度。',
    low: '远星相望，守护本身亦是情感智慧的面容。',
  },
  4: {
    high: '稳流之河与身体同频，身心如岸与波，彼此呼应。',
    'mid-high': '感知之河绕身而行，身体的声音被温柔听见。',
    mid: '云影掠过，身体与情感在天光下交替显影。',
    'mid-low': '风叶无根，身心尚需更多时间同拍。',
    low: '激流牵动全身，请先向岸索取一次深呼吸。',
  },
  5: {
    high: '静湖重归镜面，波动如暮光中的叶，轻轻归位。',
    'mid-high': '山峰不动，潮涌自退，恢复如年轮缓慢闭合。',
    mid: '潮汐有涨有落，恢复力正在季节中成熟。',
    'mid-low': '小舟迟归，请允许自己多泊一会儿岸。',
    low: '雾径漫长，但每向前一步，都在河上留下光痕。',
  },
  6: {
    high: '种子破土，变化成为情感河上新芽的养分。',
    'mid-high': '枝展向光，适应如慢镜头中的生长。',
    mid: '云行风随，变化既带来释放也带来不确定。',
    'mid-low': '山守不动，情感暂收，等待更清晰的季节。',
    low: '暗潮未平，变化正在召唤更深层的自我对话。',
  },
  7: {
    high: '诸情归湖，整湖如镜，映出一幅完整的情感风景。',
    'mid-high': '湖心渐明，诸脉同向，仍有余波待平。',
    mid: '整湖未定格，诸情仍在对话。',
    'mid-low': '湖浊风急，整象尚散。',
    low: '整湖如雾，请信河会引你归岸。',
  },
}

export const emotionalFlowPack: LocalizedBookPack = {
  meta: {
    id: 'emotional-flow',
    shelfTitle: '映心',
    coverTitle: '映心',
    coverSubtitle: '六脉情感',
    coverTagline: '照见情流之湖',
    coverHint: '六脉照见情感流动，末有整湖之印；只是记录此刻，不含评判。',
    spineLabel: '映心',
    accent: 'silver',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '情感',
    integrationLabel: '流·整湖',
  },
  content: {
    dimensions: [
      {
        id: 'flow-overall',
        dimensionIndex: 1,
        title: '流势',
        prompt: '当你感受最近的情感状态时，最像哪一种内在流动？',
        cards: [
          card('ef-calm-lake', '平静之湖', '情感如静湖，内心较为安稳且清澈。', 2, 'still-lake'),
          card('ef-gushing-spring', '涌动之泉', '情感有自然涌动的活力，但较为温和可控。', 1, 'gushing-spring'),
          card('ef-wind-ripple', '风中涟漪', '情感偶尔起伏，像风吹过的水面。', -1, 'wind-ripple'),
          card('ef-torrent-river', '激流之河', '情感如激流，波动较大，较难平静。', -2, 'torrent-river'),
        ],
      },
      {
        id: 'flow-expression',
        dimensionIndex: 2,
        title: '流言',
        prompt: '当你需要表达内心情感时，最常出现的倾向是？',
        cards: [
          card('ef-soft-candle', '柔光之烛', '情感以温和、清晰的方式自然流露。', 2, 'soft-candle'),
          card('ef-resonance', '共振之光', '表达含蓄却真诚，像光与光之间的呼应。', 1, 'resonance-light'),
          card('ef-wind-leaf', '风中之叶', '表达随情境摇摆，时显时隐。', -1, 'wind-leaf-emotion'),
          card('ef-fog-walk', '雾中之行', '情感难以言说，更多留在内在迷雾里。', -2, 'fog-walk'),
        ],
      },
      {
        id: 'flow-connection',
        dimensionIndex: 3,
        title: '流联',
        prompt: '当他人的情感靠近你时，你的内在反应更像？',
        cards: [
          card('ef-warm-hands', '温暖之手', '愿意以开放与回应接纳情感的靠近。', 2, 'warm-hands'),
          card('ef-silk-bridge', '柔丝之桥', '在确认安全后，逐步加深情感交汇。', 1, 'silk-bridge'),
          card('ef-shield', '守护之盾', '保持一定距离，联结需要更多时间。', -1, 'shield'),
          card('ef-stars-gaze', '星河相望', '情感上保持距离，更习惯远观而非靠近。', -2, 'stars-gaze'),
        ],
      },
      {
        id: 'flow-body',
        dimensionIndex: 4,
        title: '流身',
        prompt: '最近你的情感状态，在身体上最常体现为？',
        cards: [
          card('ef-steady-river', '稳流之河', '身体与情感协调，内在流动感平稳。', 2, 'steady-river'),
          card('ef-sensing', '感知之河', '能觉察身体信号，并与之温和对话。', 1, 'sensing-river'),
          card('ef-wind-cloud', '风中之云', '身体感时轻时重，随情绪云影飘动。', -1, 'wind-cloud'),
          card('ef-flexible-wind', '灵活之风', '身体常随情感波动，较难找到稳定落点。', -2, 'flexible-wind'),
        ],
      },
      {
        id: 'flow-recovery',
        dimensionIndex: 5,
        title: '流息',
        prompt: '当情感起伏出现时，你通常？',
        cards: [
          card('ef-still-mirror', '静湖之镜', '能较快回到内在平静，如湖面重归明镜。', 2, 'still-lake'),
          card('ef-mountain', '稳固之山', '先稳住核心，再让情感缓慢回落。', 1, 'stable-mountain'),
          card('ef-drift', '随缘之舟', '起伏后需要较长时间才能靠岸。', -1, 'drift-boat'),
          card('ef-fog-path', '雾中之径', '恢复路径不清，常在迷雾中徘徊。', -2, 'fog-path'),
        ],
      },
      {
        id: 'flow-change',
        dimensionIndex: 6,
        title: '流变',
        prompt: '面对关系或环境变化带来的情感浪潮，你？',
        cards: [
          card('ef-seed', '种子觉醒', '将变化视为情感成长与转化的契机。', 2, 'seed-awakening'),
          card('ef-bloom', '绽放之树', '在适应中保持希望，情感逐步舒展。', 1, 'bloom-tree'),
          card('ef-balance-boat', '平衡之舟', '在波动中努力维持平衡，但仍感吃力。', -1, 'balance-boat'),
          card('ef-cautious', '谨慎之山', '倾向收紧情感，以守护内在稳定。', -2, 'cautious-mountain'),
        ],
      },
    ],
    integration: {
      id: 'flow-whole',
      dimensionIndex: 7,
      title: '流·整湖',
      prompt: '诸情曾潮曾静——若此刻只映一湖，最接近哪一象？',
      cards: [
        card('ef-whole-lake', '静湖之镜', '诸情归湖，整湖澄明。', 2, 'still-lake'),
        card('ef-whole-spring', '涌动之泉', '湖下有泉，整湖活而稳。', 1, 'gushing-spring'),
        card('ef-whole-ripple', '风中涟漪', '整湖有纹，仍在寻形。', -1, 'wind-ripple'),
        card('ef-whole-torrent', '激流之河', '整湖多湍，诸情未平。', -2, 'torrent-river'),
      ],
    },
    attentionCardId: 'ef-warm-hands',
    attentionCardLabel: '温暖之手',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '在生命之河的静默中，您的情感之流如银色河脉缓缓显影。',
      '河流、星光与丝线交织成一幅内在地图——以下是情感能量的流动图景。',
    ],
    closings: [
      '愿您以温柔注视自己的情感之流——它不急于抵达，却始终在流动。',
      '河流不会催促自己的方向。您的节奏，自有神圣的时间。',
    ],
    mysticalPromptTemplate: `你是一位擅长意象与象征的玄学解读者。
请根据以下情感画像，用温柔诗意的语言作整合性玄学描述。
使用河流、湖、潮、镜、泉等象征；只谈情感流动，不涉及思维或方向专卷。
避免预言；不要直接说"你的选择是XX"。
心理学情感画像：
[PSYCHOLOGY]
请生成一段连贯的情感整合描述。`,
  },
  resultChapterLabels: ['终章 · 情感画像', '终章 · 映心神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of emotional flow.
Based on the emotional portrait below, write an integrated poetic interpretation in English.
Use river, lake, tide, mirror, and spring. Focus on feeling only.
Avoid prophecy. Do not say "your choice was X".
Emotional portrait:
[PSYCHOLOGY]
Write one coherent integrated description in English.`,
}
