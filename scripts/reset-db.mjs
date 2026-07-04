#!/usr/bin/env node
/**
 * Wipe all user/journey/assessment data from psyche-tree.sqlite.
 * Schema + migrations are preserved.
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const DB =
  process.env.SQLITE_PATH ??
  path.resolve(process.cwd(), 'data', 'psyche-tree.sqlite')

if (!fs.existsSync(DB)) {
  console.log('No database file at', DB)
  process.exit(0)
}

execSync(
  `sqlite3 "${DB}" "DELETE FROM book_assessments; DELETE FROM journeys; DELETE FROM users;"`,
  { stdio: 'inherit' },
)

const counts = execSync(
  `sqlite3 "${DB}" "SELECT (SELECT COUNT(*) FROM users), (SELECT COUNT(*) FROM journeys), (SELECT COUNT(*) FROM book_assessments);"`,
  { encoding: 'utf8' },
).trim()

console.log('✓ Database cleared (users|journeys|assessments):', counts)
