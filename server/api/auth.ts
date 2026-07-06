import type { IncomingMessage } from 'node:http'
import { findJourneyByAccessTokenHash } from '../db/repositories/journeys.js'
import type { JourneyRow } from '../db/types.js'
import { getHeader } from '../api/http.js'
import { hashAccessToken } from '../auth/token.js'

export function extractAccessToken(req: IncomingMessage): string | undefined {
  const authorization = getHeader(req, 'authorization')
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length).trim()
    if (token) return token
  }

  const legacy = getHeader(req, 'x-journey-token')
  return legacy?.trim() || undefined
}

export function resolveJourneyFromRequest(
  req: IncomingMessage,
  expectedJourneyId?: string,
): JourneyRow {
  const token = extractAccessToken(req)
  if (!token) {
    throw new Error('MISSING_ACCESS_TOKEN')
  }

  const hash = hashAccessToken(token)
  const journey = findJourneyByAccessTokenHash(hash)
  if (!journey) {
    throw new Error('INVALID_ACCESS_TOKEN')
  }

  if (expectedJourneyId && journey.id !== expectedJourneyId) {
    throw new Error('INVALID_ACCESS_TOKEN')
  }

  return journey
}

export {
  generateAccessToken,
  hashAccessToken,
  isAccessTokenFormat,
  verifyAccessTokenHash,
} from '../auth/token.js'
