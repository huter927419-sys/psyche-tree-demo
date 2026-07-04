import { randomUUID } from 'node:crypto'
import { getDb } from '../client.js'
import type { UserRow } from '../types.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(normalizeEmail(email))
}

export function findUserByEmail(email: string): UserRow | undefined {
  const db = getDb()
  return db
    .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE')
    .get(normalizeEmail(email)) as UserRow | undefined
}

export function upsertUserByEmail(email: string): UserRow {
  const normalized = normalizeEmail(email)
  if (!isValidEmail(normalized)) {
    throw new Error('INVALID_EMAIL')
  }

  const db = getDb()
  const existing = findUserByEmail(normalized)
  if (existing) {
    db.prepare(
      `UPDATE users SET updated_at = datetime('now') WHERE id = ?`,
    ).run(existing.id)
    return existing
  }

  const id = randomUUID()
  db.prepare(
    `INSERT INTO users (id, email) VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET updated_at = datetime('now')`,
  ).run(id, normalized)

  return findUserByEmail(normalized)!
}

export function findUserById(id: string): UserRow | undefined {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as
    | UserRow
    | undefined
}
