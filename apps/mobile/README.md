# StatusPass mobile

Expo app that opens the same StatusPass organizer as the web PWA.

- Live mode: WebView to `https://statuspass.com/app` (override with `EXPO_PUBLIC_SITE_URL`)
- Fallback: `https://temporary-prompt-pavo-7vphl3a.vercel.app/app`
- Offline: local clocks / SEVIS / USCIS / H-1B tabs if neither host loads

Branding: navy chrome, StatusPass wordmark, **Founded by DINESH S**.

Tokens: `#F7F4EE` cream, `#1E3A5F` navy, `#2A9D8F` teal. Do not share React Native views with web.

## Run

From this directory (after the repo-root `pnpm install`):

```bash
npx expo start
```

Or from the repo root: `pnpm --filter @statuspass/mobile start`.

Scan the QR code with Expo Go. EAS build config is in `eas.json` (`eas build` after `eas init`).

## Push tokens

After the student signs in on web, register the Expo push token:

```ts
await fetch(`${WEB_URL}/api/push-tokens`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token, platform: "ios" }),
});
```

Own-row only. Tokens wipe when the auth user is deleted (`device_push_tokens` in migration 0007).
