ALTER TABLE journeys ADD COLUMN holistic_prompt_input TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading_source TEXT CHECK (
  holistic_reading_source IS NULL OR holistic_reading_source IN ('deepseek', 'fallback')
);
ALTER TABLE journeys ADD COLUMN holistic_reading_model TEXT;
ALTER TABLE journeys ADD COLUMN holistic_reading_status TEXT NOT NULL DEFAULT 'pending' CHECK (
  holistic_reading_status IN ('pending', 'processing', 'completed', 'failed')
);
ALTER TABLE journeys ADD COLUMN holistic_reading_error TEXT;
