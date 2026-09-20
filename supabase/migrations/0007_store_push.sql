-- 0007: device push tokens for Expo (own-row; wiped with account delete cascade)

DO $$ BEGIN
  CREATE TYPE push_platform AS ENUM ('ios', 'android', 'web');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS device_push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform push_platform NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS device_push_tokens_profile_idx ON device_push_tokens(profile_id);

ALTER TABLE device_push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS device_push_tokens_own ON device_push_tokens;
CREATE POLICY device_push_tokens_own ON device_push_tokens
  FOR ALL USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

COMMENT ON TABLE device_push_tokens IS
  'Expo push tokens for danger digests. Own-row only. Wiped when auth.users is deleted.';
