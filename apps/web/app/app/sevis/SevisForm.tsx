"use client";

import { useEffect, useState } from "react";
import { SEVIS_ID_PATTERN } from "@statuspass/compliance";
import { newId, readPreview, writePreview } from "@/lib/preview-store";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  { value: "unset", label: "Unset" },
  { value: "active", label: "I believe SEVIS is active" },
  { value: "escalate_dso", label: "I need to talk to my DSO" },
] as const;

export function SevisForm() {
  const [sevisId, setSevisId] = useState("");
  const [selfStatus, setSelfStatus] = useState<"unset" | "active" | "escalate_dso">(
    "unset",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const preview = readPreview();
    setSevisId(preview.sevis.sevisId);
    setSelfStatus(preview.sevis.selfStatus);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (sevisId && !SEVIS_ID_PATTERN.test(sevisId)) {
      setMessage("SEVIS ID must be N followed by 10 digits.");
      return;
    }
    const supabase = createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: student } = await supabase
          .from("students")
          .select("id")
          .eq("profile_id", user.id)
          .maybeSingle();
        if (student) {
          const { error } = await supabase
            .from("students")
            .update({
              sevis_id: sevisId || null,
              sevis_self_status: selfStatus,
            })
            .eq("id", student.id);
          setMessage(error ? error.message : "Saved to your student record.");
          return;
        }
        setMessage(
          "No student row yet. Saved locally until onboarding creates one.",
        );
      }
    }
    const next = readPreview();
    next.sevis = { sevisId, selfStatus };
    writePreview(next);
    void newId;
    setMessage("Saved on this device. Self-reported only.");
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-4">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Self-reported only. StatusPass never claims a live SEVIS or ICE value
        and does not look up anyone&apos;s record.
      </p>
      <label className="block text-sm font-medium">
        SEVIS ID
        <input
          value={sevisId}
          onChange={(e) => setSevisId(e.target.value.toUpperCase())}
          placeholder="N0000000000"
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        How I would describe my SEVIS record
        <select
          value={selfStatus}
          onChange={(e) =>
            setSelfStatus(e.target.value as typeof selfStatus)
          }
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white"
      >
        Save self-status
      </button>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
    </form>
  );
}
