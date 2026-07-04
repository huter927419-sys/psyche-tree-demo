import type { LocalizedBookPack } from '../shared/createBook'
import { card } from '../shared/card'
import type { LevelDescriptions } from '../shared/profileHelpers'

const level = (
  high: string,
  midHigh: string,
  mid: string,
  midLow: string,
  low: string,
) => ({ high, 'mid-high': midHigh, mid, 'mid-low': midLow, low })

const psychDescriptions: LevelDescriptions = {
  1: level(
    '对人生方向有较清晰的内在感知，如根树或星引。',
    '方向感大体存在，仍在微调。',
    '光向时明时渺。',
    '方向感偏淡，多在雾中寻径。',
    '光向未聚，如舟暂泊。',
  ),
  2: level(
    '较能感所重所轻，意义感有锚。',
    '意义大体可辨，偶被境掩。',
    '意义时显时隐。',
    '意义感偏薄，仍在寻名。',
    '意义如雾，锚尚未落。',
  ),
  3: level(
    '行动与步伐较一致，步履有根。',
    '步履多数时候跟得上心向。',
    '步与心时合时分。',
    '步常迟于心，或心迟于步。',
    '步履与心向距离偏明显。',
  ),
  4: level(
    '较信步伐能靠近重要之物，行动有共振。',
    '共振多数时候可感。',
    '共振时强时弱。',
    '力感偏弱，共振需援。',
    '行动与向往之间仍有明显距离。',
  ),
  5: level(
    '持愿较稳，不因短雾轻易弃光。',
    '持愿大体在，偶有动摇。',
    '持愿随季而变。',
    '愿易为境改，锚不常定。',
    '持愿如风中烛，仍在寻罩。',
  ),
  6: level(
    '探径时较能试而不莽，光在试探中显。',
    '探径有偏仍向前。',
    '探径时进时停。',
    '怕错而久停，或莽而常撞。',
    '探径多在雾中，光未常亮。',
  ),
  7: level(
    '诸向交汇，整光偏明——向、步、愿大致同向。',
    '整光渐聚，诸径大体和谐。',
    '整光仍在成形，诸力时有交错。',
    '整光偏散，方向未归。',
    '整光如雾，向步仍待更清晰的照见。',
  ),
}

const mysticalSymbols: LevelDescriptions = {
  1: level(
    '根深向光，星引在前，方向如中轴亮。',
    '光向渐明，径在脚下展。',
    '雾掩光向，步仍在寻。',
    '光渺如星，径未常定。',
    '舟随波，向在远处等。',
  ),
  2: level(
    '意义如锚落湖，所重所轻有纹。',
    '锚大体在，偶被浪掩。',
    '意义时显时隐，如月相。',
    '锚轻，名未常落。',
    '意义在雾后，待灯。',
  ),
  3: level(
    '步履跟光，步有根，径有向。',
    '步与心大体同拍。',
    '步心时合时分，如双轨。',
    '步迟心或心迟步，距在缩短。',
    '步与光距仍明显，请耐心。',
  ),
  4: level(
    '共振之光沿径跳动，行动与价值同频。',
    '共振多数时候可闻。',
    '共振时强时弱，如弦。',
    '力弱则共振需援。',
    '光与步之间，仍有距离待弥合。',
  ),
  5: level(
    '持愿如烛罩风，光不轻灭。',
    '愿在，偶有动摇仍续。',
    '持愿随季，不必苛责。',
    '愿随风，锚待再落。',
    '烛风急，愿在护中续。',
  ),
  6: level(
    '探径以小步试光，不莽不滞。',
    '探径有偏仍向前，如星路。',
    '探径时进时停，如潮。',
    '停久或撞多，径在重修。',
    '雾径长，光未常亮。',
  ),
  7: level(
    '诸向归一光，整图如行者于雾中辨认下一步。',
    '整光渐聚，余径仍有余波。',
    '多向交错，整图未定格。',
    '光散如风，整向待聚。',
    '整光未至，请信径会自显。',
  ),
}

export const directionLightPack: LocalizedBookPack = {
  meta: {
    id: 'direction-light',
    shelfTitle: '向光',
    coverTitle: '向光',
    coverSubtitle: '六向步履',
    coverTagline: '照见光向之径',
    coverHint: '六向照见方向与步履，末有整光之印；不含评判，只在雾中留痕。',
    spineLabel: '向光',
    accent: 'silver',
    dimensionCount: 6,
    treeProgressMax: 6,
    hasAttentionChecks: true,
    domainLabel: '方向',
    integrationLabel: '向·整光',
  },
  content: {
    dimensions: [
      {
        id: 'dir-light',
        dimensionIndex: 1,
        title: '光向',
        prompt: '当你停下来感方向，内在那束光更常如何？',
        cards: [
          card('dl-deep-root', '根深之树', '有根有向，如树向光。', 2, 'deep-root-tree'),
          card('dl-star-guide', '星河指引', '星引在前，步随微光。', 2, 'star-guide'),
          card('dl-fog-path', '雾中之径', '光时隐时现，径在寻中。', -1, 'fog-path'),
          card('dl-drift', '随缘之舟', '光向未聚，如舟暂泊。', -2, 'drift-boat'),
        ],
      },
      {
        id: 'dir-meaning',
        dimensionIndex: 2,
        title: '光义',
        prompt: '所重所轻之间，你的光义更常如何？',
        cards: [
          card('dl-resonance', '共振之光', '所重清晰，行动有共鸣。', 2, 'resonance-light'),
          card('dl-seeking', '寻找之灯', '持灯辨义，名渐显。', 1, 'seeking-lamp'),
          card('dl-fog-walk', '雾中之行', '义在雾中，仍在向里行。', -1, 'fog-walk'),
          card('dl-wind-leaf', '风中之叶', '义随风，锚不常定。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'dir-step',
        dimensionIndex: 3,
        title: '步履',
        prompt: '心向与步伐之间，你更常如何行？',
        cards: [
          card('dl-steady-path', '稳行之径', '步跟光，径有根。', 2, 'steady-path'),
          card('dl-star', '星光探索者', '小步试探，步不离光。', 2, 'star-explorer'),
          card('dl-seeking2', '寻找之灯', '步慢心快，仍在对齐。', 1, 'seeking-lamp'),
          card('dl-fog-walk2', '雾中之行', '步与心距仍明显。', -2, 'fog-walk'),
        ],
      },
      {
        id: 'dir-resonance',
        dimensionIndex: 4,
        title: '共振',
        prompt: '当你回顾行动与向往，更常感哪种共振？',
        cards: [
          card('dl-resonance2', '共振之光', '行动与价值大体同频。', 2, 'resonance-light'),
          card('dl-steady-path2', '稳行之径', '信步伐能靠近重要之物。', 2, 'steady-path'),
          card('dl-seeking3', '寻找之灯', '力感偏弱，仍在寻援。', -1, 'seeking-lamp'),
          card('dl-fog-walk3', '雾中之行', '行动与向往之间仍有距离。', -2, 'fog-walk'),
        ],
      },
      {
        id: 'dir-vow',
        dimensionIndex: 5,
        title: '持愿',
        prompt: '短雾临头，你更常如何持愿？',
        cards: [
          card('dl-mountain', '稳固之山', '愿如界石，不轻动摇。', 2, 'stable-mountain'),
          card('dl-guardian', '守护之树', '护愿于干，季变不弃。', 1, 'guardian-tree'),
          card('dl-wind-cloud', '风中之云', '愿随风，仍在找回。', -1, 'wind-cloud'),
          card('dl-wind-leaf2', '风中之叶', '愿易灭，烛需再点。', -2, 'wind-leaf'),
        ],
      },
      {
        id: 'dir-probe',
        dimensionIndex: 6,
        title: '探径',
        prompt: '径未明时，你更常如何探光？',
        cards: [
          card('dl-star2', '星光探索者', '小步试光，不莽不滞。', 2, 'star-explorer'),
          card('dl-seeking4', '寻找之灯', '持灯探径，光渐显。', 2, 'seeking-lamp'),
          card('dl-cautious', '谨慎之山', '久观后动，探而不莽。', 1, 'cautious-mountain'),
          card('dl-fog-path2', '雾中之径', '探径多在雾中，光未常亮。', -2, 'fog-path'),
        ],
      },
    ],
    integration: {
      id: 'dir-whole',
      dimensionIndex: 7,
      title: '向·整光',
      prompt: '诸向交汇——若此刻只映一光，整光更接近？',
      cards: [
        card('dl-whole-star', '星河指引', '诸向归光，整图偏明。', 2, 'star-guide'),
        card('dl-whole-path', '稳行之径', '整光有向有步，大体合宜。', 1, 'steady-path'),
        card('dl-whole-fog', '雾中之径', '整光仍散，诸向交错。', -1, 'fog-path'),
        card('dl-whole-drift', '随缘之舟', '整光未聚，径待再认。', -2, 'drift-boat'),
      ],
    },
    attentionCardId: 'dl-star',
    attentionCardLabel: '星光探索者',
    psychDescriptions,
    mysticalSymbols,
    openings: [
      '光向在雾中显形——以下是方向与步履所映的一页。',
      '径与星之间，六印依次落下，照见此刻整光之形。',
    ],
    closings: [
      '愿你在雾中温柔照见向光——步不急于至，光自有其显。',
      '星不责备迟行，径不惩罚试探。你的整光，自有其时。',
    ],
    mysticalPromptTemplate: `你是一位照见方向象征的玄学解读者。
请根据以下方向画像，用庄严诗意的语言作玄学解读。
使用光、径、步、星、愿等象征；只谈方向与行动共振，不涉及情感或平衡专卷。
不要直接说"你的选择是XX"。
心理学方向画像：
[PSYCHOLOGY]
请生成一段连贯的玄学解读。`,
  },
  resultChapterLabels: ['终章 · 向光画像', '终章 · 向光神谕', '封底 · 合卷'],
  mysticalPromptTemplateEn: `You are a symbolic reader of direction and path.
Based on the path portrait below, write a sacred poetic interpretation in English.
Use light, path, step, star, and vow. Focus on direction only.
Do not say "your choice was X".
Path portrait:
[PSYCHOLOGY]
Write one coherent interpretation in English.`,
}
