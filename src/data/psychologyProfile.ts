import type { DimensionResult } from '../types'

const dimensionDescriptions: Record<
  number,
  Record<DimensionResult['level'], string>
> = {
  1: {
    high: '在面对重要选择时，您倾向于先感知内在节奏，再以清晰而稳定的方式向前流动，自主性较强。',
    'mid-high':
      '您会在守护自身边界的同时做出选择，既有定力，也保留一定的探索空间。',
    mid: '您的选择方式在不同情境下会有波动，有时跟随内在，有时受环境影响。',
    'mid-low': '重要选择时，您较容易受到外界信息或他人期待的影响而调整方向。',
    low: '面对选择时，内在方向感相对模糊，更多随环境自然流转。',
  },
  2: {
    high: '对人生方向有较为清晰的内在感知，像有根之树或星河指引，能在成长中保持方向感。',
    'mid-high': '您拥有基本的生命方向感，同时允许自己在探索中慢慢校准。',
    mid: '人生方向感时明时暗，您正在通过经验慢慢拼凑属于自己的地图。',
    'mid-low': '方向感尚未完全稳定，您常在迷雾与小径之间寻找下一步。',
    low: '较少主动规划人生方向，更多随生活之流自然漂流。',
  },
  3: {
    high: '在亲密关系中，您自然倾向于靠近、支持与回应，联结能力较为开放。',
    'mid-high':
      '您重视联结，也会在确认安全感后逐步加深彼此的交汇与信任。',
    mid: '您在靠近与守护之间寻找平衡，联结方式因关系情境而有所不同。',
    'mid-low': '您会保持一定的心理距离，联结需要更多时间与确认。',
    low: '在关系中较倾向守护内心空间，对外在靠近保持谨慎。',
  },
  4: {
    high: '面对资源分配与不确定性，您能稳住核心并灵活调整，保持整体平衡。',
    'mid-high': '您会根据情境灵活调整，同时保留一定的保守与守护倾向。',
    mid: '在流动与守衡之间，您的反应模式随压力与情境而变。',
    'mid-low': '倾向先保守守护现有资源，对新方向持谨慎观望态度。',
    low: '在不确定情境中较难快速找到分配与决策的平衡点。',
  },
  5: {
    high: '面对情绪波动，您较能先安静下来照见感受，或以温和方式自我安抚。',
    'mid-high': '您会先守护内在核心，再逐步处理与转化情绪。',
    mid: '情绪安住能力因情境而异，有时稳定，有时易受波动牵动。',
    'mid-low': '情绪波动时，需要更多时间才能回到内在稳定。',
    low: '情绪较容易随外在环境起伏，快速安住的能力尚在培养中。',
  },
  6: {
    high: '面对变化，您倾向于将其视为成长养分，以伸展与孕育的方式自然适应。',
    'mid-high': '您会先稳住根基，观察后再谨慎调整，适应方式较为稳健。',
    mid: '您对变化既开放又保留，适应节奏因变化性质而不同。',
    'mid-low': '变化中您较灵活流动，但有时感到缺乏坚实的落点。',
    low: '面对变化时适应路径不够清晰，更多随势而动。',
  },
  7: {
    high: '您的行动与内心价值大体保持共振，相信步伐能逐步靠近重要事物。',
    'mid-high': '您对自身效能有基本信心，同时仍在校准行动与向往的契合度。',
    mid: '行动与内心向往之间有时一致，有时需要更多澄清与对齐。',
    'mid-low': '偶尔感到力量感不足，行动与向往之间尚需更多支持。',
    low: '行动与内心向往之间存在较明显的距离感，需要更多内在确认。',
  },
}

export function generatePsychologyProfile(dimensions: DimensionResult[]): string {
  const lines = dimensions.map((d) => {
    const desc =
      dimensionDescriptions[d.dimensionIndex]?.[d.level] ??
      '该维度的信息尚不完整。'
    return `【${d.title}】${desc}`
  })

  return lines.join('\n\n')
}

export function buildPsychologyPromptInput(dimensions: DimensionResult[]): string {
  return dimensions
    .map((d) => {
      const desc =
        dimensionDescriptions[d.dimensionIndex]?.[d.level] ?? ''
      return `【${d.title}】${desc}`
    })
    .join('\n\n')
}
