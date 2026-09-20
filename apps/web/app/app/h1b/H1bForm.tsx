"use client";

import { useEffect, useState } from "react";
import {
  newId,
  readPreview,
  writePreview,
  type H1bDeadline,
} from "@/lib/preview-store";
import { createClient } from "@/lib/supabase/client";

export function H1bForm() {
  const [rows, setRows] = useState<H1bDeadline[]>([]);
  const [title, setTitle] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setRows(readPreview().h1b);
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Give this deadline a name.");
      return;
    }
    const row: H1bDeadline = {
      id: newId(),
      title: title.trim(),
      dueOn,
      notes: notes.trim(),
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
          const { error } = await supabase.from("h1b_deadlines").insert({
            student_id: student.id,
            title: row.title,
            due_on: row.dueOn || null,
            notes: row.notes || null,
          });
          if (error) {
            setMessage(error.message);
            return;
          }
        }
      }
    }

    const next = readPreview();
    next.h1b = [row, ...next.h1b];
    writePreview(next);
    setRows(next.h1b);
    setTitle("");
    setDueOn("");
    setNotes("");
    setMessage("Saved. This is a planner only — StatusPass does not file H-1B petitions.");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        User-entered H-1B planning dates. Not a filing product and not legal
        representation.
      </p>
      <form onSubmit={add} className="space-y-3">
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
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white"
        >
          Add deadline
        </button>
      </form>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-card border border-muted/20 bg-surface px-4 py-3"
          >
            <p className="font-semibold text-navy">{row.title}</p>
            <p className="text-sm text-muted">{row.dueOn || "No date yet"}</p>
            {row.notes ? <p className="mt-1 text-sm">{row.notes}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
