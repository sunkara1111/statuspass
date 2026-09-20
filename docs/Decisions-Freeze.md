# StatusPass frozen decisions

Founder: DINESH S

## Compliance
- Full-time CPT ≥ 12 months kills OPT. Hard-alert at 364 days. Part-time CPT does not count.
- OPT unemployment: 90 cumulative days. STEM adds 60 (150 total). Cumulative, not consecutive.
- Pause only if `pause_reason` is `paid_ev`, `qualifying_unpaid_research`, or `sevp_volunteer`.
- Calendar days in `students.program_timezone` (default `America/New_York`). Never UTC midnight.
- Timers carry `policy_source` + `as_of`.
- `alert_events` outbox: one morning digest per local date; unique should include `timer_id` so OPT and STEM hard-caps the same day do not collapse.
- Urgency: green; amber ≤30 days left or CPT ≥340; red + push only ≤7 or hard cap.
- Danger color only on timer chip + banner.

## Product
- Free: clocks + danger alerts. Paid: I-765, I-983, E-Verify search.
- `employers` is a first-class table (EIN, E-Verify, LCA keys).
- Hero CTA: “Start free with your OPT clock.” Free clocks visible before signup.
- Disclaimer beside signup, not only footer.
- Founder credit: DINESH S.

## Tech
- Turborepo, Next.js, Expo, Supabase/Postgres, Tailwind
- Origin repo is source of truth (do not mirror to GitHub just for Vercel)
