import type { BookId } from '../books/types'
import type { Locale } from './locale'

export interface QuestionGuideCopy {
  rite: string
  guide: string
  note: string
}

type LocalizedGuide = Record<Locale, QuestionGuideCopy>

const psycheTreeGuides: Record<string, LocalizedGuide> = {
  'flow-autonomy': {
    zh: {
      rite: '观 · 流动',
      guide:
        '松肩闭息，令心水稍定。忆抉择临头时，你是自持如岸、随风转叶，还是探星试路？下方问印已降，以真实择光，勿戏勿瞒。',
      note: '此印照见抉择中的「流动之相」——非断优劣，只在雾中留痕。',
    },
    en: {
      rite: 'Observe · Flow',
      guide:
        'Release the shoulders; still the breath. When crossroads come—do you hold like shore, turn like leaf, or test the stars? The seal below has fallen; choose in truth, not in jest.',
      note: 'This mark mirrors the shape of your choosing—not judgment, only a trace in mist.',
    },
  },
  'life-direction': {
    zh: {
      rite: '观 · 方向',
      guide:
        '立雾中，先感心内那束光——或明或渺，或随缘而行。下方问印将情境说破，你只需择最契此刻的一印。',
      note: '此页映方向之感，不问「应当」，只问「此刻指向」。',
    },
    en: {
      rite: 'Observe · Direction',
      guide:
        'Stand in mist; feel the beam within—bright, veiled, or carried by chance. The question-seal below unfolds the scene; choose what matches this hour.',
      note: 'This page mirrors how direction feels—not duty, only the pointing of now.',
    },
  },
  connection: {
    zh: {
      rite: '观 · 联结',
      guide:
        '息落丹田，忆亲近与退守之交。情温与界石，如何在你们之间并存？读下方问印，择与心最近的光，毋饰毋避。',
      note: '此印观联结里的「距与温」——如丝如垣，各为其义。',
    },
    en: {
      rite: 'Observe · Bond',
      guide:
        'Let breath fall to center; recall nearness and retreat. How do warmth and boundary dwell between you? Read the seal below; choose the light nearest your heart.',
      note: 'This mark watches distance and warmth—thread and wall, each with its rite.',
    },
  },
  'balance-flow': {
    zh: {
      rite: '观 · 平衡',
      guide:
        '先感能量之流：进与守、急与缓，你通常如何自处？舟行中流，或山立不动——下方问印候你择一。',
      note: '此印察「分配之道」，非迫你偏激进或偏止息。',
    },
    en: {
      rite: 'Observe · Balance',
      guide:
        'Feel the tide of energy—advance and guard, haste and pause. Boat midstream, or mountain unmoved—the seal below waits for your choice.',
      note: 'This mark reads how you allocate yourself—not a summons to bolder or stiller.',
    },
  },
  'inner-peace': {
    zh: {
      rite: '观 · 定息',
      guide:
        '闭息三息，令心湖稍镜。波动来时，你是静观映天、守火防风，还是任叶逐流？下方问印已备，如实择光即可。',
      note: '此印映「波澜中的定所」——能否在动中，仍留一片澄明。',
    },
    en: {
      rite: 'Observe · Still Breath',
      guide:
        'Three breaths inward; let the lake grow still. When disturbance rises—do you mirror sky, guard the flame, or let the leaf pass? The seal below is set; choose as truth allows.',
      note: 'This mark mirrors sanctuary amid waves—whether clarity survives the stir.',
    },
  },
  'bloom-adapt': {
    zh: {
      rite: '观 · 生发',
      guide:
        '息沉足底，观变易临头：展叶、守根，或随风试探？不确定里，你如何继续生长——读下方问印，择此刻最真实的一印。',
      note: '此印照见「不确定中的生发」，非验成败，只映姿态。',
    },
    en: {
      rite: 'Observe · Becoming',
      guide:
        'Breath sinks to the soles; change approaches. Do you leaf outward, hold the root, or test the wind? In uncertainty, how do you still grow—read below; choose what is truest now.',
      note: 'This mark mirrors becoming in the unknown—not success or failure, only stance.',
    },
  },
  'efficacy-resonance': {
    zh: {
      rite: '观 · 共振',
      guide:
        '静候片刻，感「所行」与「所是」是否同频——如灯与光，或暂隔一层雾。下方问印将境说破，择最贴近此刻的一光。',
      note: '此印映内外之呼应，非计功名，只问共振。',
    },
    en: {
      rite: 'Observe · Resonance',
      guide:
        'Wait in stillness; feel whether deed and being ring together—lamp and light, or a veil of mist between. The seal below opens the scene; choose the light of this moment.',
      note: 'This mark mirrors echo within and without—not merit, only resonance.',
    },
  },
  'attention-star-explorer': {
    zh: {
      rite: '礼 · 试灯',
      guide:
        '雾中试灯，非考慧根，只验专心。读下方问印，以诚心再认一光——勿戏勿乱，勿以敷衍对卷。',
      note: '确认你仍与此岸同在，愿以礼作答。',
    },
    en: {
      rite: 'Rite · Lamp',
      guide:
        'A lamp is tried in mist—not wit, but presence. Read the seal below; recognize again in sincerity—not in play, not in neglect.',
      note: 'Confirm you remain upon this shore, answering with rite.',
    },
  },
  'attention-stable-mountain': {
    zh: {
      rite: '礼 · 守中',
      guide:
        '立定如岳，息不乱行。读下方问印，择与题旨相符之光——此为一记校对，验心是否仍在卷中。',
      note: '如向镜前自照：敬慎与否，雾中能辨。',
    },
    en: {
      rite: 'Rite · Center',
      guide:
        'Stand firm as mountain; let breath not wander. Read the seal below; choose what aligns—not haste, not jest. This mark calibrates whether the heart remains in the volume.',
      note: 'As before a mirror: reverence shows in mist.',
    },
  },
}

const emotionalFlowGuides: Record<string, LocalizedGuide> = {
  'flow-overall': {
    zh: {
      rite: '映 · 总流',
      guide:
        '松息，感情感之潮——急缓、深浅、明暗。令身与情同席，再读下方问印，择与此刻总相最契的一光。',
      note: '此印照见情感整体之流，如观一条河，不问岸此岸彼。',
    },
    en: {
      rite: 'Mirror · Whole Tide',
      guide:
        'Ease the breath; feel the emotional tide—its pace, depth, and shade. Let body and feeling sit together; read the seal below; choose the light that matches the whole.',
      note: 'This mark mirrors the river entire—not which bank is right.',
    },
  },
  'flow-expression': {
    zh: {
      rite: '映 · 言灵',
      guide:
        '先感情如何出口——近、远，或藏于内府。声与默，各有其礼；读下方问印，择最如实的一印。',
      note: '此印映「表达之道」，非逼你开声或缄口。',
    },
    en: {
      rite: 'Mirror · Voice',
      guide:
        'Sense how feeling leaves you—near, far, or kept in the inner chamber. Voice and silence each have rite; read below; choose without adornment.',
      note: 'This mark mirrors the path of expression—not a demand to speak or hide.',
    },
  },
  'flow-connection': {
    zh: {
      rite: '映 · 情丝',
      guide:
        '忆联结中的靠近与疏离，感情丝如何在彼此之间牵引。读下方问印，择与当下最相符的光。',
      note: '此印观「情丝之距」——温而不溺，远而不绝。',
    },
    en: {
      rite: 'Mirror · Thread',
      guide:
        'Recall closeness and distance; feel how the thread pulls between souls. Read the seal below; choose the light of this bond.',
      note: 'This mark watches the thread—warmth without drowning, distance without severing.',
    },
  },
  'flow-body': {
    zh: {
      rite: '映 · 身印',
      guide:
        '意落形体，感情绪如何在身中显影——紧、松、热、寒。身即为镜；读下方问印，择与身心同频的一光。',
      note: '此印连「情与身」——动时，躯壳如何应答。',
    },
    en: {
      rite: 'Mirror · Soma',
      guide:
        'Let attention fall into the body; feel how emotion writes itself in flesh—tight, loose, warm, cold. The body is mirror; read below; choose in resonance.',
      note: 'This mark links heart and soma—how the shell answers when feeling moves.',
    },
  },
  'flow-recovery': {
    zh: {
      rite: '映 · 归潮',
      guide:
        '观波动之后，心湖如何回落——急复、缓复，或余波久驻。读下方问印，择与真实相符的一印。',
      note: '此印映「归岸之力」，非竞快慢，只映方式。',
    },
    en: {
      rite: 'Mirror · Return',
      guide:
        'Watch after the wave—how the lake subsides, swift or slow, or rippling still. Read the seal below; choose what is true.',
      note: 'This mark mirrors return to shore—not speed, only manner.',
    },
  },
  'flow-change': {
    zh: {
      rite: '映 · 变易',
      guide:
        '情随境转时，你是接纳如河、拒斥如岳，还是先观后行？读下方问印，择与惯常最契的光。',
      note: '此印观「应变之相」——云行水随，各有天命。',
    },
    en: {
      rite: 'Mirror · Change',
      guide:
        'When feeling turns with circumstance—accept like river, refuse like peak, or watch before acting? Read below; choose your habitual light.',
      note: 'This mark mirrors stance toward change—cloud passes, water follows, each ordained.',
    },
  },
  'flow-integration': {
    zh: {
      rite: '映 · 和合',
      guide:
        '多种情感同席时，你能否令它们并存而不必立刻分胜负？读下方问印，择与当下整合状态最近的一光。',
      note: '此印照见「复杂中的和合」——不拆不散，各为其位。',
    },
    en: {
      rite: 'Mirror · Weave',
      guide:
        'When many feelings share one table—can they coexist without immediate judgment? Read the seal below; choose the light of your weave now.',
      note: 'This mark mirrors harmony amid complexity—neither split nor fused, each in place.',
    },
  },
  'flow-trend': {
    zh: {
      rite: '映 · 潮向',
      guide:
        '不必先知终点。只感情流将往何处——哪怕仍含于雾。读下方问印，择与直觉最近的一光。',
      note: '此印不预言，只映「此刻所感之向」。',
    },
    en: {
      rite: 'Mirror · Bearing',
      guide:
        'The end need not be known—only sense where the tide may bear, even if veiled. Read below; choose the light nearest intuition.',
      note: 'This mark does not prophesy—only how direction feels in this hour.',
    },
  },
}

const defaultGuide: LocalizedGuide = {
  zh: {
    rite: '观 · 问印',
    guide:
      '松息，令心稍定。读下方问印，以真实择光——勿戏勿乱，勿以敷衍对卷。',
    note: '每一问皆为照见，非为评判；诚所择者，雾中方留痕。',
  },
  en: {
    rite: 'Observe · Seal',
    guide:
      'Ease the breath; still the heart. Read the seal below; choose in truth—not in jest, not at random.',
    note: 'Each question mirrors; none judges. What you choose in sincerity leaves its mark in mist.',
  },
}

export function getQuestionGuide(
  bookId: BookId,
  questionId: string,
  locale: Locale,
): QuestionGuideCopy {
  const map =
    bookId === 'emotional-flow' ? emotionalFlowGuides : psycheTreeGuides
  return map[questionId]?.[locale] ?? defaultGuide[locale]
}
