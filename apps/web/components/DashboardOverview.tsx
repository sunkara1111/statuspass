"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calendarDaysUntil, plannerSeverity } from "@statuspass/compliance";
import {
  nextH1b,
  readPreview,
  type H1bDeadline,
  type SevisWallet,
  type UscisCase,
} from "@/lib/preview-store";
import { createClient } from "@/lib/supabase/client";
import { ensureStudent } from "@/lib/student-session";

type Snapshot = {
  sevis: SevisWallet;
  cases: UscisCase[];
  nextDeadline: H1bDeadline | null;
  source: "device" | "account";
};

export function DashboardOverview({ previewMode }: { previewMode: boolean }) {
  const [snap, setSnap] = useState<Snapshot>({
    sevis: { sevisId: "", selfStatus: "unset", universityName: "" },
    cases: [],
    nextDeadline: null,
    source: "device",
  });

  useEffect(() => {
    const preview = readPreview();
    setSnap({
      sevis: preview.sevis,
      cases: preview.cases,
      nextDeadline: nextH1b(preview.h1b),
      source: "device",
    });
    void hydrate();
  }, []);

  async function hydrate() {
    const supabase = createClient();
    if (!supabase) return;
    const session = await ensureStudent(supabase);
    if (!session) return;
    const [{ data: cases }, { data: deadlines }] = await Promise.all([
      supabase
        .from("uscis_cases")
        .select("id, receipt_number, label, last_opened_at")
        .eq("student_id", session.student.id),
      supabase
        .from("h1b_deadlines")
        .select("id, title, due_on, notes")
        .eq("student_id", session.student.id),
    ]);
    const mappedCases = (cases ?? []).map((row) => ({
      id: row.id,
      receiptNumber: row.receipt_number ?? "",
      label: row.label ?? "I-765",
      lastOpenedAt: row.last_opened_at ?? undefined,
    }));
    const mappedH1b = (deadlines ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      dueOn: row.due_on ?? "",
      notes: row.notes ?? "",
    }));
    setSnap({
      sevis: {
        sevisId: session.student.sevis_id ?? "",
        selfStatus: session.student.sevis_self_status,
        universityName: session.student.university_name ?? "",
      },
      cases: mappedCases,
      nextDeadline: nextH1b(mappedH1b),
      source: "account",
    });
  }

  const sevisLabel =
    snap.sevis.selfStatus === "active"
      ? "I believe SEVIS is active"
      : snap.sevis.selfStatus === "escalate_dso"
        ? "Talk to your DSO"
        : "Self-status not set";

  const days = snap.nextDeadline
    ? calendarDaysUntil(snap.nextDeadline.dueOn)
    : null;
  const nextTone = plannerSeverity(days);

  return (
    <div className="space-y-6">
      {previewMode ? (
        <p className="rounded-card border border-navy/15 bg-surface px-4 py-3 text-sm">
          Working on this device. SEVIS, USCIS receipts, and H-1B dates save
          here until you add Supabase keys and sign in.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Next action: keep employment dates current so unemployment stays
          accurate. Wallet and cases{" "}
          {snap.source === "account" ? "are on your account" : "load after sign-in"}.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <LiveCard
          href="/app/sevis"
          kicker="SEVIS wallet"
          title={snap.sevis.sevisId || "Add your SEVIS ID"}
          body={sevisLabel}
          action="Open wallet"
        />
        <LiveCard
          href="/app/cases"
          kicker="USCIS case helper"
          title={
            snap.cases.length
              ? `${snap.cases.length} receipt${snap.cases.length === 1 ? "" : "s"} saved`
              : "No receipts yet"
          }
          body="Official USCIS deep-link only. We never scrape status."
          action="Open cases"
        />
        <LiveCard
          href="/app/h1b"
          kicker="H-1B timeline"
          title={snap.nextDeadline?.title ?? "Plan the next date"}
          body={deadlineBody(snap.nextDeadline, days, nextTone)}
          action="Open timeline"
        />
      </div>
    </div>
  );
}

function deadlineBody(
  row: H1bDeadline | null,
  days: number | null,
  tone: ReturnType<typeof plannerSeverity>,
) {
  if (!row) return "Planner only — StatusPass does not file petitions.";
  if (!row.dueOn) return "Date TBD. Confirm with your employer.";
  if (days === null) return row.dueOn;
  if (tone === "critical" && days < 0) return `${Math.abs(days)} days past the date you entered.`;
  if (days === 0) return "Due today on your planner.";
  return `${days} days left on your planner.`;
}

function LiveCard({
  href,
  kicker,
  title,
  body,
  action,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-card border border-muted/20 bg-surface p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-teal">
        {kicker}
      </p>
      <p className="mt-2 font-serif text-xl font-semibold text-navy">{title}</p>
      <p className="mt-2 flex-1 text-sm text-muted">{body}</p>
      <p className="mt-4 text-sm font-semibold text-teal">{action} →</p>
    </Link>
  );
}
