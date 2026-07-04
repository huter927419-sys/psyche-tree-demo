import type { DimensionResult } from '../../types'

export type LevelDescriptions = Record<
  number,
  Record<DimensionResult['level'], string>
>

type ProfileLocale = 'zh' | 'en' | 'ja'

const incompleteFacet: Record<ProfileLocale, string> = {
  zh: '该维度的信息尚不完整。',
  en: 'This facet is not fully visible yet.',
  ja: 'この面向は、まだ霧の中に隠れています。',
}

function formatDimension(
  d: DimensionResult,
  descriptions: LevelDescriptions,
  locale: ProfileLocale,
): string {
  const desc =
    descriptions[d.dimensionIndex]?.[d.level] ?? incompleteFacet[locale]
  if (locale === 'en') return `[${d.title}] ${desc}`
  if (locale === 'ja') return `［${d.title}］${desc}`
  return `【${d.title}】${desc}`
}

export function generatePsychologyProfile(
  dimensions: DimensionResult[],
  descriptions: LevelDescriptions,
  locale: ProfileLocale = 'zh',
): string {
  const format = (d: DimensionResult) =>
    formatDimension(d, descriptions, locale)

  const main = dimensions
    .filter((d) => d.dimensionIndex >= 1 && d.dimensionIndex <= 6)
    .sort((a, b) => a.dimensionIndex - b.dimensionIndex)
  const integration = dimensions.find((d) => d.dimensionIndex === 7)
  const mainText = main.map(format).join('\n\n')

  if (!integration) return mainText
  return `${mainText}\n\n${format(integration)}`
}

export function buildPsychologyPromptInput(
  dimensions: DimensionResult[],
  descriptions: LevelDescriptions,
  locale: ProfileLocale = 'zh',
): string {
  return dimensions
    .map((d) => formatDimension(d, descriptions, locale))
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
