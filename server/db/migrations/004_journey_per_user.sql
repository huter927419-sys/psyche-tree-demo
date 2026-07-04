-- Keep only the latest journey per user, then enforce one journey per user.
DELETE FROM book_assessments
WHERE journey_id IN (
  SELECT j.id
  FROM journeys j
  WHERE j.id NOT IN (
    SELECT j2.id
    FROM journeys j2
    INNER JOIN (
      SELECT user_id, MAX(created_at) AS latest
      FROM journeys
      GROUP BY user_id
    ) latest ON latest.user_id = j2.user_id AND latest.latest = j2.created_at
  )
);

DELETE FROM journeys
WHERE id NOT IN (
  SELECT j2.id
  FROM journeys j2
  INNER JOIN (
    SELECT user_id, MAX(created_at) AS latest
    FROM journeys
    GROUP BY user_id
  ) latest ON latest.user_id = j2.user_id AND latest.latest = j2.created_at
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_journeys_user_unique ON journeys(user_id);
