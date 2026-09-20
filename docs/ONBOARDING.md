# StatusPass onboarding — incoming F-1 to STEM OPT

Linear stepper. Student only sees the stage they are in plus completed ones.

## Stage A — Incoming F-1 (pre-arrival)

1. Visa interview prep: DS-160, I-20, SEVIS I-901 fee, ties-to-home talking points.
2. No-SSN US bank account offers (catalog, not a hard sell).
3. eSIM selection for landing week.
4. Roommate matching profile (university, arrive-on, budget).

Exit: first US entry recorded (`visas.port_of_entry`, status → `active_f1`).

## Stage B — Enrolled / CPT

1. Confirm SEVIS active + I-20 dates.
2. Add CPT employment. Full-time CPT starts `cpt_full_time_days` (limit 364).
3. SSN request letter draft (`form_type = ssn_request_letter`).

Amber when full-time CPT days ≥ 340. Red + push at ≤7 days left or at the 364 cap. Crossing 365 full-time CPT days kills OPT eligibility.

## Stage C — 12-month OPT

1. I-765 autofill. Block submit if rejection triggers fire (wrong `c03a`/`c03b`/`c03c`, stale fee, missing signature).
2. 90-day unemployment clock starts the day after `ead_valid_from` if no qualifying employment.
3. Unpaid volunteer / research can pause the clock only when SEVP-compliant.

## Stage D — STEM OPT

1. CIP + job description → I-983 `generated_sections`.
2. Employer must be `everify_listed` or `everify_and_lca`.
3. Schedule 12-month and 24-month self-eval timers.
4. Unemployment cap switches: 90-day OPT clock completes; additional 60-day STEM clock starts.

## Timer defaults

| Clock | Limit |
|---|---|
| Full-time CPT days | 364 |
| OPT unemployment | 90 |
| STEM OPT unemployment | 60 |
| Alerts | amber ≤30 (or CPT ≥340) · red + push ≤7 |
