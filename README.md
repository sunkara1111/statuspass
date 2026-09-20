# StatusPass

Compliance organizer for F-1 / CPT / OPT / STEM OPT students in the United States.

**Not a law firm or DSO. Founded by DINESH S.**

Voice: anxiety-reducing. One next action.

This GitHub repo is the source of truth. A temporary Vercel URL exists only as a tone reference — do not treat it as production:

https://temporary-prompt-pavo-7vphl3a.vercel.app

## Stack

Turborepo monorepo.

| Path | Role |
|---|---|
| `apps/web` | Next.js App Router + Tailwind |
| `apps/mobile` | Expo scaffold (optional) |
| `packages/compliance` | CPT / OPT / STEM day math, I-765 flags, CIP heuristic |
| `packages/db` | Zod mirrors of SQL enums/tables |
| `packages/ui` | Tokens + StatusClock, DeadlineCard, PrimaryButton, ChecklistRow, FormProgress |
| `supabase/migrations` | 0001–0007 + sample employers |

Day-count math lives only in `packages/compliance`. UI never computes clocks inline.

## Freemium

- **Free forever:** CPT counter, OPT/STEM clocks, danger alerts, SEVIS self-status, USCIS receipt helper, H-1B planner
- **Paid stubs:** I-765 autofill, I-983 generator, E-Verify employer search

Frozen rules (see `docs/Decisions-Freeze.md`):

- Full-time CPT hard-alert at **364** days (365th day kills OPT). Part-time CPT does not count.
- OPT unemployment: **90** cumulative days. STEM adds **60** (150 total).
- Pause only if `pause_reason` is `paid_ev`, `qualifying_unpaid_research`, or `sevp_volunteer`.
- Calendar days in `students.program_timezone` (default `America/New_York`). Never UTC midnight.
- `alert_events` unique key includes `timer_id` so OPT and STEM hard-caps the same day do not collapse.

## Setup

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

Open http://localhost:3000. The landing, clocks, and Pro stubs render without Supabase. Auth persist needs keys.

## Environment

Copy `.env.example`. No real secrets belong in git.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
I765_FEE_CENTS=52000
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`I765_FEE_CENTS` is the fee StatusPass checks against. It is not a live USCIS feed.

## Supabase migrations

Create a project at [supabase.com](https://supabase.com). In SQL Editor run **in order**:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_review_nits.sql`
3. `supabase/migrations/0003_review_nits_fix.sql`
4. `supabase/migrations/0004_ssn_prearrival.sql`
5. `supabase/migrations/0005_sevis_uscis.sql`
6. `supabase/migrations/0006_h1b_timeline.sql`
7. `supabase/migrations/0007_store_push.sql`
8. `supabase/migrations/0008_sample_employers.sql` (fictional SAMPLE rows only)

Or, with the CLI:

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

Copy the project URL, anon key, and service role key into `apps/web/.env.local`.

0005–0007 add:

- `students.sevis_self_status` (self-reported only — never a live SEVIS/ICE value)
- `uscis_cases` (receipts you type; official USCIS deep-link only)
- `h1b_deadlines` (planner — StatusPass does not file petitions)
- `device_push_tokens` (Expo tokens; own-row; cascade on account delete)

## Vercel deploy

1. Import `sunkara1111/statuspass` into Vercel.
2. Framework: Next.js. Install: `pnpm install`. Build: `pnpm turbo run build --filter=@statuspass/web`.
3. If Vercel asks for a root directory, use the repo root (this `vercel.json`) **or** `apps/web` with “include files outside root directory”.
4. Set the env vars from `.env.example` on the project. Set `NEXT_PUBLIC_SITE_URL` to the production URL so sitemap / Open Graph resolve.
5. Deploy. Confirm the landing shows DINESH S in the footer and the three guest clocks before signup.

## SEO

`apps/web` ships `title` / `description` / Open Graph, `app/robots.ts`, and `app/sitemap.ts`. After the production domain is set, request indexing in Search Console.

## Docs

- `docs/PRODUCT.md`
- `docs/Decisions-Freeze.md`
- `docs/DESIGN.md`
- `docs/ONBOARDING.md`
- `docs/landing-copy.md`
- `docs/i765-spec.md`
- `docs/everify-search.md`
