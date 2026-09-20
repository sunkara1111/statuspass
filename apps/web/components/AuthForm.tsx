"use client";

import { useState } from "react";
import Link from "next/link";
import { ORGANIZER_LINE } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({
  mode,
  redirect = "/app",
}: {
  mode: "signup" | "login";
  redirect?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setMessage(
        "Supabase keys are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to apps/web/.env.local, then try again. You can still preview clocks on the home page.",
      );
      setBusy(false);
      return;
    }

    if (method === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}${redirect}` },
      });
      setMessage(
        error
          ? error.message
          : "Check your email for the sign-in link.",
      );
      setBusy(false);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(
        error
          ? error.message
          : "Account created. Confirm the email if prompted, then open your clocks.",
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        window.location.assign(redirect);
        return;
      }
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-card border border-muted/20 bg-surface p-6 shadow-sm">
      <div className="mb-4 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMethod("password")}
          className={`rounded-pill px-3 py-1 ${method === "password" ? "bg-navy text-white" : "bg-background text-muted"}`}
        >
          Email + Password
        </button>
        <button
          type="button"
          onClick={() => setMethod("magic")}
          className={`rounded-pill px-3 py-1 ${method === "magic" ? "bg-navy text-white" : "bg-background text-muted"}`}
        >
          Magic Link
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-ink">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        {method === "password" ? (
          <label className="block text-sm font-medium text-ink">
            Password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
            />
          </label>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-card bg-teal px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {mode === "signup" ? "Start free with your OPT clock." : "Log in"}
        </button>
      </form>
      <aside className="mt-4 rounded-card border border-navy/15 bg-background p-3 text-sm text-ink">
        <strong className="text-navy">Important: </strong>
        {ORGANIZER_LINE}
      </aside>
      {message ? <p className="mt-3 text-sm text-navy">{message}</p> : null}
      <p className="mt-4 text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="underline">
              Start free with your OPT clock.
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
