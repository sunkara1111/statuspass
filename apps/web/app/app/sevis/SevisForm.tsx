"use client";

import { useEffect, useState } from "react";
import { SEVIS_ID_PATTERN } from "@statuspass/compliance";
import { readPreview, writePreview } from "@/lib/preview-store";
import { createClient } from "@/lib/supabase/client";
import { ensureStudent } from "@/lib/student-session";

const STATUSES = [
  {
    value: "unset",
    label: "Not set yet",
    detail: "Add how you would describe your record today.",
  },
  {
    value: "active",
    label: "I believe SEVIS is active",
    detail: "Self-reported. Confirm any change with your DSO.",
  },
  {
    value: "escalate_dso",
    label: "I need to talk to my DSO",
    detail: "Next action: contact your DSO. StatusPass cannot update SEVIS.",
  },
] as const;

type SelfStatus = (typeof STATUSES)[number]["value"];

export function SevisForm() {
  const [sevisId, setSevisId] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [selfStatus, setSelfStatus] = useState<SelfStatus>("unset");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void hydrate();
  }, []);

  async function hydrate() {
    const preview = readPreview();
    setSevisId(preview.sevis.sevisId);
    setSelfStatus(preview.sevis.selfStatus);
    setUniversityName(preview.sevis.universityName);
    const supabase = createClient();
    if (!supabase) return;
    const session = await ensureStudent(supabase);
    if (!session) return;
    setSevisId(session.student.sevis_id ?? preview.sevis.sevisId);
    setSelfStatus(session.student.sevis_self_status ?? preview.sevis.selfStatus);
    setUniversityName(
      session.student.university_name ?? preview.sevis.universityName,
    );
    setSource("account");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const id = sevisId.trim().toUpperCase();
    if (id && !SEVIS_ID_PATTERN.test(id)) {
      setMessage("SEVIS ID must be N followed by 10 digits.");
      return;
    }
    setBusy(true);
    const next = readPreview();
    next.sevis = {
      sevisId: id,
      selfStatus,
      universityName: universityName.trim(),
    };
    writePreview(next);

    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        const { error } = await supabase
          .from("students")
          .update({
            sevis_id: id || null,
            sevis_self_status: selfStatus,
            university_name: universityName.trim() || null,
          })
          .eq("id", session.student.id);
        if (error) {
          setMessage(error.message);
          setBusy(false);
          return;
        }
        setSource("account");
        setMessage("Saved to your student record. Self-reported only.");
        setBusy(false);
        return;
      }
    }
    setSource("device");
    setMessage("Saved on this device. Self-reported only — never a live SEVIS value.");
    setBusy(false);
  }

  const statusMeta = STATUSES.find((s) => s.value === selfStatus) ?? STATUSES[0];
  const formatted = formatSevisId(sevisId);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <article className="rounded-card border-2 border-navy/10 bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">
          SEVIS wallet
        </p>
        <p className="mt-3 font-serif text-3xl font-semibold text-navy">
          {formatted || "Add your SEVIS ID"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {universityName.trim() || "School name is optional"}
        </p>
        <div className="mt-5">
          <StatusChip status={selfStatus} label={statusMeta.label} />
          <p className="mt-3 text-sm text-ink">{statusMeta.detail}</p>
        </div>
        <p className="mt-6 text-xs text-muted">
          Stored {source === "account" ? "on your account" : "on this device"}.
          StatusPass never looks up SEVIS or ICE.
        </p>
      </article>

      <form onSubmit={save} className="space-y-4 rounded-card border border-muted/20 bg-surface p-6">
        <p className="rounded-card border border-navy/15 bg-background p-3 text-sm">
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
          School or university
          <input
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            placeholder="As printed on your I-20"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">
            How I would describe my SEVIS record
          </legend>
          <div className="mt-2 space-y-2">
            {STATUSES.map((s) => (
              <label
                key={s.value}
                className={`flex cursor-pointer items-start gap-3 rounded-card border px-3 py-2 text-sm ${
                  selfStatus === s.value
                    ? "border-teal bg-teal/5"
                    : "border-muted/20"
                }`}
              >
                <input
                  type="radio"
                  name="sevis-self-status"
                  className="mt-1"
                  checked={selfStatus === s.value}
                  onChange={() => setSelfStatus(s.value)}
                />
                <span>
                  <span className="font-medium text-navy">{s.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {s.detail}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={busy}
          className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          Save self-status
        </button>
        {message ? <p className="text-sm text-navy">{message}</p> : null}
      </form>
    </div>
  );
}

function formatSevisId(value: string) {
  const raw = value.toUpperCase().replace(/\s/g, "");
  if (!/^N\d{0,10}$/.test(raw)) return value;
  if (raw.length < 5) return raw;
  return `${raw.slice(0, 5)} ${raw.slice(5, 8)} ${raw.slice(8)}`.trim();
}

function StatusChip({
  status,
  label,
}: {
  status: SelfStatus;
  label: string;
}) {
  const tone =
    status === "active"
      ? "bg-safe/15 text-safe"
      : status === "escalate_dso"
        ? "bg-warning/20 text-ink"
        : "bg-navy/10 text-navy";
  return (
    <span
      className={`inline-block rounded-pill px-3 py-1 text-sm font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}
