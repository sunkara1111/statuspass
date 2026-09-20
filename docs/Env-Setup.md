# Environment setup (no secrets in this folder)

Create a Supabase project, then put keys only in `apps/web/.env.local` on a machine — never commit them and do not paste them into this Desktop folder.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

Apply `DATA/0001_init.sql` in the Supabase SQL editor.

Local web: `pnpm install` then `pnpm dev` in `apps/web`.

Repo: https://cursor.com/codebase/million-macq/tmp-0e54d8766a78dd3f
