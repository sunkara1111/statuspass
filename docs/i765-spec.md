# I-765 autofill (Pro)

Founder: DINESH S
Route: `/app/i765`

Not a filing. StatusPass is a compliance organizer, not a law firm or DSO. Keep that line on the page.

## Reject flags (inline chips under the field — never a full red screen)
Block submit if:
- category not in c03a / c03b / c03c
- signature_ok is false
- filing_fee_cents ≠ current fee
- SEVIS ID missing
- c03c unless stem_eligible and CIP present
