import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

let db: Database.Database | null = null

function resolveDbPath(): string {
  const fromEnv = process.env.SQLITE_PATH?.trim()
  if (fromEnv) return path.resolve(fromEnv)
  return path.resolve(process.cwd(), 'data', 'psyche-tree.sqlite')
}

function migrationVersion(database: Database.Database): number {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  const row = database
    .prepare('SELECT MAX(version) AS version FROM schema_migrations')
    .get() as { version: number | null }
  return row.version ?? 0
}

function applyMigration(database: Database.Database, version: number, sqlFile: string) {
  const sqlPath = path.join(import.meta.dirname, 'migrations', sqlFile)
  database.exec(fs.readFileSync(sqlPath, 'utf8'))
  database.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version)
}

function runMigrations(database: Database.Database) {
  let version = migrationVersion(database)

  if (version < 1) {
    const schemaPath = path.join(import.meta.dirname, 'schema.sql')
    database.exec(fs.readFileSync(schemaPath, 'utf8'))
    // Fresh DBs use consolidated schema.sql (v6 incl. ja); skip incremental migrations.
    database.prepare('INSERT INTO schema_migrations (version) VALUES (6)').run()
    version = 6
  }

  if (version < 2) {
    applyMigration(database, 2, '002_holistic_reading.sql')
  }

  if (version < 3) {
    applyMigration(database, 3, '003_reading_locale.sql')
  }

  if (version < 4) {
    applyMigration(database, 4, '004_journey_per_user.sql')
  }

  if (version < 5) {
    applyMigration(database, 5, '005_bilingual_readings.sql')
  }

  if (version < 6) {
    applyMigration(database, 6, '006_locale_ja.sql')
  }
}

export function getDb(): Database.Database {
  if (db) return db

  const dbPath = resolveDbPath()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  return db
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
