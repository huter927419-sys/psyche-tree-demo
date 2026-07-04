import type { BookDefinition } from '../books/types'
import type { AssessmentResult } from '../types'
import { computeResults } from '../data/scoring'
import type { JourneyAssessmentDto } from './journeyApi'

export function buildAssessmentFromStored(
  stored: JourneyAssessmentDto,
  book: BookDefinition,
): AssessmentResult {
  const computed = computeResults(stored.answers, book.questions, book)
  return {
    ...computed,
    psychologyProfile: stored.psychologyProfile,
    mysticalReading: stored.mysticalReading ?? computed.mysticalReading,
    attentionPassed: stored.attentionPassed,
    attentionFailures: stored.attentionFailures,
  }
}
