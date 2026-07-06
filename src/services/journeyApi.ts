import type { Locale } from '../i18n/locale'
import { clearGuideProgress } from '../books/guide/storage'

const JOURNEY_ID_KEY = 'psyche-journey-id'
const JOURNEY_EMAIL_KEY = 'psyche-user-email'
const USER_ID_KEY = 'psyche-user-id'
const ACCESS_TOKEN_KEY = 'psyche-access-token'

const LEGACY_LOCAL_KEYS = [
  'psyche-shore-opening-full-seen',
  'psyche-shore-opening-unrolled',
] as const

export interface JourneySession {
  journeyId: string | null
  email: string | null
  userId: string | null
  accessToken: string | null
}

function readPersisted(key: string): string | null {
  const local = localStorage.getItem(key)
  if (local) return local
  const session = sessionStorage.getItem(key)
  if (session) {
    localStorage.setItem(key, session)
    sessionStorage.removeItem(key)
    return session
  }
  return null
}

export function getJourneySession(): JourneySession {
  return {
    journeyId: readPersisted(JOURNEY_ID_KEY),
    email: readPersisted(JOURNEY_EMAIL_KEY),
    userId: readPersisted(USER_ID_KEY),
    accessToken: readPersisted(ACCESS_TOKEN_KEY),
  }
}

export function setJourneySession(
  journeyId: string,
  email: string,
  userId: string,
  accessToken: string,
) {
  const normalizedEmail = email.trim().toLowerCase()
  localStorage.setItem(JOURNEY_ID_KEY, journeyId)
  localStorage.setItem(JOURNEY_EMAIL_KEY, normalizedEmail)
  localStorage.setItem(USER_ID_KEY, userId)
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  sessionStorage.removeItem(JOURNEY_ID_KEY)
  sessionStorage.removeItem(JOURNEY_EMAIL_KEY)
  sessionStorage.removeItem(USER_ID_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function clearJourneySession() {
  localStorage.removeItem(JOURNEY_ID_KEY)
  localStorage.removeItem(JOURNEY_EMAIL_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(JOURNEY_ID_KEY)
  sessionStorage.removeItem(JOURNEY_EMAIL_KEY)
  sessionStorage.removeItem(USER_ID_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

function clearPsycheSessionStorage() {
  if (typeof window === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith('psyche-')) keys.push(key)
  }
  for (const key of keys) sessionStorage.removeItem(key)
}

function clearLegacyLocalKeys() {
  if (typeof window === 'undefined') return
  for (const key of LEGACY_LOCAL_KEYS) {
    localStorage.removeItem(key)
  }
}

/** Clear all client-side psyche-* session data for this browser profile. */
export function clearLocalUserCache() {
  clearJourneySession()
  clearGuideProgress()
  clearPsycheSessionStorage()
  clearLegacyLocalKeys()
}

/** Clear local session so another user can sign in on this device. */
export function logoutUser() {
  clearLocalUserCache()
}

export interface StoredAssessmentSummary {
  id: string
  bookId: string
  mysticalReadingStatus: string
}

export interface JourneyAssessmentDto {
  id: string
  journeyId: string
  bookId: string
  locale: Locale
  psychologyProfile: string
  dimensions: Array<{
    dimensionIndex: number
    title: string
    averageScore: number
    level: string
    selectedCardIds: string[]
  }>
  answers: Record<string, string[]>
  attentionPassed: boolean
  attentionFailures: string[]
  mysticalReading: string | null
  mysticalReadingZh?: string | null
  mysticalReadingZhTw?: string | null
  mysticalReadingEn?: string | null
  mysticalReadingJa?: string | null
  mysticalReadingSource: string | null
  mysticalReadingSourceZh?: string | null
  mysticalReadingSourceZhTw?: string | null
  mysticalReadingSourceEn?: string | null
  mysticalReadingSourceJa?: string | null
  mysticalReadingStatus: string
  mysticalReadingLocale?: Locale
}

export interface JourneyHolisticDto {
  status: string
  reading: string | null
  readingZh?: string | null
  readingZhTw?: string | null
  readingEn?: string | null
  readingJa?: string | null
  source: string | null
  sourceZh?: string | null
  sourceZhTw?: string | null
  sourceEn?: string | null
  sourceJa?: string | null
  readingLocale?: Locale
}

export interface JourneyDto {
  journeyId: string
  userId: string
  locale: Locale
  status: string
  completedAt: string | null
  assessments: JourneyAssessmentDto[]
  holistic: JourneyHolisticDto
}

export interface CreateJourneyResponse {
  journeyId: string
  userId: string
  email: string
  locale: Locale
  status: string
  accessToken: string
  resumed?: boolean
  assessments: StoredAssessmentSummary[]
}

export function buildAuthHeaders(
  accessToken?: string | null,
): Record<string, string> {
  const token = accessToken ?? getJourneySession().accessToken
  if (!token) {
    throw new Error('缺少访问凭证，请重新输入邮箱登录')
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchJourney(journeyId: string): Promise<JourneyDto> {
  const response = await fetch(`/api/journeys/${journeyId}`, {
    headers: buildAuthHeaders(),
  })
  const data = (await response.json()) as JourneyDto & { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? '读取档案失败')
  }
  return data
}

/** Resume journey via email + stored access token. */
export async function resumeJourneyByEmail(email: string): Promise<JourneyDto> {
  const normalized = email.trim().toLowerCase()
  const { accessToken } = getJourneySession()
  const response = await fetch('/api/journeys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: normalized,
      locale: 'zh',
      accessToken: accessToken ?? undefined,
    }),
  })
  const data = (await response.json()) as CreateJourneyResponse & {
    error?: string
  }
  if (!response.ok) {
    throw new Error(data.error ?? '读取档案失败')
  }
  setJourneySession(data.journeyId, data.email, data.userId, data.accessToken)
  return fetchJourney(data.journeyId)
}

/** Load the user's journey from SQLite via stored credentials. */
export async function restoreJourneyFromStorage(): Promise<JourneyDto | null> {
  const { journeyId, email, accessToken } = getJourneySession()

  if (journeyId && accessToken) {
    try {
      const journey = await fetchJourney(journeyId)
      if (email) {
        setJourneySession(journey.journeyId, email, journey.userId, accessToken)
      }
      return journey
    } catch {
      /* stale credentials — try email resume below */
    }
  }

  if (email && accessToken) {
    try {
      return await resumeJourneyByEmail(email)
    } catch {
      clearJourneySession()
      return null
    }
  }

  clearJourneySession()
  return null
}

export function isStaleJourneyError(message: string): boolean {
  return (
    message.includes('档案不存在') ||
    message.includes('JOURNEY_NOT_FOUND') ||
    message.includes('访问凭证无效') ||
    message.includes('INVALID_ACCESS_TOKEN')
  )
}

export function isAuthError(message: string): boolean {
  return (
    message.includes('缺少访问凭证') ||
    message.includes('访问凭证无效') ||
    message.includes('MISSING_ACCESS_TOKEN') ||
    message.includes('INVALID_ACCESS_TOKEN')
  )
}

export async function createJourney(
  email: string,
  locale: Locale,
): Promise<CreateJourneyResponse> {
  const normalized = email.trim().toLowerCase()
  const { accessToken } = getJourneySession()
  const response = await fetch('/api/journeys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: normalized,
      locale,
      accessToken: accessToken ?? undefined,
    }),
  })

  const data = (await response.json()) as CreateJourneyResponse & { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? '创建档案失败')
  }

  setJourneySession(data.journeyId, data.email, data.userId, data.accessToken)
  return data
}

export function findAssessmentForBook(
  journey: JourneyDto,
  bookId: string,
): JourneyAssessmentDto | undefined {
  return journey.assessments.find((a) => a.bookId === bookId)
}

const POLL_MS = 1200
const MAX_POLLS = 90

export async function fetchHolisticReading(
  journeyId: string,
  locale: Locale,
): Promise<{
  reading: string
  source?: string
  readingZh?: string | null
  readingZhTw?: string | null
  readingEn?: string | null
  readingJa?: string | null
}> {
  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    const response = await fetch(`/api/journeys/${journeyId}/holistic-reading`, {
      method: 'POST',
      headers: buildAuthHeaders(),
      body: JSON.stringify({ locale }),
    })

    const data = (await response.json()) as {
      reading?: string
      readingZh?: string | null
      readingZhTw?: string | null
      readingEn?: string | null
      readingJa?: string | null
      status?: string
      source?: string
      error?: string
    }

    if (response.status === 202 || data.status === 'processing') {
      await new Promise((r) => window.setTimeout(r, POLL_MS))
      continue
    }

    if (!response.ok) {
      throw new Error(data.error ?? '整象神谕生成失败')
    }

    if (data.reading) {
      return {
        reading: data.reading,
        source: data.source,
        readingZh: data.readingZh,
        readingZhTw: data.readingZhTw,
        readingEn: data.readingEn,
        readingJa: data.readingJa,
      }
    }
  }

  throw new Error('整象神谕生成超时')
}

export async function saveHolisticFallbackReading(
  journeyId: string,
  reading: string,
  locale: Locale,
): Promise<void> {
  await fetch(`/api/journeys/${journeyId}/holistic-reading/fallback`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ reading, locale }),
  })
}
