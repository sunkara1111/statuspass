"use client";

import { useEffect, useState } from "react";
import { USCIS_RECEIPT_PATTERN } from "@statuspass/compliance";
import { USCIS_CASE_STATUS_URL } from "@/lib/site";
import {
  newId,
  readPreview,
  writePreview,
  type UscisCase,
} from "@/lib/preview-store";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ensureStudent } from "@/lib/student-session";

const LABELS = ["I-765", "I-20 / I-539", "I-983", "H-1B", "Other"];

export function CasesForm() {
  const [cases, setCases] = useState<UscisCase[]>([]);
  const [receipt, setReceipt] = useState("");
  const [label, setLabel] = useState("I-765");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void hydrate();
  }, []);

  async function hydrate() {
    const preview = readPreview();
    setCases(preview.cases);
    const supabase = createClient();
    if (!supabase) return;
    const session = await ensureStudent(supabase);
    if (!session) return;
    if (preview.cases.length) {
      await syncLocalCases(supabase, session.student.id, preview.cases);
    }
    const { data } = await supabase
      .from("uscis_cases")
      .select("id, receipt_number, label, last_opened_at")
      .eq("student_id", session.student.id)
      .order("created_at", { ascending: false });
    if (!data) return;
    const mapped = data.map(mapCase);
    persistCases(mapped);
    setCases(mapped);
    setSource("account");
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const value = receipt.trim().toUpperCase();
    if (!USCIS_RECEIPT_PATTERN.test(value)) {
      setMessage("Receipt must be 3 letters + 10 digits, like IOE1234567890.");
      return;
    }
    setBusy(true);
    let row: UscisCase = {
      id: newId(),
      receiptNumber: value,
      label: label.trim() || "I-765",
    };

    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        const { data, error } = await supabase
          .from("uscis_cases")
          .insert({
            student_id: session.student.id,
            receipt_number: row.receiptNumber,
            label: row.label,
          })
          .select("id, receipt_number, label, last_opened_at")
          .single();
        if (error) {
          setMessage(error.message);
          setBusy(false);
          return;
        }
        row = mapCase(data);
        setSource("account");
      }
    }

    const next = [row, ...readPreview().cases.filter((c) => c.id !== row.id)];
    persistCases(next);
    setCases(next);
    setReceipt("");
    setMessage(
      "Saved. Open the official USCIS tool for status — we do not scrape it.",
    );
    setBusy(false);
  }

  async function remove(id: string) {
    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        await supabase.from("uscis_cases").delete().eq("id", id);
      }
    }
    const next = readPreview().cases.filter((row) => row.id !== id);
    persistCases(next);
    setCases(next);
  }

  async function openOfficial(row: UscisCase) {
    const opened = new Date().toISOString();
    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        await supabase
          .from("uscis_cases")
          .update({ last_opened_at: opened })
          .eq("id", row.id);
        setSource("account");
      }
    }
    const next = readPreview().cases.map((item) =>
      item.id === row.id ? { ...item, lastOpenedAt: opened } : item,
    );
    persistCases(next);
    setCases(next);
    window.open(USCIS_CASE_STATUS_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Self-reported receipt numbers only. StatusPass does not look up or
        scrape USCIS. Use the official case-status page.
      </p>
      <form
        onSubmit={add}
        className="grid gap-3 rounded-card border border-muted/20 bg-surface p-5 sm:grid-cols-2"
      >
        <label className="text-sm font-medium">
          Receipt number
          <input
            value={receipt}
            onChange={(e) => setReceipt(e.target.value.toUpperCase())}
            placeholder="IOE1234567890"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Label
          <input
            list="case-labels"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="I-765"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
          <datalist id="case-labels">
            {LABELS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white disabled:opacity-60 sm:col-span-2"
        >
          Save receipt
        </button>
      </form>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
      <p className="text-xs text-muted">
        {cases.length} saved ·{" "}
        {source === "account" ? "synced to your account" : "stored on this device"}
      </p>
      {cases.length === 0 ? (
        <div className="rounded-card border border-dashed border-navy/20 bg-surface px-5 py-8 text-sm text-muted">
          Add a receipt to keep the official USCIS link next to it. We never
          fetch government status.
        </div>
      ) : (
        <ul className="space-y-3">
          {cases.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-muted/20 bg-surface px-4 py-3"
            >
              <div>
                <p className="font-semibold tracking-wide text-navy">
                  {row.receiptNumber}
                </p>
                <p className="text-sm text-muted">{row.label}</p>
                {row.lastOpenedAt ? (
                  <p className="mt-1 text-xs text-muted">
                    Official tool last opened{" "}
                    {new Date(row.lastOpenedAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void openOfficial(row)}
                  className="rounded-card bg-navy px-3 py-2 text-sm font-semibold text-white"
                >
                  Open official USCIS status
                </button>
                <button
                  type="button"
                  onClick={() => void remove(row.id)}
                  className="rounded-card border border-muted/30 px-3 py-2 text-sm text-muted"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function persistCases(cases: UscisCase[]) {
  const next = readPreview();
  next.cases = cases;
  writePreview(next);
}

function mapCase(row: {
  id: string;
  receipt_number: string | null;
  label: string | null;
  last_opened_at: string | null;
}): UscisCase {
  return {
    id: row.id,
    receiptNumber: row.receipt_number ?? "",
    label: row.label ?? "I-765",
    lastOpenedAt: row.last_opened_at ?? undefined,
  };
}

async function syncLocalCases(
  supabase: SupabaseClient,
  studentId: string,
  local: UscisCase[],
) {
  const { data } = await supabase
    .from("uscis_cases")
    .select("receipt_number")
    .eq("student_id", studentId);
  const have = new Set((data ?? []).map((row) => row.receipt_number));
  const missing = local.filter(
    (row) => row.receiptNumber && !have.has(row.receiptNumber),
  );
  if (!missing.length) return;
  await supabase.from("uscis_cases").insert(
    missing.map((row) => ({
      student_id: studentId,
      receipt_number: row.receiptNumber,
      label: row.label,
      last_opened_at: row.lastOpenedAt ?? null,
    })),
  );
}
