-- 0003: fix review-nit flags from compliance / UX / outbox pass
-- Apply after 0002_review_nits.sql

-- 1. alert_thresholds lives on compliance_timers, not students.
--    0002 #6 targeted students and used a WHERE that never matches 0001 defaults.
ALTER TABLE compliance_timers
  ALTER COLUMN alert_thresholds SET DEFAULT '{30,7}';

UPDATE compliance_timers
SET alert_thresholds = '{30,7}'
WHERE alert_thresholds = '{30,14,7,3,1}';

COMMENT ON COLUMN compliance_timers.alert_thresholds IS
  'Push beats in days. Default {30,7} (amber / red). Morning digest can still summarize.';

-- If 0002 added students.alert_thresholds, drop that second source of truth.
ALTER TABLE students DROP COLUMN IF EXISTS alert_thresholds;

-- 2. Drop the old unique index so it does not collide with timer_id uniqueness.
DROP INDEX IF EXISTS alert_events_idempotent_idx;

-- 3. NULL timer_id is distinct in Postgres UNIQUE — split the constraint.
ALTER TABLE alert_events
  DROP CONSTRAINT IF EXISTS alert_events_student_id_kind_local_date_timer_id_key;
ALTER TABLE alert_events
  DROP CONSTRAINT IF EXISTS alert_events_student_id_kind_local_date_key;

-- Digests (no timer): one row per student/kind/local day
CREATE UNIQUE INDEX IF NOT EXISTS alert_events_digest_unique_idx
  ON alert_events (student_id, kind, local_date)
  WHERE timer_id IS NULL;

-- Hard-cap / clock rows: one row per timer per local day
CREATE UNIQUE INDEX IF NOT EXISTS alert_events_timer_unique_idx
  ON alert_events (student_id, kind, local_date, timer_id)
  WHERE timer_id IS NOT NULL;

-- Hard-cap kinds must carry a timer_id
ALTER TABLE alert_events
  DROP CONSTRAINT IF EXISTS alert_events_hardcap_requires_timer;
ALTER TABLE alert_events
  ADD CONSTRAINT alert_events_hardcap_requires_timer
  CHECK (
    kind = 'morning_digest' OR timer_id IS NOT NULL
  );

ALTER TABLE employers ADD COLUMN IF NOT EXISTS is_sample boolean not null default false;
