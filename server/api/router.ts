import type { IncomingMessage, ServerResponse } from 'node:http'
import { getDb } from '../db/client.js'
import {
  assertAssessmentBelongsToJourney,
  findAssessmentById,
  getMysticalReadingForLocale,
  saveBookAssessment,
  saveFallbackReading,
} from '../db/repositories/assessments.js'
import {
  createJourney,
  findJourneyById,
  getHolisticReadingForLocale,
  getJourneyWithAssessments,
} from '../db/repositories/journeys.js'
import { isValidEmail } from '../db/repositories/users.js'
import type { Locale, SaveAssessmentInput, StoredDimensionResult } from '../db/types.js'
import { callDeepSeekMysticalReading } from '../deepseek.js'
import {
  resolveMysticalReading,
  toAssessmentDto,
} from '../services/mysticalReadingService.js'
import {
  resolveHolisticReading,
  toHolisticDto,
} from '../services/holisticReadingService.js'
import {
  errorMessage,
  parseRequestUrl,
  readJson,
  sendJson,
  statusForError,
} from './http.js'
import { saveHolisticFallback } from '../db/repositories/journeys.js'
import { isReadingTestFallbackEnabled } from '../readingTestFallback.js'
import { resolveJourneyFromRequest } from './auth.js'

interface ApiContext {
  apiKey: string
  model: string
  testReadingFallback?: boolean
}

function readingOptions(
  req: IncomingMessage,
  ctx: ApiContext,
) {
  return {
    testFallback: isReadingTestFallbackEnabled(req, ctx.testReadingFallback),
  }
}

export function createApiMiddleware(ctx: ApiContext) {
  getDb()

  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    const parsed = parseRequestUrl(req)
    if (!parsed?.pathname.startsWith('/api/')) {
      next()
      return
    }

    try {
      await route(req, res, parsed, ctx)
    } catch (error) {
      const code =
        error instanceof Error ? error.message : 'INTERNAL_ERROR'
      sendJson(res, statusForError(code), { error: errorMessage(code) })
    }
  }
}

async function route(
  req: IncomingMessage,
  res: ServerResponse,
  parsed: NonNullable<ReturnType<typeof parseRequestUrl>>,
  ctx: ApiContext,
) {
  const { pathname } = parsed

  if (pathname === '/api/journeys' && req.method === 'GET') {
    sendJson(res, 410, {
      error: '请使用 POST /api/journeys 并在请求头携带 Authorization: Bearer <accessToken> 访问档案',
    })
    return
  }

  if (pathname === '/api/journeys' && req.method === 'POST') {
    return handleCreateJourney(req, res)
  }

  const journeyMatch = pathname.match(/^\/api\/journeys\/([^/]+)$/)
  if (journeyMatch && req.method === 'GET') {
    return handleGetJourney(req, res, journeyMatch[1]!)
  }

  const holisticMatch = pathname.match(
    /^\/api\/journeys\/([^/]+)\/holistic-reading$/,
  )
  if (holisticMatch && req.method === 'POST') {
    return handleHolisticReading(req, res, holisticMatch[1]!, ctx)
  }

  const holisticFallbackMatch = pathname.match(
    /^\/api\/journeys\/([^/]+)\/holistic-reading\/fallback$/,
  )
  if (holisticFallbackMatch && req.method === 'POST') {
    return handleHolisticFallback(req, res, holisticFallbackMatch[1]!)
  }

  const assessmentCreateMatch = pathname.match(
    /^\/api\/journeys\/([^/]+)\/assessments$/,
  )
  if (assessmentCreateMatch && req.method === 'POST') {
    return handleSaveAssessment(req, res, assessmentCreateMatch[1]!, ctx)
  }

  const assessmentMatch = pathname.match(/^\/api\/assessments\/([^/]+)$/)
  if (assessmentMatch && req.method === 'GET') {
    return handleGetAssessment(req, res, assessmentMatch[1]!)
  }

  const readingMatch = pathname.match(
    /^\/api\/assessments\/([^/]+)\/mystical-reading$/,
  )
  if (readingMatch && req.method === 'POST') {
    return handleMysticalReading(req, res, readingMatch[1]!, ctx)
  }

  const fallbackMatch = pathname.match(
    /^\/api\/assessments\/([^/]+)\/mystical-reading\/fallback$/,
  )
  if (fallbackMatch && req.method === 'POST') {
    return handleFallbackReading(req, res, fallbackMatch[1]!)
  }

  // Legacy endpoint — disabled unless explicitly enabled (no journey auth)
  if (pathname === '/api/mystical-reading' && req.method === 'POST') {
    if (process.env.PSYCHE_ALLOW_LEGACY_MYSTICAL !== '1') {
      sendJson(res, 410, { error: errorMessage('LEGACY_ENDPOINT_DISABLED') })
      return
    }
    return handleLegacyMysticalReading(req, res, ctx)
  }

  sendJson(res, 404, { error: 'Not found' })
}

function parseRequestedLocale(
  value: unknown,
  fallback: Locale,
): Locale {
  if (value === 'en') return 'en'
  if (value === 'ja') return 'ja'
  if (value === 'zhTw') return 'zhTw'
  if (value === 'zh') return 'zh'
  return fallback
}

async function handleCreateJourney(req: IncomingMessage, res: ServerResponse) {
  const body = await readJson<{ email?: string; locale?: Locale; accessToken?: string }>(req)
  if (!body.email || !isValidEmail(body.email)) {
    sendJson(res, 400, { error: errorMessage('INVALID_EMAIL') })
    return
  }

  const locale: Locale =
    body.locale === 'en'
      ? 'en'
      : body.locale === 'ja'
        ? 'ja'
        : body.locale === 'zhTw'
          ? 'zhTw'
          : 'zh'

  let created
  try {
    created = createJourney(body.email, locale, {
      accessToken: body.accessToken,
    })
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    if (code === 'INVALID_ACCESS_TOKEN') {
      sendJson(res, 401, { error: errorMessage('INVALID_ACCESS_TOKEN') })
      return
    }
    throw error
  }

  const user = getJourneyWithAssessments(created.journey.id)

  sendJson(res, 201, {
    journeyId: created.journey.id,
    userId: created.journey.user_id,
    locale: created.journey.locale,
    status: created.journey.status,
    email: body.email.trim().toLowerCase(),
    accessToken: created.accessToken,
    resumed: created.resumed,
    assessments: user?.assessments.map(toAssessmentDto) ?? [],
  })
}

function handleGetJourney(
  req: IncomingMessage,
  res: ServerResponse,
  journeyId: string,
) {
  try {
    resolveJourneyFromRequest(req, journeyId)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const data = getJourneyWithAssessments(journeyId)
  if (!data) {
    console.warn('[psyche-api] JOURNEY_NOT_FOUND GET /api/journeys/%s', journeyId)
    sendJson(res, 404, { error: errorMessage('JOURNEY_NOT_FOUND') })
    return
  }

  sendJourneyPayload(res, 200, data)
}

function sendJourneyPayload(
  res: ServerResponse,
  status: number,
  data: NonNullable<ReturnType<typeof getJourneyWithAssessments>>,
) {
  sendJson(res, status, {
    journeyId: data.journey.id,
    userId: data.journey.user_id,
    locale: data.journey.locale,
    status: data.journey.status,
    completedAt: data.journey.completed_at,
    assessments: data.assessments.map(toAssessmentDto),
    holistic: toHolisticDto(data.journey),
  })
}

async function handleSaveAssessment(
  req: IncomingMessage,
  res: ServerResponse,
  journeyId: string,
  ctx: ApiContext,
) {
  try {
    resolveJourneyFromRequest(req, journeyId)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const data = getJourneyWithAssessments(journeyId)
  if (!data) {
    console.warn(
      '[psyche-api] JOURNEY_NOT_FOUND POST /api/journeys/%s/assessments',
      journeyId,
    )
    sendJson(res, 404, { error: errorMessage('JOURNEY_NOT_FOUND') })
    return
  }

  const body = await readJson<{
    bookId?: string
    locale?: Locale
    psychologyProfile?: string
    psychologyPromptInput?: string
    dimensions?: StoredDimensionResult[]
    answers?: Record<string, string[]>
    attentionPassed?: boolean
    attentionFailures?: string[]
  }>(req)

  if (
    !body.bookId ||
    !body.psychologyProfile ||
    !body.psychologyPromptInput ||
    !body.dimensions ||
    !body.answers
  ) {
    sendJson(res, 400, { error: '缺少必要字段' })
    return
  }

  const input: SaveAssessmentInput = {
    journeyId,
    bookId: body.bookId,
    locale: parseRequestedLocale(body.locale, data.journey.locale),
    psychologyProfile: body.psychologyProfile,
    psychologyPromptInput: body.psychologyPromptInput,
    dimensions: body.dimensions,
    answers: body.answers,
    attentionPassed: body.attentionPassed ?? true,
    attentionFailures: body.attentionFailures ?? [],
  }

  const row = saveBookAssessment(input)
  const journeyData = getJourneyWithAssessments(journeyId)!

  if (
    journeyData.journey.status === 'completed' &&
    journeyData.journey.holistic_reading_status !== 'processing' &&
    journeyData.journey.holistic_reading_status !== 'completed'
  ) {
    const locale = parseRequestedLocale(body.locale, journeyData.journey.locale)
    void resolveHolisticReading(
      journeyId,
      ctx.apiKey,
      ctx.model,
      locale,
      readingOptions(req, ctx),
    ).catch((error) => {
      console.warn(
        '[psyche-api] auto holistic reading failed journey=%s',
        journeyId,
        error,
      )
    })
  }

  sendJson(res, 201, {
    assessment: toAssessmentDto(row),
    journeyStatus: journeyData.journey.status,
    assessmentsCompleted: journeyData.assessments.length,
    holistic: toHolisticDto(journeyData.journey),
  })
}

function handleGetAssessment(
  req: IncomingMessage,
  res: ServerResponse,
  assessmentId: string,
) {
  let journey
  try {
    journey = resolveJourneyFromRequest(req)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const row = assertAssessmentBelongsToJourney(assessmentId, journey.id)
  sendJson(res, 200, { assessment: toAssessmentDto(row) })
}

async function handleMysticalReading(
  req: IncomingMessage,
  res: ServerResponse,
  assessmentId: string,
  ctx: ApiContext,
) {
  let journey
  try {
    journey = resolveJourneyFromRequest(req)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const row = assertAssessmentBelongsToJourney(assessmentId, journey.id)
  const body = await readJson<{ locale?: Locale }>(req).catch(() => ({ locale: undefined }))
  const requestedLocale = parseRequestedLocale(body.locale, row.locale)

  const result = await resolveMysticalReading(
    assessmentId,
    ctx.apiKey,
    ctx.model,
    requestedLocale,
    readingOptions(req, ctx),
  )

  if (result.status === 'processing') {
    sendJson(res, 202, {
      status: 'processing',
      reading: result.reading || null,
    })
    return
  }

  const updatedRow = findAssessmentById(assessmentId)!
  sendJson(res, 200, {
    reading: result.reading,
    readingZh: getMysticalReadingForLocale(updatedRow, 'zh'),
    readingZhTw: getMysticalReadingForLocale(updatedRow, 'zhTw'),
    readingEn: getMysticalReadingForLocale(updatedRow, 'en'),
    readingJa: getMysticalReadingForLocale(updatedRow, 'ja'),
    source: result.source,
    model: result.model ?? null,
    status: 'completed',
    locale: result.locale ?? requestedLocale,
  })
}

async function handleFallbackReading(
  req: IncomingMessage,
  res: ServerResponse,
  assessmentId: string,
) {
  let journey
  try {
    journey = resolveJourneyFromRequest(req)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const row = assertAssessmentBelongsToJourney(assessmentId, journey.id)
  const body = await readJson<{ reading?: string; locale?: Locale }>(req)
  if (!body.reading?.trim()) {
    sendJson(res, 400, { error: '缺少 reading' })
    return
  }

  const locale = parseRequestedLocale(body.locale, row.locale)
  saveFallbackReading(assessmentId, body.reading.trim(), locale)
  sendJson(res, 200, { status: 'completed', source: 'fallback' })
}

async function handleHolisticReading(
  req: IncomingMessage,
  res: ServerResponse,
  journeyId: string,
  ctx: ApiContext,
) {
  try {
    resolveJourneyFromRequest(req, journeyId)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const journey = findJourneyById(journeyId)
  if (!journey) {
    sendJson(res, 404, { error: errorMessage('JOURNEY_NOT_FOUND') })
    return
  }

  const body = await readJson<{ locale?: Locale }>(req).catch(() => ({ locale: undefined }))
  const requestedLocale = parseRequestedLocale(body.locale, journey.locale)

  const result = await resolveHolisticReading(
    journeyId,
    ctx.apiKey,
    ctx.model,
    requestedLocale,
    readingOptions(req, ctx),
  )

  if (result.status === 'processing') {
    sendJson(res, 202, {
      status: 'processing',
      reading: result.reading || null,
    })
    return
  }

  const journeyRow = findJourneyById(journeyId)!
  sendJson(res, 200, {
    reading: result.reading,
    readingZh: getHolisticReadingForLocale(journeyRow, 'zh'),
    readingZhTw: getHolisticReadingForLocale(journeyRow, 'zhTw'),
    readingEn: getHolisticReadingForLocale(journeyRow, 'en'),
    readingJa: getHolisticReadingForLocale(journeyRow, 'ja'),
    source: result.source,
    model: result.model ?? null,
    status: 'completed',
    locale: result.locale ?? requestedLocale,
  })
}

async function handleHolisticFallback(
  req: IncomingMessage,
  res: ServerResponse,
  journeyId: string,
) {
  try {
    resolveJourneyFromRequest(req, journeyId)
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR'
    sendJson(res, statusForError(code), { error: errorMessage(code) })
    return
  }

  const body = await readJson<{ reading?: string; locale?: Locale }>(req)
  if (!body.reading?.trim()) {
    sendJson(res, 400, { error: '缺少 reading' })
    return
  }

  const journey = findJourneyById(journeyId)
  const locale = parseRequestedLocale(body.locale, journey?.locale ?? 'zh')
  saveHolisticFallback(journeyId, body.reading.trim(), locale)
  sendJson(res, 200, { status: 'completed', source: 'fallback' })
}

async function handleLegacyMysticalReading(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: ApiContext,
) {
  if (!ctx.apiKey) {
    sendJson(res, 500, { error: errorMessage('MISSING_API_KEY') })
    return
  }

  const body = await readJson<{
    psychologyInput?: string
    bookId?: string
    locale?: Locale
  }>(req)

  if (!body.psychologyInput?.trim()) {
    sendJson(res, 400, { error: '缺少 psychologyInput' })
    return
  }

  const reading = await callDeepSeekMysticalReading(
    body.psychologyInput,
    ctx.apiKey,
    ctx.model,
    body.bookId ?? 'psyche-tree',
    body.locale ?? 'zh',
  )

  sendJson(res, 200, { reading, model: ctx.model })
}
