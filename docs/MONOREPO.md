# StatusPass monorepo

```
apps/web                 Next.js App Router + Tailwind
apps/mobile              Expo / React Native (WebView to statuspass.com/app + offline tabs)
packages/ui              tokens + StatusClock, DeadlineCard, PrimaryButton, ChecklistRow, FormProgress
packages/db              Zod mirrors of SQL enums/tables
packages/compliance      CPT / OPT / STEM day math, I-765 reject flags, CIP heuristic, planner days
supabase/migrations      0001–0008 (SEVIS / USCIS / H-1B / push / samples)
docs/                    ONBOARDING.md, DESIGN.md
```

## Decisions

- Turborepo. Shared tokens, not shared React Native views in v1 (web and mobile consume tokens; mobile reimplements primitives).
- Supabase Auth `profiles.id = auth.users.id`. RLS is student-owns-own-graph. Employer directory is read-only.
- `packages/compliance` is the only place day-count math lives. UI never computes clocks inline.
- Affiliate rows are seed/catalog data until real contracts exist.
- GitHub `sunkara1111/statuspass` is source of truth. Attach a custom domain with `DOMAIN.md`.

## Env

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://statuspass.com
```

## Next sprints

2. Next.js landing + Supabase auth
3. 90-day OPT StatusClock + notification triggers
4. I-983 generator from CIP + job description


## Sprint 1 freeze (2026-09-13)

- Day math uses `students.program_timezone` (default `America/New_York`), never UTC midnight.
- `employment_records.pause_reason`: `paid_ev` | `qualifying_unpaid_research` | `sevp_volunteer` + `policy_version`. Null = no pause.
- Unemployment is cumulative. STEM adds 60 (150 total across OPT).
- `compliance_timers.policy_source` + `as_of` version the 364/90/60 rules without a migration.
- `alert_events` outbox: one morning digest per local date, idempotent.
- Free forever: CPT counter + OPT/STEM clocks + danger alerts. Paid: I-765 autofill, I-983 generator, E-Verify search.
