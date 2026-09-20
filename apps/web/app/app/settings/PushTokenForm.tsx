"use client";

import { useState } from "react";

export function PushTokenForm() {
  const [token, setToken] = useState("");
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function register() {
    setBusy(true);
    const res = await fetch("/api/push-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      stored?: string;
      error?: string;
      note?: string;
    };
    setBusy(false);
    if (!json.ok) {
      setMessage(json.error ?? "Could not register this device.");
      return;
    }
    if (json.stored === "device") {
      setMessage(
        "Saved on this device. Add Supabase keys and sign in to keep the token with your account.",
      );
      return;
    }
    setMessage("Device registered for danger digests only — not marketing.");
  }

  return (
    <div className="max-w-lg space-y-3 rounded-card bg-surface p-5">
      <h2 className="font-semibold text-navy">Danger digest device</h2>
      <p className="text-sm text-muted">
        Register an Expo push token for red-alert digests. Own-row only. Tokens
        wipe when the auth user is deleted.
      </p>
      <label className="block text-sm font-medium">
        Expo token
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ExponentPushToken[...]"
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Platform
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as typeof platform)}
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        >
          <option value="web">web</option>
          <option value="ios">ios</option>
          <option value="android">android</option>
        </select>
      </label>
      <button
        type="button"
        onClick={() => void register()}
        disabled={busy}
        className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        Register device
      </button>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
    </div>
  );
}
