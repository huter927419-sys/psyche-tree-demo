import type {
  AttentionCheck,
  DimensionQuestion,
  QuestionItem,
} from '../../types'

type DimInput = Omit<DimensionQuestion, 'type'>

export function buildBookQuestionFlow(
  dimensions: DimInput[],
  integration: DimInput,
  attention: AttentionCheck,
): QuestionItem[] {
  if (dimensions.length !== 6) {
    throw new Error(`Expected 6 dimension questions, got ${dimensions.length}`)
  }

  const flow: QuestionItem[] = []
  dimensions.forEach((d, index) => {
    flow.push({ type: 'dimension', ...d, dimensionIndex: index + 1 })
    if (index === 2) flow.push(attention)
  })
  flow.push({
    type: 'dimension',
    ...integration,
    dimensionIndex: 7,
  })
  return flow
}

export const defaultAttention = (
  requiredCardId: string,
  requiredCardLabel: string,
): AttentionCheck => ({
  type: 'attention',
  id: 'attention-check',
  prompt: `为确认你仍与自己在对话，请择「${requiredCardLabel}」。`,
  requiredCardId,
  requiredCardLabel,
})

export const defaultAttentionEn = (
  requiredCardId: string,
  requiredCardLabel: string,
): AttentionCheck => ({
  type: 'attention',
  id: 'attention-check',
  prompt: `To confirm you are present, choose "${requiredCardLabel}".`,
  requiredCardId,
  requiredCardLabel,
})

export const defaultAttentionJa = (
  requiredCardId: string,
  requiredCardLabel: string,
): AttentionCheck => ({
  type: 'attention',
  id: 'attention-check',
  prompt: `対話が続いていることを確かめるため、「${requiredCardLabel}」を選んでください。`,
  requiredCardId,
  requiredCardLabel,
})
