-- Store mystical/holistic readings in both zh and en so UI locale switches never regenerate.

ALTER TABLE book_assessments ADD COLUMN mystical_reading_zh TEXT;
ALTER TABLE book_assessments ADD COLUMN mystical_reading_en TEXT;
ALTER TABLE book_assessments ADD COLUMN mystical_reading_source_zh TEXT CHECK (
  mystical_reading_source_zh IS NULL OR mystical_reading_source_zh IN ('deepseek', 'fallback')
);
ALTER TABLE book_assessments ADD COLUMN mystical_reading_source_en TEXT CHECK (
  mystical_reading_source_en IS NULL OR mystical_reading_source_en IN ('deepseek', 'fallback')
);

UPDATE book_assessments
SET
  mystical_reading_zh = CASE
    WHEN COALESCE(mystical_reading_locale, locale) = 'en' THEN mystical_reading_zh
    ELSE mystical_reading
  END,
  mystical_reading_en = CASE
    WHEN COALESCE(mystical_reading_locale, locale) = 'en' THEN mystical_reading
    ELSE mystical_reading_en
  END,
  mystical_reading_source_zh = CASE
    WHEN COALESCE(mystical_reading_locale, locale) = 'en' THEN mystical_reading_source_zh
    ELSE mystical_reading_source
  END,
  mystical_reading_source_en = CASE
    WHEN COALESCE(mystical_reading_locale, locale) = 'en' THEN mystical_reading_source
    ELSE mystical_reading_source_en
  END
WHERE mystical_reading IS NOT NULL;

ALTER TABLE journeys ADD COLUMN holistic_reading_zh TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading_en TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading_source_zh TEXT CHECK (
  holistic_reading_source_zh IS NULL OR holistic_reading_source_zh IN ('deepseek', 'fallback')
);
ALTER TABLE journeys ADD COLUMN holistic_reading_source_en TEXT CHECK (
  holistic_reading_source_en IS NULL OR holistic_reading_source_en IN ('deepseek', 'fallback')
);
ALTER TABLE journeys ADD COLUMN holistic_prompt_input_zh TEXT;
ALTER TABLE journeys ADD COLUMN holistic_prompt_input_en TEXT;

UPDATE journeys
SET
  holistic_reading_zh = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_reading_zh
    ELSE holistic_reading
  END,
  holistic_reading_en = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_reading
    ELSE holistic_reading_en
  END,
  holistic_reading_source_zh = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_reading_source_zh
    ELSE holistic_reading_source
  END,
  holistic_reading_source_en = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_reading_source
    ELSE holistic_reading_source_en
  END,
  holistic_prompt_input_zh = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_prompt_input_zh
    ELSE holistic_prompt_input
  END,
  holistic_prompt_input_en = CASE
    WHEN COALESCE(holistic_reading_locale, locale) = 'en' THEN holistic_prompt_input
    ELSE holistic_prompt_input_en
  END
WHERE holistic_reading IS NOT NULL;
