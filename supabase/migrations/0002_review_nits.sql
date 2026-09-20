-- Review nits: schema fixes for production readiness

-- 1. CHECK: counts_toward_cpt_cap can be true ONLY when kind = 'cpt_full_time'
ALTER TABLE employment_records
ADD CONSTRAINT counts_toward_cap_only_cpt_full_time
CHECK (
  counts_toward_cpt_cap = false OR kind = 'cpt_full_time'
);

-- 2. Stop dual-tracking pauses: volunteer_pause is deprecated
-- Remove it from unemployment_reason enum (future cleanup)
-- For now, document that pause_reason is the source of truth
COMMENT ON COLUMN unemployment_events.unemployment_reason IS 
  'DEPRECATED: Use employment_records.pause_reason for pauses. This field should only track actual unemployment.';

-- 3. alert_events unique key must include timer_id
-- Drop old constraint
ALTER TABLE alert_events
DROP CONSTRAINT IF EXISTS alert_events_student_id_kind_local_date_key;

-- Add new unique constraint with timer_id
ALTER TABLE alert_events
ADD CONSTRAINT alert_events_student_id_kind_local_date_timer_id_key
UNIQUE (student_id, kind, local_date, timer_id);

-- 4. alert_events.timezone must match students.program_timezone
-- Create trigger function
CREATE OR REPLACE FUNCTION check_alert_event_timezone()
RETURNS TRIGGER AS $$
DECLARE
  expected_tz TEXT;
BEGIN
  -- Get student's program timezone
  SELECT program_timezone INTO expected_tz
  FROM students
  WHERE id = NEW.student_id;

  -- Check timezone matches
  IF NEW.timezone != expected_tz THEN
    RAISE EXCEPTION 'alert_event timezone (%) must match student program_timezone (%)', 
      NEW.timezone, expected_tz;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS validate_alert_event_timezone ON alert_events;
CREATE TRIGGER validate_alert_event_timezone
BEFORE INSERT OR UPDATE ON alert_events
FOR EACH ROW
EXECUTE FUNCTION check_alert_event_timezone();

-- 5. Partial unique index on employers.ein WHERE ein IS NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS employers_ein_unique_idx
ON employers(ein)
WHERE ein IS NOT NULL;

-- 6. alert_thresholds lives on compliance_timers (see 0001 + 0003), not students.
-- 0002 originally targeted students.alert_thresholds, which 0001 never created.
-- 0003 sets compliance_timers.alert_thresholds default to '{30,7}'.
