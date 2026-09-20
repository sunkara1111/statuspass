"use client";

import { useEffect, useMemo, useState } from "react";
import {
  H1B_STARTER_ITEMS,
  calendarDaysUntil,
  plannerSeverity,
} from "@statuspass/compliance";
import {
  newId,
  readPreview,
  writePreview,
  type H1bDeadline,
} from "@/lib/preview-store";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ensureStudent } from "@/lib/student-session";

export function H1bForm() {
  const [rows, setRows] = useState<H1bDeadline[]>([]);
  const [title, setTitle] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void hydrate();
  }, []);

  const timeline = useMemo(
    () =>
      rows
        .slice()
        .sort((a, b) => {
          if (a.dueOn && b.dueOn) return a.dueOn.localeCompare(b.dueOn);
          if (a.dueOn) return -1;
          if (b.dueOn) return 1;
          return a.title.localeCompare(b.title);
        }),
    [rows],
  );

  async function hydrate() {
    const preview = readPreview();
    setRows(preview.h1b);
    const supabase = createClient();
    if (!supabase) return;
    const session = await ensureStudent(supabase);
    if (!session) return;
    if (preview.h1b.length) {
      await syncLocalDeadlines(supabase, session.student.id, preview.h1b);
    }
    const { data } = await supabase
      .from("h1b_deadlines")
      .select("id, title, due_on, notes")
      .eq("student_id", session.student.id)
      .order("due_on", { ascending: true, nullsFirst: false });
    if (!data) return;
    const mapped = data.map(mapDeadline);
    persistH1b(mapped);
    setRows(mapped);
    setSource("account");
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Give this deadline a name.");
      return;
    }
    await saveRow({
      id: newId(),
      title: title.trim(),
      dueOn,
      notes: notes.trim(),
    });
    setTitle("");
    setDueOn("");
    setNotes("");
  }

  async function addStarter() {
    for (const item of H1B_STARTER_ITEMS) {
      if (readPreview().h1b.some((row) => row.title === item.title)) continue;
      await saveRow({
        id: newId(),
        title: item.title,
        dueOn: "",
        notes: item.notes,
      });
    }
    setMessage(
      "Added planning titles. Put dates on after you confirm them with your employer.",
    );
  }

  async function saveRow(row: H1bDeadline) {
    setBusy(true);
    let stored = row;
    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        const { data, error } = await supabase
          .from("h1b_deadlines")
          .insert({
            student_id: session.student.id,
            title: row.title,
            due_on: row.dueOn || null,
            notes: row.notes || null,
          })
          .select("id, title, due_on, notes")
          .single();
        if (error) {
          setMessage(error.message);
          setBusy(false);
          return;
        }
        stored = mapDeadline(data);
        setSource("account");
      }
    }
    const next = [stored, ...readPreview().h1b.filter((item) => item.id !== stored.id)];
    persistH1b(next);
    setRows(next);
    setMessage(
      "Saved. This is a planner only — StatusPass does not file H-1B petitions.",
    );
    setBusy(false);
  }

  async function remove(id: string) {
    const supabase = createClient();
    if (supabase) {
      const session = await ensureStudent(supabase);
      if (session) {
        await supabase.from("h1b_deadlines").delete().eq("id", id);
      }
    }
    const next = readPreview().h1b.filter((row) => row.id !== id);
    persistH1b(next);
    setRows(next);
  }

  return (
    <div className="space-y-6">
      <p className="max-w-3xl rounded-card border border-navy/15 bg-surface p-4 text-sm">
        User-entered H-1B planning dates. Not a filing product and not legal
        representation.
      </p>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <form
          onSubmit={add}
          className="space-y-3 rounded-card border border-muted/20 bg-surface p-5"
        >
          <label className="block text-sm font-medium">
            Deadline
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Registration window opens"
              className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium">
            Due on
            <input
              type="date"
              value={dueOn}
              onChange={(e) => setDueOn(e.target.value)}
              className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            Add deadline
          </button>
          <button
            type="button"
            onClick={() => void addStarter()}
            className="ml-2 text-sm font-semibold text-teal underline"
          >
            Use starter titles
          </button>
        </form>

        <div>
          <p className="mb-3 text-xs text-muted">
            {rows.length} on your timeline ·{" "}
            {source === "account" ? "synced to your account" : "stored on this device"}
          </p>
          {message ? <p className="mb-3 text-sm text-navy">{message}</p> : null}
          {timeline.length === 0 ? (
            <div className="rounded-card border border-dashed border-navy/20 bg-surface px-5 py-10 text-sm text-muted">
              Add a date you are tracking, or start with the five common planning
              titles. Confirm every date with your employer.
            </div>
          ) : (
            <ol className="relative space-y-4 border-l-2 border-navy/15 pl-6">
              {timeline.map((row) => {
                const days = calendarDaysUntil(row.dueOn);
                const severity = plannerSeverity(days);
                return (
                  <li key={row.id} className="relative">
                    <span
                      className={`absolute -left-[1.9rem] top-3 h-3 w-3 rounded-full ${dotClass(severity)}`}
                    />
                    <article className="rounded-card border border-muted/20 bg-surface px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-navy">{row.title}</p>
                          <p className="text-sm text-muted">
                            {row.dueOn || "No date yet — confirm before you rely on this"}
                          </p>
                          {row.notes ? (
                            <p className="mt-1 text-sm">{row.notes}</p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <DaysChip days={days} />
                          <button
                            type="button"
                            onClick={() => void remove(row.id)}
                            className="text-sm text-muted underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function persistH1b(h1b: H1bDeadline[]) {
  const next = readPreview();
  next.h1b = h1b;
  writePreview(next);
}

function mapDeadline(row: {
  id: string;
  title: string;
  due_on: string | null;
  notes: string | null;
}): H1bDeadline {
  return {
    id: row.id,
    title: row.title,
    dueOn: row.due_on ?? "",
    notes: row.notes ?? "",
  };
}

function DaysChip({ days }: { days: number | null }) {
  if (days === null) {
    return (
      <span className="rounded-pill bg-navy/10 px-2 py-1 text-xs font-semibold text-navy">
        Date TBD
      </span>
    );
  }
  if (days < 0) {
    return (
      <span className="rounded-pill bg-critical/10 px-2 py-1 text-xs font-semibold text-critical">
        {Math.abs(days)}d ago
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="rounded-pill bg-critical/10 px-2 py-1 text-xs font-semibold text-critical">
        Due today
      </span>
    );
  }
  const tone =
    days <= 7
      ? "bg-critical/10 text-critical"
      : days <= 30
        ? "bg-warning/20 text-ink"
        : "bg-safe/15 text-safe";
  return (
    <span className={`rounded-pill px-2 py-1 text-xs font-semibold ${tone}`}>
      {days}d left
    </span>
  );
}

function dotClass(severity: ReturnType<typeof plannerSeverity>) {
  if (severity === "critical") return "bg-critical";
  if (severity === "warning") return "bg-warning";
  if (severity === "safe") return "bg-safe";
  return "bg-muted";
}

async function syncLocalDeadlines(
  supabase: SupabaseClient,
  studentId: string,
  local: H1bDeadline[],
) {
  const { data } = await supabase
    .from("h1b_deadlines")
    .select("title")
    .eq("student_id", studentId);
  const have = new Set((data ?? []).map((row) => row.title));
  const missing = local.filter((row) => row.title && !have.has(row.title));
  if (!missing.length) return;
  await supabase.from("h1b_deadlines").insert(
    missing.map((row) => ({
      student_id: studentId,
      title: row.title,
      due_on: row.dueOn || null,
      notes: row.notes || null,
    })),
  );
}
