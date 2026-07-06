export type Locale = 'zh' | 'zhTw' | 'en' | 'ja'
export type JourneyStatus = 'in_progress' | 'completed'
export type ReadingStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type ReadingSource = 'deepseek' | 'fallback'

export interface UserRow {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface JourneyRow {
  id: string
  user_id: string
  locale: Locale
  status: JourneyStatus
  created_at: string
  updated_at: string
  completed_at: string | null
  holistic_prompt_input: string | null
  holistic_reading: string | null
  holistic_reading_source: ReadingSource | null
  holistic_reading_model: string | null
  holistic_reading_status: ReadingStatus
  holistic_reading_error: string | null
  holistic_reading_locale: Locale | null
  holistic_reading_zh: string | null
  holistic_reading_en: string | null
  holistic_reading_source_zh: ReadingSource | null
  holistic_reading_source_en: ReadingSource | null
  holistic_prompt_input_zh: string | null
  holistic_prompt_input_en: string | null
  holistic_prompt_input_ja: string | null
  holistic_reading_ja: string | null
  holistic_reading_source_ja: ReadingSource | null
  holistic_reading_zh_tw: string | null
  holistic_reading_source_zh_tw: ReadingSource | null
  holistic_prompt_input_zh_tw: string | null
  access_token_hash: string | null
}

export interface BookAssessmentRow {
  id: string
  journey_id: string
  book_id: string
  locale: Locale
  psychology_profile: string
  psychology_prompt_input: string
  dimensions_json: string
  answers_json: string
  attention_passed: number
  attention_failures_json: string
  mystical_reading: string | null
  mystical_reading_source: ReadingSource | null
  mystical_reading_model: string | null
  mystical_reading_status: ReadingStatus
  mystical_reading_error: string | null
  mystical_reading_locale: Locale | null
  mystical_reading_zh: string | null
  mystical_reading_en: string | null
  mystical_reading_source_zh: ReadingSource | null
  mystical_reading_source_en: ReadingSource | null
  mystical_reading_ja: string | null
  mystical_reading_source_ja: ReadingSource | null
  mystical_reading_zh_tw: string | null
  mystical_reading_source_zh_tw: ReadingSource | null
  created_at: string
  updated_at: string
}

export interface StoredDimensionResult {
  dimensionIndex: number
  title: string
  averageScore: number
  level: string
  selectedCardIds: string[]
}

export interface SaveAssessmentInput {
  journeyId: string
  bookId: string
  locale: Locale
  psychologyProfile: string
  psychologyPromptInput: string
  dimensions: StoredDimensionResult[]
  answers: Record<string, string[]>
  attentionPassed: boolean
  attentionFailures: string[]
}
