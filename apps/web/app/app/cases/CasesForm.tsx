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
import { createClient } from "@/lib/supabase/client";

export function CasesForm() {
  const [cases, setCases] = useState<UscisCase[]>([]);
  const [receipt, setReceipt] = useState("");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCases(readPreview().cases);
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const value = receipt.trim().toUpperCase();
    if (!USCIS_RECEIPT_PATTERN.test(value)) {
      setMessage("Receipt must be 3 letters + 10 digits, like IOE1234567890.");
      return;
    }
    const row: UscisCase = {
      id: newId(),
      receiptNumber: value,
      label: label.trim() || "I-765",
    };

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
          const { error } = await supabase.from("uscis_cases").insert({
            student_id: student.id,
            receipt_number: row.receiptNumber,
            label: row.label,
          });
          if (error) {
            setMessage(error.message);
            return;
          }
        }
      }
    }

    const next = readPreview();
    next.cases = [row, ...next.cases];
    writePreview(next);
    setCases(next.cases);
    setReceipt("");
    setLabel("");
    setMessage("Saved. Open the official USCIS tool for status — we do not scrape it.");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Self-reported receipt numbers only. StatusPass does not look up or
        scrape USCIS. Use the official case-status page.
      </p>
      <form onSubmit={add} className="grid gap-3 sm:grid-cols-2">
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
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="I-765"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white sm:col-span-2"
        >
          Save receipt
        </button>
      </form>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
      <ul className="space-y-3">
        {cases.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-muted/20 bg-surface px-4 py-3"
          >
            <div>
              <p className="font-semibold text-navy">{row.receiptNumber}</p>
              <p className="text-sm text-muted">{row.label}</p>
            </div>
            <a
              className="text-sm font-semibold text-teal underline"
              href={USCIS_CASE_STATUS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Open official USCIS status
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
