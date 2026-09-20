# StatusPass mobile

The launch surface is the web organizer. This Expo / React Native shell mirrors the free tools:

- Clocks (example CPT / OPT / STEM)
- SEVIS wallet (self-status only — never a live lookup)
- USCIS case helper (receipts you type)
- H-1B timeline (planner — no filing)

Tokens: `#F7F4EE` cream, `#1E3A5F` navy, `#2A9D8F` teal. Do not share React Native views with web.

1. `cd apps/mobile && npx create-expo-app . --template blank-typescript` (or install `expo` + `react-native` here).
2. Keep `App.tsx` as the organizer tabs.
3. After the student signs in, register the Expo push token:

```ts
await fetch(`${WEB_URL}/api/push-tokens`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token, platform: "ios" }),
});
```

Own-row only. Tokens wipe when the auth user is deleted (`device_push_tokens` in migration 0007).
