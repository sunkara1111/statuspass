# StatusPass store listing draft

**Not live.** This is copy and a screenshot checklist so the owner can submit with their own Apple Developer and Google Play Console accounts. Do not claim StatusPass is already on the App Store or Play Store.

Privacy policy (required for both stores):

- Preferred: https://statuspass.com/privacy
- Fallback while DNS is pending: https://statuspass-web.vercel.app/privacy

Bundle / package ID: `com.sunkara.statuspass`

## Title

StatusPass

## Subtitle (App Store, 30 characters)

F-1 CPT OPT STEM clocks

## Short description (Play Store, 80 characters)

F-1 CPT, OPT & STEM clocks plus SEVIS, USCIS, and H-1B organizers. Not a DSO.

## Full description

StatusPass is a compliance organizer for F-1, CPT, OPT, and STEM OPT students in the United States.

Track CPT full-time days, OPT unemployment, and STEM clocks in your program timezone. Save a self-reported SEVIS wallet, USCIS receipt numbers (official case-status link only), and an H-1B planning timeline. Free clocks and danger alerts. Founded by DINESH S.

StatusPass is not a law firm or DSO. It does not look up SEVIS or ICE, does not scrape USCIS, and does not file H-1B or I-765 petitions.

## Keywords (App Store)

F-1,OPT,STEM OPT,CPT,SEVIS,USCIS,H-1B,international student,I-20,I-765

## Category

Education / Productivity

## Support URL

https://statuspass.com

## Marketing URL

https://statuspass.com

## Screenshot checklist (phone, 6.7" and 6.1")

Capture after `npx expo start` or an EAS preview build. Use cream `#F7F4EE` and navy `#1E3A5F`. No Vercel badges.

1. Clocks tab — three example CPT / OPT / STEM clocks
2. SEVIS wallet — self-status chips, N-number field
3. USCIS helper — receipt field + empty state
4. H-1B timeline — starter titles or one saved deadline
5. Log in — disclaimer “not a law firm or DSO”
6. Settings — privacy link and DINESH S credit

Tablet screenshots are optional (iPad not supported).

## Age rating

4+ / Everyone. No user-generated public content, no location, no ads.

## Data safety / App privacy

- Account email only if the student signs in (Supabase Auth)
- Optional self-entered SEVIS ID, USCIS receipts, H-1B planner dates
- Stored on-device until keys are configured; then own-row in Supabase
- No advertising, no tracking SDKs in v1

## Review notes (paste into the store consoles)

Guest mode works without login. Sign-in is optional and needs the reviewer’s test account after Supabase is configured. Demo: open Clocks, SEVIS, USCIS, H-1B. I-765 is a packet checklist, not a filing.
