import type { DimensionResult } from '../types'
import type { Locale } from '../i18n/locale'
import {
  closingsEn,
  mysticalPromptTemplateEn,
  mysticalSymbolsEn,
  openingsEn,
} from './mysticalReading.en'

const mysticalSymbols: Record<number, Record<DimensionResult['level'], string>> =
  {
    1: {
      high: '生命之树上，自主之流如一条银白的河，从源头静静蜿蜒至远方，每一道弯都映照着您内在的节律。',
      'mid-high':
        '山峰守望着河流的入口，您的能量在边界与流动之间找到神圣的平衡。',
      mid: '河面时有涟漪，风向时而转变，您的生命之流正在寻找属于自己的河道。',
      'mid-low': '叶影随风，河流暂被云雾遮蔽，内在的罗盘正在轻声呼唤您归来。',
      low: '风中的叶轻轻旋转，生命能量暂借外力导向，深处仍有源头等待被感知。',
    },
    2: {
      high: '根系深入大地，枝叶伸向星光，您的生命方向在生命之树的中轴上清晰闪耀。',
      'mid-high': '树影与星路交织，方向如微光在夜空中缓缓显形。',
      mid: '雾径延伸向远方，每一步都是向内在光源的虔诚靠近。',
      'mid-low': '迷雾中的行者，星光尚未完全汇聚，但路径已在脚下悄然展开。',
      low: '小舟随波，生命之树投下温柔阴影，漂流本身亦是一种等待觉醒的姿态。',
    },
    3: {
      high: '丝线与星光在人与人之间轻轻连接，温暖之手触碰之处，生命之树的分枝一同颤动。',
      'mid-high': '柔桥横跨两岸，联结在确认与信任中慢慢织就，如古老的丝线缠绕树干的纹理。',
      mid: '星河相望，独立与交汇如双星轨道，在宇宙间保持神圣的距离与共振。',
      'mid-low': '盾牌守护核心，联结之门半开，等待合适的时机与温度。',
      low: '内心圣殿的门扉轻合，守护本身亦是生命之树赋予的智慧。',
    },
    4: {
      high: '平衡之舟浮于资源之河，您的能量分配如树液般自然流向需要的分枝。',
      'mid-high': '风与叶共舞，灵活中保有根基，守衡的智慧在流动中显现。',
      mid: '山与河对话，保守与探索如阴阳互补，在生命之树上交替显影。',
      'mid-low': '厚土护根，资源如种子暂存于土壤，等待适宜的时节萌发。',
      low: '河流遇石迂回，守衡之路尚在寻觅，每一道曲折都是学习的印记。',
    },
    5: {
      high: '静湖如镜，倒映整片星空，情绪的波澜在您内在的神圣空间中自然止息。',
      'mid-high': '柔烛点亮心殿，守护之树环抱着您，情绪在光晕中慢慢沉淀。',
      mid: '湖面与风交替，安住如潮汐，深浅随月相而变。',
      'mid-low': '叶影摇曳，情绪如风过树梢，回归静湖需要片刻的耐心。',
      low: '风中之叶尚未找到落点，请记得每一片叶终将回归大树的怀抱。',
    },
    6: {
      high: '绽放之枝迎接季节更替，种子在土中觉醒，变化是您生命树上最丰饶的甘露。',
      'mid-high': '山峰不动，目光深远，适应如慢镜头中的树影生长。',
      mid: '云随风行，灵活与轻飘皆是天空赋予的两种面容。',
      'mid-low': '流云掠过枝梢，适应仍在寻找既流动又扎根的方式。',
      low: '变化如风，您如叶随势，深处种子的力量等待被日常的小行动唤醒。',
    },
    7: {
      high: '共振之光沿树干攀升，行动与向往在同一频率上闪烁，如树顶触及星辰。',
      'mid-high': '稳行之径在树根间延伸，信念如年轮一层层累积。',
      mid: '雾中行者，光在远处等候，澄清之路即是修行本身。',
      'mid-low': '寻灯者在暗夜中持火，力量尚在聚集，星光终将汇聚成路。',
      low: '雾中行步，向往如远星，距离本身召唤您向内倾听真正渴望的声音。',
    },
  }

const openings = [
  '在黑白生命之树的静默中，您的能量如古老符文缓缓显影。',
  '生命之树为您敞开一扇内观的门，以下是当前生命能量的流动图景。',
  '如古老智慧在低语，生命之树的每一道分支都映照着您此刻的内在状态。',
]

const closings = [
  '愿您在生命之树的荫蔽下，继续以温柔的方式与自己对话，让河流、星光与根系在时光中慢慢显形。',
  '树不会催促叶落，河不会催促流向——您的生命节奏，自有其神圣的时间。',
  '当下一阵风吹过枝梢，请记得：每一次向内倾听，都是在生命之树上刻下新的光痕。',
]

export function generateMysticalReading(
  dimensions: DimensionResult[],
  psychologyProfile: string,
  locale: Locale = 'zh',
): string {
  void psychologyProfile

  const openingPool = locale === 'en' ? openingsEn : openings
  const closingPool = locale === 'en' ? closingsEn : closings
  const symbolTable = locale === 'en' ? mysticalSymbolsEn : mysticalSymbols

  const opening = openingPool[Math.floor(Math.random() * openingPool.length)]
  const closing = closingPool[Math.floor(Math.random() * closingPool.length)]

  const body = dimensions
    .map((d) => symbolTable[d.dimensionIndex]?.[d.level] ?? '')
    .filter(Boolean)
    .join('\n\n')

  return `${opening}\n\n${body}\n\n${closing}`
}

/** Template for external LLM API integration */
export const mysticalPromptTemplate = `你是一位深谙生命象征与内在智慧的玄学解读者。
请根据以下心理学底层画像，用庄严而诗意的语言进行玄学解读。
使用生命之树、河流、星光、丝线、山峰等象征元素。
语气神圣而温柔，像古老的智慧在低语。
不要直接说"你的选择是XX"，而是描述当前生命能量的状态与流动。
心理学画像：
[在此插入7个维度的得分与描述]
请生成一段连贯的玄学解读。`

export function buildMysticalPrompt(
  psychologyInput: string,
  locale: Locale = 'zh',
): string {
  if (locale === 'en') {
    return mysticalPromptTemplateEn.replace('[PSYCHOLOGY]', psychologyInput)
  }
  return mysticalPromptTemplate.replace(
    '[在此插入7个维度的得分与描述]',
    psychologyInput,
  )
}
