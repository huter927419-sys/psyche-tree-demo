-- Traditional Chinese (zhTw) locale + quadrilingual oracle readings

ALTER TABLE book_assessments ADD COLUMN mystical_reading_zh_tw TEXT;
ALTER TABLE book_assessments ADD COLUMN mystical_reading_source_zh_tw TEXT CHECK (
  mystical_reading_source_zh_tw IS NULL OR mystical_reading_source_zh_tw IN ('deepseek', 'fallback')
);

ALTER TABLE journeys ADD COLUMN holistic_reading_zh_tw TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading_source_zh_tw TEXT CHECK (
  holistic_reading_source_zh_tw IS NULL OR holistic_reading_source_zh_tw IN ('deepseek', 'fallback')
);
ALTER TABLE journeys ADD COLUMN holistic_prompt_input_zh_tw TEXT;

PRAGMA foreign_keys = OFF;

CREATE TABLE book_assessments_new (
  id TEXT PRIMARY KEY,
  journey_id TEXT NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('zh', 'en', 'ja', 'zhTw')),
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
    mystical_reading_locale IS NULL OR mystical_reading_locale IN ('zh', 'en', 'ja', 'zhTw')
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

INSERT INTO book_assessments_new SELECT
  id, journey_id, book_id, locale, psychology_profile, psychology_prompt_input,
  dimensions_json, answers_json, attention_passed, attention_failures_json,
  mystical_reading, mystical_reading_source, mystical_reading_model,
  mystical_reading_status, mystical_reading_error, mystical_reading_locale,
  mystical_reading_zh, mystical_reading_en, mystical_reading_ja, NULL,
  mystical_reading_source_zh, mystical_reading_source_en, mystical_reading_source_ja, NULL,
  created_at, updated_at
FROM book_assessments;

DROP TABLE book_assessments;
ALTER TABLE book_assessments_new RENAME TO book_assessments;
CREATE INDEX IF NOT EXISTS idx_assessments_journey ON book_assessments(journey_id);
CREATE INDEX IF NOT EXISTS idx_assessments_reading_status ON book_assessments(mystical_reading_status);

CREATE TABLE journeys_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'zh' CHECK (locale IN ('zh', 'en', 'ja', 'zhTw')),
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
    holistic_reading_locale IS NULL OR holistic_reading_locale IN ('zh', 'en', 'ja', 'zhTw')
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

INSERT INTO journeys_new SELECT
  id, user_id, locale, status, created_at, updated_at, completed_at,
  holistic_prompt_input, holistic_reading, holistic_reading_source,
  holistic_reading_model, holistic_reading_status, holistic_reading_error,
  holistic_reading_locale, holistic_reading_zh, holistic_reading_en,
  holistic_reading_ja, NULL, holistic_reading_source_zh, holistic_reading_source_en,
  holistic_reading_source_ja, NULL, holistic_prompt_input_zh, holistic_prompt_input_en,
  holistic_prompt_input_ja, NULL
FROM journeys;

DROP TABLE journeys;
ALTER TABLE journeys_new RENAME TO journeys;
CREATE INDEX IF NOT EXISTS idx_journeys_user ON journeys(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_journeys_user_unique ON journeys(user_id);

PRAGMA foreign_keys = ON;
