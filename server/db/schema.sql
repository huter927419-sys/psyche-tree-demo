-- Psyche Tree — SQLite schema (v7: zh / zhTw / en / ja)
-- One user (email) → one journey (六卷整体) → up to six book_assessments

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journeys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'zh' CHECK (locale IN ('zh', 'zhTw', 'en', 'ja')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  holistic_prompt_input TEXT,
  holistic_reading TEXT,
  holistic_reading_source TEXT CHECK (
    holistic_reading_source IS NULL OR holistic_reading_source IN ('deepseek', 'fallback')
  ),
  holistic_reading_model TEXT,
  holistic_reading_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    holistic_reading_status IN ('pending', 'processing', 'completed', 'failed')
  ),
  holistic_reading_error TEXT,
  holistic_reading_locale TEXT CHECK (
    holistic_reading_locale IS NULL OR holistic_reading_locale IN ('zh', 'zhTw', 'en', 'ja')
  ),
  holistic_reading_zh TEXT,
  holistic_reading_en TEXT,
  holistic_reading_ja TEXT,
  holistic_reading_zh_tw TEXT,
  holistic_reading_source_zh TEXT CHECK (
    holistic_reading_source_zh IS NULL OR holistic_reading_source_zh IN ('deepseek', 'fallback')
  ),
  holistic_reading_source_en TEXT CHECK (
    holistic_reading_source_en IS NULL OR holistic_reading_source_en IN ('deepseek', 'fallback')
  ),
  holistic_reading_source_ja TEXT CHECK (
    holistic_reading_source_ja IS NULL OR holistic_reading_source_ja IN ('deepseek', 'fallback')
  ),
  holistic_reading_source_zh_tw TEXT CHECK (
    holistic_reading_source_zh_tw IS NULL OR holistic_reading_source_zh_tw IN ('deepseek', 'fallback')
  ),
  holistic_prompt_input_zh TEXT,
  holistic_prompt_input_en TEXT,
  holistic_prompt_input_ja TEXT,
  holistic_prompt_input_zh_tw TEXT
);

CREATE INDEX IF NOT EXISTS idx_journeys_user ON journeys(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_journeys_user_unique ON journeys(user_id);

CREATE TABLE IF NOT EXISTS book_assessments (
  id TEXT PRIMARY KEY,
  journey_id TEXT NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('zh', 'zhTw', 'en', 'ja')),
  psychology_profile TEXT NOT NULL,
  psychology_prompt_input TEXT NOT NULL,
  dimensions_json TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  attention_passed INTEGER NOT NULL DEFAULT 1,
  attention_failures_json TEXT NOT NULL DEFAULT '[]',
  mystical_reading TEXT,
  mystical_reading_source TEXT CHECK (
    mystical_reading_source IS NULL OR mystical_reading_source IN ('deepseek', 'fallback')
  ),
  mystical_reading_model TEXT,
  mystical_reading_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    mystical_reading_status IN ('pending', 'processing', 'completed', 'failed')
  ),
  mystical_reading_error TEXT,
  mystical_reading_locale TEXT CHECK (
    mystical_reading_locale IS NULL OR mystical_reading_locale IN ('zh', 'zhTw', 'en', 'ja')
  ),
  mystical_reading_zh TEXT,
  mystical_reading_en TEXT,
  mystical_reading_ja TEXT,
  mystical_reading_zh_tw TEXT,
  mystical_reading_source_zh TEXT CHECK (
    mystical_reading_source_zh IS NULL OR mystical_reading_source_zh IN ('deepseek', 'fallback')
  ),
  mystical_reading_source_en TEXT CHECK (
    mystical_reading_source_en IS NULL OR mystical_reading_source_en IN ('deepseek', 'fallback')
  ),
  mystical_reading_source_ja TEXT CHECK (
    mystical_reading_source_ja IS NULL OR mystical_reading_source_ja IN ('deepseek', 'fallback')
  ),
  mystical_reading_source_zh_tw TEXT CHECK (
    mystical_reading_source_zh_tw IS NULL OR mystical_reading_source_zh_tw IN ('deepseek', 'fallback')
  ),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (journey_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_assessments_journey ON book_assessments(journey_id);
CREATE INDEX IF NOT EXISTS idx_assessments_reading_status ON book_assessments(mystical_reading_status);
