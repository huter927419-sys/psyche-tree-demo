import type { DimensionResult } from '../../types'

export type LevelDescriptions = Record<
  number,
  Record<DimensionResult['level'], string>
>

export function generatePsychologyProfile(
  dimensions: DimensionResult[],
  descriptions: LevelDescriptions,
): string {
  return dimensions
    .map((d) => {
      const desc =
        descriptions[d.dimensionIndex]?.[d.level] ?? '该维度的信息尚不完整。'
      return `【${d.title}】${desc}`
    })
    .join('\n\n')
}

export function buildPsychologyPromptInput(
  dimensions: DimensionResult[],
  descriptions: LevelDescriptions,
): string {
  return dimensions
    .map((d) => {
      const desc = descriptions[d.dimensionIndex]?.[d.level] ?? ''
      return `【${d.title}】${desc}`
    })
    .join('\n\n')
}

export function generateMysticalFromSymbols(
  dimensions: DimensionResult[],
  symbols: LevelDescriptions,
  openings: string[],
  closings: string[],
): string {
  const opening = openings[Math.floor(Math.random() * openings.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  const body = dimensions
    .map((d) => symbols[d.dimensionIndex]?.[d.level] ?? '')
    .filter(Boolean)
    .join('\n\n')
  return `${opening}\n\n${body}\n\n${closing}`
}
