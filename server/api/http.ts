import type { IncomingMessage, ServerResponse } from 'node:http'

export function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function getHeader(req: IncomingMessage, name: string): string | undefined {
  const raw = req.headers[name.toLowerCase()]
  if (Array.isArray(raw)) return raw[0]
  return raw
}

export interface ParsedRequest {
  pathname: string
  searchParams: URLSearchParams
}

export function parseRequestUrl(req: IncomingMessage): ParsedRequest | null {
  if (!req.url) return null
  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url, `http://${host}`)
  return { pathname: url.pathname, searchParams: url.searchParams }
}

export async function readJson<T>(req: IncomingMessage): Promise<T> {
  const raw = await readBody(req)
  return JSON.parse(raw) as T
}

export function errorMessage(code: string): string {
  const map: Record<string, string> = {
    INVALID_EMAIL: '邮箱格式不正确',
    JOURNEY_NOT_FOUND: '档案不存在',
    JOURNEY_INCOMPLETE: '六卷尚未齐，整象神谕将在六卷归一后显现',
    BOOK_ALREADY_COMPLETED: '此卷已照见，不可重复答题',
    ASSESSMENT_NOT_FOUND: '解读记录不存在',
    MISSING_JOURNEY_HEADER: '缺少 X-Journey-Id',
    READING_LOCK_FAILED: '神谕生成未能启动，请稍后重试',
  }
  return map[code] ?? code
}

export function statusForError(code: string): number {
  if (code === 'INVALID_EMAIL') return 400
  if (code === 'JOURNEY_NOT_FOUND' || code === 'ASSESSMENT_NOT_FOUND') {
    return 404
  }
  if (code === 'JOURNEY_INCOMPLETE' || code === 'BOOK_ALREADY_COMPLETED') {
    return 409
  }
  if (code === 'MISSING_JOURNEY_HEADER') return 401
  return 500
}
