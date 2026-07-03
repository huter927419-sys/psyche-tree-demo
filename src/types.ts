export type CardScore = -2 | -1 | 1 | 2

export interface CardOption {
  id: string
  label: string
  description: string
  score: CardScore
  pattern: string
}

export interface DimensionQuestion {
  type: 'dimension'
  id: string
  dimensionIndex: number
  title: string
  prompt: string
  cards: CardOption[]
}

export interface AttentionCheck {
  type: 'attention'
  id: string
  prompt: string
  requiredCardId: string
  requiredCardLabel: string
}

export type QuestionItem = DimensionQuestion | AttentionCheck

export interface DimensionResult {
  dimensionIndex: number
  title: string
  averageScore: number
  selectedCards: CardOption[]
  level: 'high' | 'mid-high' | 'mid' | 'mid-low' | 'low'
}

export interface AssessmentResult {
  dimensions: DimensionResult[]
  psychologyProfile: string
  mysticalReading: string
  attentionPassed: boolean
  attentionFailures: string[]
}
