ALTER TABLE journeys ADD COLUMN access_token_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_journeys_access_token_hash ON journeys(access_token_hash);
