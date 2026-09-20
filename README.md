# StatusPass

Compliance organizer for F-1 / CPT / OPT / STEM OPT students in the United States.

**Not a law firm or DSO. Founded by DINESH S.**

Voice: anxiety-reducing. One next action.

This GitHub repo is the source of truth. Canonical public URL: **https://statuspass.com** (`NEXT_PUBLIC_SITE_URL`). The Vercel host is the fallback until DNS/TLS on that domain is green — see `DOMAIN.md`. Tone reference:

https://temporary-prompt-pavo-7vphl3a.vercel.app

## Stack

Turborepo monorepo.

| Path | Role |
|---|---|
| `apps/web` | Next.js App Router + Tailwind |
| `apps/mobile` | Expo Router app — clocks, SEVIS, USCIS, H-1B, optional auth |
| `packages/compliance` | CPT / OPT / STEM day math, I-765 flags, CIP heuristic |
| `packages/db` | Zod mirrors of SQL enums/tables |
| `packages/ui` | Tokens + StatusClock, DeadlineCard, PrimaryButton, ChecklistRow, FormProgress |
| `supabase/migrations` | 0001–0007 + sample employers |

Day-count math lives only in `packages/compliance`. UI never computes clocks inline.

## Freemium

- **Free forever:** CPT counter, OPT/STEM clocks, danger alerts, SEVIS self-status, USCIS receipt helper, H-1B planner
- **Pro helpers:** I-765 packet check, I-983 draft, E-Verify sample catalog (not filings)

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

Open http://localhost:3000. Landing, clocks, SEVIS wallet, USCIS helper, and H-1B timeline work without Supabase (device storage). Auth persist needs keys.

`/app` is the installed-app shell (bottom nav, no marketing chrome). Add to Home Screen uses the web app manifest + service worker.

```bash
cd apps/mobile && npx expo start
```

The Expo app is a real organizer (clocks, SEVIS, USCIS, H-1B, optional auth). It is **not** live on the App Store or Play Store. Store listing draft: `docs/STORE_LISTING.md`. EAS:

```bash
cd apps/mobile
eas build --profile preview --platform ios
eas build --profile preview --platform android
eas build --profile production --platform all
```

## Environment

Copy `.env.example`. No real secrets belong in git.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
I765_FEE_CENTS=52000
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=https://statuspass.com
```

Locally you can set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Production prefers `https://statuspass.com` and falls back to `*.vercel.app` on preview deploys.

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

One command from the repo root (after `pnpm install` and the Vercel CLI login):

```bash
npx vercel --prod --yes
```

Or import `sunkara1111/statuspass` in the Vercel dashboard. This repo’s `vercel.json` already sets install `pnpm install` and build `pnpm turbo run build --filter=@statuspass/web`. Use the **repository root** (not `apps/web` alone).

Then:

1. Project Settings → Environment Variables: paste `.env.example` keys. Set `NEXT_PUBLIC_SITE_URL=https://statuspass.com`.
2. Redeploy if you added env after the first build.
3. Optional: assign a custom domain. Search Console file is at `/google04d4f9506cc11bf7.html`.
4. Confirm the landing shows DINESH S in the footer and the three guest clocks before signup. There is no Vercel “powered by” badge in the UI.

## Install the web app

StatusPass is a Progressive Web App. After deploy:

- **iPhone / iPad:** Safari → Share → Add to Home Screen
- **Android:** Chrome → menu → Install app / Add to Home screen
- **Desktop Chrome / Edge:** install icon in the address bar

The home-screen icon opens `/app` in standalone display (navy app chrome, bottom nav). There is no Vercel “powered by” badge.

## SEO

`apps/web` ships `title` / `description` / Open Graph, `app/robots.ts`, and `app/sitemap.ts`. After the production domain is set, request indexing in Search Console.

## Docs

- `DOMAIN.md` — attach a domain you already own (no invented hostname)
- `docs/PRODUCT.md`
- `docs/Decisions-Freeze.md`
- `docs/DESIGN.md`
- `docs/ONBOARDING.md`
- `docs/landing-copy.md`
- `docs/i765-spec.md`
- `docs/everify-search.md`
