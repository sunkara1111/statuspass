# StatusPass — go live checklist

Founder: DINESH S
Repo (source of truth): https://cursor.com/codebase/million-macq/tmp-0e54d8766a78dd3f

## Code status (done on Origin main)
- [x] Sprints 1–4
- [x] Launch polish (0002, 0003)
- [x] Fictional SAMPLE employers
- [x] 0004 SSN letter + pre-arrival + I765_FEE_CENTS
- [x] Founder credit: DINESH S

## You still need (cannot automate without your accounts)

### 1. Supabase project
1. Create a project at https://supabase.com
2. SQL Editor → run in order:
   - `DATA/0001_init.sql` (or repo `supabase/migrations/0001_init.sql`)
   - `supabase/migrations/0002_review_nits.sql`
   - `supabase/migrations/0003_review_nits_fix.sql`
   - `supabase/migrations/0004_ssn_prearrival.sql`
   - optional: `DATA/sample-employers.sql`
3. Project Settings → API → copy URL + anon key + service role key

### 2. Env vars (apps/web)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
I765_FEE_CENTS=52000
CRON_SECRET=
```
Do not put secrets in this Desktop folder.

### 3. Deploy (Origin ↔ Vercel)
1. Origin setup: https://cursor.com/codebase/get-started
2. Connect Vercel to Origin (do NOT mirror to GitHub just for Vercel)
3. Set the env vars on Vercel for the web app
4. Deploy `apps/web`

### 4. After public URL exists
Ping portfolio owner with the live link (int employee 1 is holding the SunkaraOps listing until then).

## Legal before public marketing
Have counsel review `LEGAL/` templates. Add founder contact email + mailing address.

## Live Supabase (created 2026-09-20)
- Org/Project: StatusPass (Free)
- Ref: yzoeevdfjdoleajpmbfe
- Region: us-east-1
- Migrations 0001-0004 applied
- Keys only on agent machine under statuspass-secrets (not Desktop)
- Still need: Vercel linked to Origin + public URL

## LIVE
- Public URL: https://temporary-prompt-pavo-7vphl3a.vercel.app
- Verified HTTP 200 with StatusPass landing + DINESH S

## Still to apply on Supabase (written on Desktop 2026-09-20)
SQL Editor, in order, after 0001-0004:
- DATA/0005_sevis_uscis.sql
- DATA/0006_h1b_timeline.sql
- DATA/0007_store_push.sql

Also mirror these into the Origin repo supabase/migrations/ if not already present.
