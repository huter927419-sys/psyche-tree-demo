/**
 * Shared HTTP helpers for QA scripts (Bearer access token auth).
 */
const USE_TEST_READING_FALLBACK = process.env.PSYCHE_READING_TEST_FALLBACK !== '0'

export function bearerHeaders(accessToken) {
  if (!accessToken) return {}
  return { Authorization: `Bearer ${accessToken}` }
}

export function createApiClient(baseUrl = process.env.BASE_URL ?? 'http://localhost:5173') {
  /** @type {Map<string, string>} */
  const tokens = new Map()
  /** @type {Map<string, string>} email → latest accessToken */
  const emailTokens = new Map()

  async function req(
    method,
    path,
    { body, journeyId, accessToken, testFallback = USE_TEST_READING_FALLBACK, headers: extra = {} } = {},
  ) {
    const headers = { 'Content-Type': 'application/json', ...extra }
    const token = accessToken ?? (journeyId ? tokens.get(journeyId) : undefined)
    if (token) headers.Authorization = `Bearer ${token}`
    if (testFallback) headers['X-Psyche-Reading-Test-Fallback'] = '1'

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const text = await res.text()
    let data
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }
    return { status: res.status, data }
  }

  async function createJourney(email, locale, priorAccessToken) {
    const body = { email, locale }
    const prior = priorAccessToken ?? emailTokens.get(email)
    if (prior) body.accessToken = prior
    const r = await req('POST', '/api/journeys', { body })
    if (r.status !== 201) {
      throw new Error(`create journey: ${r.status} ${JSON.stringify(r.data)}`)
    }
    emailTokens.set(email, r.data.accessToken)
    tokens.set(r.data.journeyId, r.data.accessToken)
    return r.data
  }

  async function resumeJourney(email, locale = 'zh') {
    return createJourney(email, locale)
  }

  function setToken(journeyId, accessToken) {
    tokens.set(journeyId, accessToken)
  }

  function getToken(journeyId) {
    return tokens.get(journeyId)
  }

  return { req, createJourney, resumeJourney, tokens, emailTokens, setToken, getToken, baseUrl }
}
