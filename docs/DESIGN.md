# StatusPass design system

Anxiety-reducing. Deadline-first. One primary action per screen.
StatusPass is a compliance organizer, not a law firm or DSO.

## Tokens

| Token | Value | Use |
|---|---|---|
| background | `#F7F4EE` | App cream |
| surface | `#FFFFFF` | Cards |
| ink | `#1B2430` | Body |
| muted | `#5C6773` | Secondary |
| brand navy | `#1E3A5F` | Chrome, headlines |
| brand teal | `#2A9D8F` | Primary CTA |
| safe | `#2F9E44` | Clock: plenty of days |
| warning | `#E6A817` | Clock: approaching limit |
| critical | `#C92A2A` | Clock: danger only — never decorative |
| radius | 12 / 20 | Cards / pills |
| type | Source Serif 4 (H), DM Sans (UI) | Calm, readable |

Severity bands: green when cushion is healthy; amber at ≤30 days left (or CPT ≥340); red + push only at ≤7 or when a hard cap is about to kill eligibility. Danger color lives on the timer chip and alert banner only, never whole screens.

## Components

- **StatusClock** — large remaining-days number, severity color, label (`OPT unemployment left`).
- **DeadlineCard** — title, date, next action.
- **PrimaryButton** — one per screen.
- **ChecklistRow** — orientation / interview prep.
- **FormProgress** — I-765 / I-983 steps.

## Copy voice

Short sentences. Next action obvious. Never legal-advice tone.
Disclaimer beside signup (not only the footer): “StatusPass is a compliance organizer, not a law firm or DSO.” Repeat on compliance screens.
