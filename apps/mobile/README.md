# StatusPass mobile (Expo scaffold)

Web is the launch surface. This folder is the Expo / React Native shell.

1. `cd apps/mobile && npx create-expo-app . --template blank-typescript` (or install `expo` + `react-native` here).
2. Reuse tokens from `packages/ui` (`#F7F4EE` cream, `#1E3A5F` navy, `#2A9D8F` teal). Do not share React Native views with web in v1.
3. After the student signs in, register the Expo push token:

```ts
await fetch(`${WEB_URL}/api/push-tokens`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token, platform: "ios" }),
});
```

Own-row only. Tokens wipe when the auth user is deleted (`device_push_tokens` in migration 0007).
