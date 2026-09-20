-- 0005: SEVIS wallet + USCIS case helper (no live SEVIS/ICE lookup, no scraped status)

DO $$ BEGIN
  CREATE TYPE sevis_self_status AS ENUM ('unset', 'active', 'escalate_dso');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS sevis_self_status sevis_self_status NOT NULL DEFAULT 'unset';

COMMENT ON COLUMN students.sevis_self_status IS
  'Self-reported only. NEVER a verified/live SEVIS or ICE value.';

-- SEVIS ID format N + 10 digits when set
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_sevis_id_format;
ALTER TABLE students ADD CONSTRAINT students_sevis_id_format
  CHECK (sevis_id IS NULL OR sevis_id ~ '^N[0-9]{10}$');

CREATE TABLE IF NOT EXISTS uscis_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  receipt_number text,
  label text,
  last_opened_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uscis_cases_receipt_format CHECK (
    receipt_number IS NULL OR receipt_number ~ '^[A-Z]{3}[0-9]{10}$'
  )
);

CREATE INDEX IF NOT EXISTS uscis_cases_student_idx ON uscis_cases(student_id);

ALTER TABLE uscis_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS uscis_cases_own ON uscis_cases;
CREATE POLICY uscis_cases_own ON uscis_cases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_id AND s.profile_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_id AND s.profile_id = auth.uid())
  );
