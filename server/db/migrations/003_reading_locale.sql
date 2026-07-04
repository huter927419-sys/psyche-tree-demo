ALTER TABLE journeys ADD COLUMN holistic_reading_locale TEXT CHECK (
  holistic_reading_locale IS NULL OR holistic_reading_locale IN ('zh', 'en')
);
ALTER TABLE book_assessments ADD COLUMN mystical_reading_locale TEXT CHECK (
  mystical_reading_locale IS NULL OR mystical_reading_locale IN ('zh', 'en')
);
