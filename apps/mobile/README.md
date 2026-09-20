# StatusPass mobile

Expo (SDK 53) + Expo Router app for the same organizer as the web PWA.

- Clocks (shared `@statuspass/compliance` example CPT / OPT / STEM math)
- SEVIS wallet (self-status only — never a live lookup)
- USCIS case helper (receipts you type; official USCIS link)
- H-1B timeline (planner — no filing)
- Optional Supabase auth; guest mode if keys are missing
- I-765 packet check, settings, privacy links

Branding: navy chrome, StatusPass wordmark, **Founded by DINESH S**.

Store IDs: `com.sunkara.statuspass`. Listing draft: `docs/STORE_LISTING.md`. The app is **not** live on the App Store or Play Store until the owner submits.

## Run

From the repo root (`pnpm install` first):

```bash
cd apps/mobile
cp .env.example .env   # optional
npx expo start
```

Scan the QR code with Expo Go. The app launches without secrets.

## EAS build (owner accounts required)

```bash
cd apps/mobile
npm i -g eas-cli
eas login
eas init          # replace extra.eas.projectId in app.config.ts
```

Then:

```bash
# iOS simulator + Android APK for local QA
eas build --profile development --platform ios
eas build --profile development --platform android

# Internal testers
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Store binaries (AAB + App Store IPA)
eas build --profile production --platform ios
eas build --profile production --platform android
```

Submit (after the stores are set up on the owner accounts):

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

Privacy URL in the consoles: `https://statuspass.com/privacy` (fallback `https://statuspass-web.vercel.app/privacy`).

## Env

```
EXPO_PUBLIC_SITE_URL=https://statuspass.com
EXPO_PUBLIC_FALLBACK_URL=https://statuspass-web.vercel.app
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Push tokens still POST to the web API after the student signs in (`/api/push-tokens`).
