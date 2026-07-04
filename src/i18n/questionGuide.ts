import type { BookId } from '../books/types'
import type { Locale } from './locale'
import { JA_GUIDES_BY_BOOK } from './questionGuide.ja'

export interface QuestionGuideCopy {
  rite: string
  guide: string
  note: string
}

type GuideMap = Record<string, Record<'zh' | 'en', QuestionGuideCopy>>

const guidesByBook: Record<BookId, GuideMap> = {
  'psyche-tree': {
    'psyche-boundary': {
      zh: {
        rite: '观 · 界石',
        guide:
          '此印问界——当他人期待靠近，你的岸更常如何？下方四象映开阖之形，择最契此刻一印。',
        note: '界石非拒人，只在雾中辨认你与外的距离。',
      },
      en: {
        rite: 'Seal · Boundary Stone',
        guide:
          'The oracle inquires at your inner threshold. When others lean close, how does your sacred boundary hold? Let the symbol on the right name what is true.',
        note: 'A boundary is not a wall against love—only the distance your spirit needs now.',
      },
    },
    'psyche-wave': {
      zh: {
        rite: '观 · 映波',
        guide:
          '此印问纹——心湖起波时，你先照见还是先被浪带走？下方问印候你择一湖相。',
        note: '映波无对错，只在辨认波起之序。',
      },
      en: {
        rite: 'Seal · Ripple Mirror',
        guide:
          'The inner lake stirs. Do you witness the ripple before the wave, or feel yourself carried first? Trust whichever sign mirrors your pattern.',
        note: 'No omen is wrong here—only the order in which feeling rises.',
      },
    },
    'psyche-still': {
      zh: {
        rite: '观 · 定息',
        guide:
          '此印问息——波动之后，你如何让湖归镜、让烛重明？下方四象映归息之路。',
        note: '定息有快有慢，择此刻真实之径。',
      },
      en: {
        rite: 'Seal · Still Breath',
        guide:
          'After the swell passes, how does stillness return—mirror, flame, or guarded tree? Choose the path your body already knows.',
        note: 'Stillness keeps its own rhythm; honor yours without comparison.',
      },
    },
    'psyche-mirror': {
      zh: {
        rite: '观 · 自照',
        guide:
          '此印问镜——向内在照镜子时，你更常见清湖、持灯、还是雾中行？下方问印已降。',
        note: '自照非判罪，只在雾中留一帧真影。',
      },
      en: {
        rite: 'Seal · Inner Mirror',
        guide:
          'Turn inward as to a sacred mirror. Do you meet clear water, a guiding lamp, or a pilgrim in fog? Let intuition pick the vision.',
        note: 'Self-reflection is not judgment—only one honest glimpse through the veil.',
      },
    },
    'psyche-guard': {
      zh: {
        rite: '观 · 内守',
        guide:
          '此印问守——外风渐起时，你的干更常如何内守？下方四象映护心之形。',
        note: '内守可紧可松，择与当下压力相合者。',
      },
      en: {
        rite: 'Seal · Tree-Heart Guard',
        guide:
          'Outer winds rise. How does your inner trunk hold—unmoved, mountain-steady, shielded, or swaying? Select the archetype that fits this season.',
        note: 'Inner guard may be firm or yielding; match the weather you feel.',
      },
    },
    'psyche-root': {
      zh: {
        rite: '观 · 根息',
        guide:
          '此印问源——当你触内在之源，更接近深根、萌种、雾径还是暂泊之舟？下方择一象。',
        note: '根息深浅各异，无高下，只在认源。',
      },
      en: {
        rite: 'Seal · Root Breath',
        guide:
          'Reach for the source beneath personality. Deep root, waking seed, fog path, or drifting boat—which image answers when you go still?',
        note: 'Roots run at different depths; the oracle ranks none above another.',
      },
    },
    'psyche-whole': {
      zh: {
        rite: '观 · 整象',
        guide:
          '六印已落，今观整象——界、湖、根诸力交汇，下方问印将整象说破，择最契此刻一印。',
        note: '此印收束自我诸面，非断优劣，只在雾中留一帧整象。',
      },
      en: {
        rite: 'Seal · Whole Image',
        guide:
          'Six signs have fallen; now the whole constellation—boundary, lake, and root as one. Which integrated vision speaks for this hour?',
        note: 'This seal gathers the self; the reading mirrors, it does not judge.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「星光探索者」，勿戏勿瞒。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—a soft check that you remain present. Draw Star explorer to confirm honest communion with the reading.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },

  'emotional-flow': {
    'flow-overall': {
      zh: {
        rite: '观 · 流势',
        guide:
          '此印问势——最近情感更像静湖、涌泉、涟漪还是激流？下方四象映流势之形。',
        note: '流势随季而变，择此刻最真之一。',
      },
      en: {
        rite: 'Seal · Emotional Tide',
        guide:
          'Lately, how does feeling move through you—still lake, rising spring, gentle ripple, or rushing river? Let the current choose its symbol.',
        note: 'Tides turn with the season; speak only for this moment.',
      },
    },
    'flow-expression': {
      zh: {
        rite: '观 · 流言',
        guide:
          '此印问言——情感需出口时，你更常以柔光、共振、随风还是留于雾中？下方择一相。',
        note: '流言各得其声，无应然之形。',
      },
      en: {
        rite: 'Seal · Voice of Feeling',
        guide:
          'When the heart must speak, does it come as candlelight, resonant beam, leaf on wind, or silence in mist? Trust the expression that is yours.',
        note: 'Every soul has its own language; none is the only sacred one.',
      },
    },
    'flow-connection': {
      zh: {
        rite: '观 · 流联',
        guide:
          '此印问联——他人情感靠近时，你的湖更常温手、架桥、持盾还是远观星河？下方问印候择。',
        note: '流联无拒迎之分，只在认此刻之距。',
      },
      en: {
        rite: 'Seal · Heart Bond',
        guide:
          'Another\'s feeling draws near. Do you open warm hands, build a bridge, lift a shield, or watch from distant stars? Name your true response.',
        note: 'The oracle does not ask yes or no to closeness—only the distance you keep now.',
      },
    },
    'flow-body': {
      zh: {
        rite: '观 · 流身',
        guide:
          '此印问身——情感近来如何在身体里落脚？稳流、感知、云影还是难定？下方四象映身感。',
        note: '流身是情与肉的对话，择你此刻所感。',
      },
      en: {
        rite: 'Seal · Embodied Feeling',
        guide:
          'Where does emotion live in the body these days—steady river, sensing water, passing cloud, or restless wind? Let somatic truth pick the sign.',
        note: 'Flesh and feeling speak together; witness what they say.',
      },
    },
    'flow-recovery': {
      zh: {
        rite: '观 · 流息',
        guide:
          '此印问息——情感起伏后，你更常快归镜、先稳山、久泊舟还是雾中寻径？下方择一。',
        note: '流息有迟有早，皆属人之常。',
      },
      en: {
        rite: 'Seal · Return to Still',
        guide:
          'After emotional swell, how do you come home—mirror stilled, mountain held, long mooring, or wandering fog? Choose the recovery you know.',
        note: 'Healing keeps its own clock; early and late are both human.',
      },
    },
    'flow-change': {
      zh: {
        rite: '观 · 流变',
        guide:
          '此印问变——关系或环境生变时，情感更似萌种、展枝、勉力平衡还是收紧如山？下方问印已降。',
        note: '流变非祸非福，只在认你如何应对浪。',
      },
      en: {
        rite: 'Seal · Turning Tide',
        guide:
          'When relation or world shifts, does feeling seed, bloom, balance in the boat, or fortify like mountain? Select the omen of your adaptation.',
        note: 'Change is neither curse nor blessing—only how you meet the wave.',
      },
    },
    'flow-whole': {
      zh: {
        rite: '观 · 整湖',
        guide:
          '六脉已映，今观整湖——诸情曾潮曾静，下方问印候你择一湖相。',
        note: '此印收束情感诸脉，只是此刻湖心之一帧。',
      },
      en: {
        rite: 'Seal · Whole Lake',
        guide:
          'Six currents traced; tides and stillness merge as one lake. Which whole vision reflects your emotional landscape now?',
        note: 'This seal gathers feeling—the reading holds, it does not condemn.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「温暖之手」。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—confirm you remain present. Draw Warm hands as a sign of honest attention.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },

  'mind-light': {
    'mind-flow': {
      zh: {
        rite: '观 · 思流',
        guide:
          '此印问流——岔路在前、未动之前，思流更常先静后动、试探照路还是随风先动？下方择一。',
        note: '思流无快慢之判，只在认起步之序。',
      },
      en: {
        rite: 'Seal · Mind Flow',
        guide:
          'At the crossroads, before motion—does thought still first, probe with starlight, or leap with the wind? Let the symbol name your mental rhythm.',
        note: 'The oracle grades no speed—only the order in which you begin.',
      },
    },
    'mind-learn': {
      zh: {
        rite: '观 · 学纹',
        guide:
          '此印问学——新纹入卷时，你更常持灯细读、身感入纹、对话呼应还是雾中摸索？下方问印候择。',
        note: '学纹之路各异，择与你相合者。',
      },
      en: {
        rite: 'Seal · Learning Path',
        guide:
          'New patterns arrive at the threshold. Do you read by lamp, learn through the body, echo in dialogue, or search the fog? Trust your way of knowing.',
        note: 'Wisdom has many doors; choose the one that is authentically yours.',
      },
    },
    'mind-focus': {
      zh: {
        rite: '观 · 专镜',
        guide:
          '此印问镜——一念既起，光更常停深潭、护干、随云还是游散？下方四象映专镜之形。',
        note: '专镜可久可短，无应然之距。',
      },
      en: {
        rite: 'Seal · Focused Light',
        guide:
          'A single thought kindles. Does your light pool in deep water, guard the trunk, drift like cloud, or scatter like leaf? Select where attention truly rests.',
        note: 'Focus may burn steady or brief; both are valid in the reading.',
      },
    },
    'mind-analyze': {
      zh: {
        rite: '观 · 辨光',
        guide:
          '此印问辨——雾中多影时，你更常拆步理影、观全象、立山慢拆还是影叠影乱？下方择一。',
        note: '辨光无聪钝，只在认你如何在雾中理路。',
      },
      en: {
        rite: 'Seal · Discernment',
        guide:
          'Many shadows in the mist. Do you sort step by step, read the whole sky, wait on the mountain, or lose the thread? Name how clarity finds you.',
        note: 'Discernment is not cleverness—only how you seek light in confusion.',
      },
    },
    'mind-create': {
      zh: {
        rite: '观 · 创泉',
        guide:
          '此印问泉——点子将来时，更似枝展连远、星路试探、慢萌待土还是散于雾中？下方问印已降。',
        note: '创泉有急有缓，皆可为源。',
      },
      en: {
        rite: 'Seal · Creative Spring',
        guide:
          'The spring stirs. Do ideas branch wide, test starlit paths, seed slowly in earth, or scatter in fog? Let creation choose its emblem.',
        note: 'Inspiration may rush or wait—both can be holy water.',
      },
    },
    'mind-decide': {
      zh: {
        rite: '观 · 择印',
        guide:
          '此印问择——印将落纸，你更常久观后决、衡速与深、快决快改还是悬于雾中？下方择一。',
        note: '择印有轻有重，择此刻真实之度。',
      },
      en: {
        rite: 'Seal · The Choosing',
        guide:
          'The seal must fall. Do you watch long, balance speed and depth, decide swiftly, or linger in fog? Honor the pace that matches this crossroads.',
        note: 'Some choices weigh heavy, some light—truth matters more than haste.',
      },
    },
    'mind-whole': {
      zh: {
        rite: '观 · 归光',
        guide:
          '六脉已显，今观归光——思与情可同席，下方问印问主光落于何脉。',
        note: '此印收束思维诸脉，只在雾中留一帧光图。',
      },
      en: {
        rite: 'Seal · Returning Light',
        guide:
          'Six lights traced—thought and feeling share one table. Where does the master beam fall in your inner sky?',
        note: 'This seal gathers mind; one constellation in mist, not a verdict.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「静湖之镜」。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—confirm you remain present. Draw Still lake as a sign of honest attention.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },

  'bond-thread': {
    'bond-near': {
      zh: {
        rite: '观 · 丝近',
        guide:
          '此印问近——与重要之人相处，丝更常温手、架桥、双星相望还是持盾护距？下方择一。',
        note: '丝近无亲疏之判，只在认靠近之形。',
      },
      en: {
        rite: 'Seal · Sacred Nearness',
        guide:
          'With one who matters, how do your threads run—warm, over the bridge, orbiting like twin stars, or shielded? Let intimacy name its symbol.',
        note: 'Nearness is not measured in closeness points—only the shape you take.',
      },
    },
    'bond-warm': {
      zh: {
        rite: '观 · 丝温',
        guide:
          '此印问温——联结中，温度更常以共振、柔光、守中不外还是留于内雾？下方问印候择。',
        note: '丝温可显可隐，皆可为真。',
      },
      en: {
        rite: 'Seal · Warmth Between',
        guide:
          'In the weave of connection, is warmth resonance, soft candle, guarded trunk, or mist held inward? Select how heat moves through you.',
        note: 'Warmth may show openly or stay veiled—both can be true.',
      },
    },
    'bond-distance': {
      zh: {
        rite: '观 · 丝距',
        guide:
          '此印问距——亲近与距离之间，丝距更常双星相望、随信调整、稳如山还是偏紧半掩？下方择一。',
        note: '丝距随人随境，无唯一尺度。',
      },
      en: {
        rite: 'Seal · Sacred Distance',
        guide:
          'Between closeness and space—twin stars, adjusting bridge, steady mountain, or tight shield? Name the orbit that feels honest now.',
        note: 'Distance has no universal measure; the oracle asks only for yours.',
      },
    },
    'bond-trust': {
      zh: {
        rite: '观 · 丝信',
        guide:
          '此印问信——信任将织时，更常以试探织桥、行动传信、慢落稳丝还是易损重修？下方问印已降。',
        note: '丝信有快有慢，皆需真实。',
      },
      en: {
        rite: 'Seal · Trust Thread',
        guide:
          'When faith is woven, do you bridge by trial, show warmth in deed, climb slowly, or shield and repair? Trust the sign of your pattern.',
        note: 'Trust arrives at different speeds—all require sincerity.',
      },
    },
    'bond-guard': {
      zh: {
        rite: '观 · 丝守',
        guide:
          '此印问守——缘风渐起，界更常如山清晰、护干续缘、舟中相衡还是随风易移？下方择一。',
        note: '丝守非绝缘，只在护界之形。',
      },
      en: {
        rite: 'Seal · Bond Guard',
        guide:
          'Relational winds rise. Is your edge mountain-clear, trunk-held, balanced in the boat, or drifting like leaf? Choose how you protect the bond.',
        note: 'Guard is not exile—only the shape of your sacred edge.',
      },
    },
    'bond-repair': {
      zh: {
        rite: '观 · 丝复',
        guide:
          '此印问复——缘丝受挫后，更视之为再织之机、慢针续桥、久泊再愿还是断丝雾中？下方问印候择。',
        note: '丝复无时限，择你此刻真实之应。',
      },
      en: {
        rite: 'Seal · Mending Thread',
        guide:
          'When threads fray, do you re-weave, mend slowly, moor before returning, or lose the path in fog? Name your way of repair.',
        note: 'Mending has no deadline—only the response that is true today.',
      },
    },
    'bond-whole': {
      zh: {
        rite: '观 · 整缘',
        guide:
          '六丝已织，今观整缘——近、温、距、信交织，下方问印映整图。',
        note: '此印收束联结诸丝，只是缘面之一帧。',
      },
      en: {
        rite: 'Seal · Whole Bond',
        guide:
          'Six threads woven—nearness, warmth, distance, and trust as one tapestry. Which whole image reflects your relational field?',
        note: 'This seal gathers connection; the reading witnesses, it does not judge.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「星河相望」。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—confirm you remain present. Draw Distant stars as a sign of honest attention.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },

  'flow-balance': {
    'balance-split': {
      zh: {
        rite: '观 · 分力',
        guide:
          '此印问分——力与资源需分配时，更常稳核分流、先感再分、随风微调还是偏守难开？下方择一。',
        note: '分力无完美比例，只在认此刻之衡。',
      },
      en: {
        rite: 'Seal · Dividing Force',
        guide:
          'Energy and resource must be divided. Do you balance from the core, sense first, flex with wind, or hold tight? Select your way of apportioning.',
        note: 'No perfect split exists—only the balance you hold in this hour.',
      },
    },
    'balance-source': {
      zh: {
        rite: '观 · 守源',
        guide:
          '此印问源——不确定临头，更常先守厚土、护根守干、守中有探还是源感模糊？下方问印已降。',
        note: '守源非怯进，只在护住仍可再行的底。',
      },
      en: {
        rite: 'Seal · Guarding Source',
        guide:
          'Uncertainty gathers. Do you hold the mountain, guard roots, probe within guard, or feel the well run dry? Name how you protect what sustains you.',
        note: 'Guarding source is not cowardice—keeping ground from which to move.',
      },
    },
    'balance-mist': {
      zh: {
        rite: '观 · 雾行',
        guide:
          '此印问步——雾中行路，更常缓步辨路、持灯徐行、停惑仍行还是雾径常迷？下方四象映定步之形。',
        note: '雾行无捷径，择与你步伐相合者。',
      },
      en: {
        rite: 'Seal · Walking in Mist',
        guide:
          'The path is veiled. Do you pace slowly, carry a lamp, pause yet move, or lose the way? Let the oracle reflect your step in fog.',
        note: 'Mist offers no shortcut—only the stride that is authentically yours.',
      },
    },
    'balance-pace': {
      zh: {
        rite: '观 · 急缓',
        guide:
          '此印问律——急缓之间，流更常如河有渠、山稳缓行、云随风还是易失衡？下方问印候择。',
        note: '急缓随事而变，无恒定之律。',
      },
      en: {
        rite: 'Seal · Rhythm & Pace',
        guide:
          'Between haste and rest—is your flow a channelled river, steady mountain, drifting cloud, or unsteady leaf? Choose the tempo you live now.',
        note: 'Rhythm shifts with the work; no fixed beat is demanded.',
      },
    },
    'balance-turn': {
      zh: {
        rite: '观 · 转势',
        guide:
          '此印问转——势变突至，更常化养为势、转舵中流、转快失定还是势变则散？下方择一。',
        note: '转势有顺有滞，皆属守变之一面。',
      },
      en: {
        rite: 'Seal · Turning Point',
        guide:
          'Momentum shifts suddenly. Do you feed what blooms, steer midstream, turn too fast, or scatter? Select the omen of your adaptation.',
        note: 'Turning may be graceful or late—both belong to the living current.',
      },
    },
    'balance-boat': {
      zh: {
        rite: '观 · 定舟',
        guide:
          '此印问舟——压力之下，更常山立舟稳、护干定舟、舟晃仍学定还是浪急难留？下方问印已降。',
        note: '定舟无永不倾者，只在认压下之形。',
      },
      en: {
        rite: 'Seal · Steady Vessel',
        guide:
          'Under pressure, is your vessel mountain-steady, trunk-guarded, still learning balance, or lost to torrent? Name how you ride the swell.',
        note: 'Every boat rocks; the reading asks how you meet the weight.',
      },
    },
    'balance-whole': {
      zh: {
        rite: '观 · 整流',
        guide:
          '六衡已照，今观整流——分、守、行诸力交汇，下方问印映一河之相。',
        note: '此印收束守衡诸面，只是中流之一帧。',
      },
      en: {
        rite: 'Seal · Whole Flow',
        guide:
          'Six measures taken—split, guard, and movement merge as one river. Which whole current mirrors your equilibrium now?',
        note: 'This seal gathers balance; one river in mist, not a sentence.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「星光探索者」。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—confirm you remain present. Draw Star explorer as a sign of honest attention.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },

  'direction-light': {
    'dir-light': {
      zh: {
        rite: '观 · 光向',
        guide:
          '此印问向——停下来感方向，内在之光更常有根向光、星引在前、雾径寻中还是光向未聚？下方择一。',
        note: '光向可明可隐，皆在途中。',
      },
      en: {
        rite: 'Seal · Inner Bearing',
        guide:
          'Pause and feel direction. Is your light rooted, star-led, sought through fog, or still ungathered? Let the compass of the soul speak.',
        note: 'Bearing may be clear or veiled—both are still on the path.',
      },
    },
    'dir-meaning': {
      zh: {
        rite: '观 · 光义',
        guide:
          '此印问义——所重所轻之间，光义更常共振清晰、持灯辨名、雾中向行还是随风无锚？下方问印候择。',
        note: '光义不必全称，一帧真实即可。',
      },
      en: {
        rite: 'Seal · Sacred Meaning',
        guide:
          'Among what you weigh, is meaning resonant, lamp-lit, walked through fog, or carried by wind? Name what truly matters in this season.',
        note: 'Meaning need not be complete—one honest frame is enough.',
      },
    },
    'dir-step': {
      zh: {
        rite: '观 · 步履',
        guide:
          '此印问步——心向与步伐之间，更常步跟光、小步试探、步慢心快还是步心仍距？下方四象映行之形。',
        note: '步履有齐有距，无应然之速。',
      },
      en: {
        rite: 'Seal · Sacred Step',
        guide:
          'Between the heart\'s direction and the feet—do they align, probe in small steps, lag behind, or stay apart? Select how you walk your truth.',
        note: 'Steps may match longing or not; the oracle honors both.',
      },
    },
    'dir-resonance': {
      zh: {
        rite: '观 · 共振',
        guide:
          '此印问振——回顾行动与向往，更常感同频、信步靠近、力弱寻援还是仍有距离？下方问印已降。',
        note: '共振可强可弱，皆属向光之一态。',
      },
      en: {
        rite: 'Seal · Resonance',
        guide:
          'Looking back at deed and longing—are they in tune, trusted on the path, seeking ally, or still apart? Name the chord you hear.',
        note: 'Resonance may ring strong or faint—both are states of light.',
      },
    },
    'dir-vow': {
      zh: {
        rite: '观 · 持愿',
        guide:
          '此印问愿——短雾临头，愿更常如界石、护愿于干、随风找回还是易灭需再点？下方择一。',
        note: '持愿非永不摇，只在认雾中之坚。',
      },
      en: {
        rite: 'Seal · Living Vow',
        guide:
          'Passing fog tests intention. Is your vow boundary-stone, trunk-held, wind-tossed yet returning, or a candle re-lit? Choose how promise survives.',
        note: 'A vow may waver; the reading asks how it holds in mist.',
      },
    },
    'dir-probe': {
      zh: {
        rite: '观 · 探径',
        guide:
          '此印问探——径未明时，更常小步试光、持灯探径、久观后动还是多在雾中？下方问印候择。',
        note: '探径无莽无滞之判，择真实之一。',
      },
      en: {
        rite: 'Seal · Pathfinding',
        guide:
          'The way is unclear. Do you test with small steps, lamp the path, wait on the mountain, or stay in fog? Trust your method of seeking.',
        note: 'Pathfinding is neither rash nor frozen—only what is true for you.',
      },
    },
    'dir-whole': {
      zh: {
        rite: '观 · 整光',
        guide:
          '六向已显，今观整光——向、步、愿交织，下方问印映一光之相。',
        note: '此印收束方向诸向，只是光径之一帧。',
      },
      en: {
        rite: 'Seal · Whole Light',
        guide:
          'Six bearings shown—direction, step, and vow as one beam. Which integrated light reflects your path through the mist?',
        note: 'This seal gathers purpose; the oracle points, it does not command.',
      },
    },
    'attention-check': {
      zh: {
        rite: '验 · 在席',
        guide:
          '半程暂驻——为证你仍与自己在对话，下方问印请择「星光探索者」。',
        note: '此印只验在席，不计分，不评优劣。',
      },
      en: {
        rite: 'Witness · Presence',
        guide:
          'Midway through the spread—confirm you remain present. Draw Star explorer as a sign of honest attention.',
        note: 'This sign is not scored; it only asks that you stay with yourself.',
      },
    },
  },
}

export function getQuestionGuide(
  bookId: BookId,
  questionId: string,
  locale: Locale,
): QuestionGuideCopy {
  if (locale === 'ja') {
    const jaGuide = JA_GUIDES_BY_BOOK[bookId]?.[questionId]
    if (jaGuide) return jaGuide
  }

  const bookGuides = guidesByBook[bookId]
  const specific = bookGuides?.[questionId]?.[locale === 'en' ? 'en' : 'zh']
  if (specific) return specific

  const fallback = bookGuides?.[questionId]?.zh
  if (fallback && locale !== 'zh') {
    return {
      rite: fallback.rite,
      guide: fallback.guide,
      note: fallback.note,
    }
  }

  const fallbacks: Record<Locale, QuestionGuideCopy> = {
    zh: {
      rite: '观',
      guide: '松肩闭息，择最契此刻一印。',
      note: '非断优劣，只在雾中留痕。',
    },
    en: {
      rite: 'Seal · Contemplation',
      guide: 'Breathe once. Let the symbol that resonates choose you.',
      note: 'The reading mirrors; it does not judge.',
    },
    ja: {
      rite: '観 · 静',
      guide: '一度息を整え、今共鳴する象徴を右から選んでください。',
      note: '霊示は裁きません。霧の中の一帧だけを映します。',
    },
  }
  return fallbacks[locale]
}
