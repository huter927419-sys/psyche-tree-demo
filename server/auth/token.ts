import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

const TOKEN_PREFIX = 'psk_'

export function generateAccessToken(): string {
  return `${TOKEN_PREFIX}${randomBytes(32).toString('base64url')}`
}

export function hashAccessToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function isAccessTokenFormat(token: string): boolean {
  return token.startsWith(TOKEN_PREFIX) && token.length >= TOKEN_PREFIX.length + 16
}

export function verifyAccessTokenHash(
  token: string,
  storedHash: string | null | undefined,
): boolean {
  if (!storedHash || !isAccessTokenFormat(token)) return false
  const computed = hashAccessToken(token)
  try {
    return timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(storedHash, 'hex'),
    )
  } catch {
    return false
  }
}
