-- 0006: H-1B docs & timeline organizer (no filing)

CREATE TABLE IF NOT EXISTS h1b_deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_on date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS h1b_deadlines_student_idx ON h1b_deadlines(student_id);
CREATE INDEX IF NOT EXISTS h1b_deadlines_due_idx ON h1b_deadlines(due_on);

ALTER TABLE h1b_deadlines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS h1b_deadlines_own ON h1b_deadlines;
CREATE POLICY h1b_deadlines_own ON h1b_deadlines
  FOR ALL USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_id AND s.profile_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_id AND s.profile_id = auth.uid())
  );

COMMENT ON TABLE h1b_deadlines IS
  'User-entered H-1B planning deadlines only. StatusPass does not file petitions.';
