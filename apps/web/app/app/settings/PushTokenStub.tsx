"use client";

import { useState } from "react";

export function PushTokenStub() {
  const [token, setToken] = useState("ExponentPushToken[preview]");
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");
  const [message, setMessage] = useState<string | null>(null);

  async function register() {
    const res = await fetch("/api/push-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform }),
    });
    const json = await res.json();
    setMessage(JSON.stringify(json));
  }

  return (
    <div className="max-w-lg space-y-3 rounded-card bg-surface p-5">
      <h2 className="font-semibold text-navy">Expo push token stub</h2>
      <p className="text-sm text-muted">
        Mobile registers a token here. Danger digests only — not marketing.
      </p>
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full rounded-card border border-muted/30 px-3 py-2"
      />
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as typeof platform)}
        className="w-full rounded-card border border-muted/30 px-3 py-2"
      >
        <option value="web">web</option>
        <option value="ios">ios</option>
        <option value="android">android</option>
      </select>
      <button
        type="button"
        onClick={register}
        className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white"
      >
        Register token
      </button>
      {message ? (
        <pre className="overflow-x-auto text-xs text-muted">{message}</pre>
      ) : null}
    </div>
  );
}
