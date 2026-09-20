import { useEffect, useMemo, useState } from "react";
import { Pressable, Text } from "react-native";
import {
  H1B_STARTER_ITEMS,
  calendarDaysUntil,
  plannerSeverity,
} from "@statuspass/compliance";
import { useAuth } from "../../src/auth";
import {
  newId,
  readPreview,
  writePreview,
  type H1bDeadline,
} from "../../src/preview";
import { createMobileClient } from "../../src/supabase";
import { ensureStudent } from "../../src/student";
import { Card, Field, Notice, PrimaryButton, Screen } from "../../src/ui";
import { tokens } from "../../src/theme";

export default function H1bScreen() {
  const { student } = useAuth();
  const [rows, setRows] = useState<H1bDeadline[]>([]);
  const [title, setTitle] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const preview = await readPreview();
      setRows(preview.h1b);
      const supabase = createMobileClient();
      if (!supabase || !student) return;
      const { data } = await supabase
        .from("h1b_deadlines")
        .select("id, title, due_on, notes")
        .eq("student_id", student.id)
        .order("due_on", { ascending: true, nullsFirst: false });
      if (!data) return;
      const mapped = data.map(mapDeadline);
      const next = await readPreview();
      next.h1b = mapped;
      await writePreview(next);
      setRows(mapped);
      setSource("account");
    })();
  }, [student]);

  const timeline = useMemo(
    () =>
      rows.slice().sort((a, b) => {
        if (a.dueOn && b.dueOn) return a.dueOn.localeCompare(b.dueOn);
        if (a.dueOn) return -1;
        if (b.dueOn) return 1;
        return a.title.localeCompare(b.title);
      }),
    [rows],
  );

  async function saveRow(row: H1bDeadline) {
    setBusy(true);
    let stored = row;
    const supabase = createMobileClient();
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
    const preview = await readPreview();
    preview.h1b = [stored, ...preview.h1b.filter((item) => item.id !== stored.id)];
    await writePreview(preview);
    setRows(preview.h1b);
    setMessage("Saved. This is a planner only — StatusPass does not file H-1B petitions.");
    setBusy(false);
  }

  async function add() {
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
    const preview = await readPreview();
    for (const item of H1B_STARTER_ITEMS) {
      if (preview.h1b.some((row) => row.title === item.title)) continue;
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

  async function remove(id: string) {
    const supabase = createMobileClient();
    if (supabase && student) {
      await supabase.from("h1b_deadlines").delete().eq("id", id);
    }
    const preview = await readPreview();
    preview.h1b = preview.h1b.filter((row) => row.id !== id);
    await writePreview(preview);
    setRows(preview.h1b);
  }

  return (
    <Screen title="H-1B timeline">
      <Notice>
        User-entered H-1B planning dates. Not a filing product and not legal
        representation.
      </Notice>
      <Field
        label="Deadline"
        value={title}
        placeholder="Registration window opens"
        onChangeText={setTitle}
      />
      <Field
        label="Due on (YYYY-MM-DD)"
        value={dueOn}
        placeholder="2026-03-01"
        onChangeText={setDueOn}
      />
      <Field label="Notes" value={notes} placeholder="Confirm with employer" onChangeText={setNotes} />
      <PrimaryButton label="Add deadline" onPress={() => void add()} disabled={busy} />
      <Pressable onPress={() => void addStarter()}>
        <Text style={{ color: tokens.teal, fontWeight: "700" }}>Use starter titles</Text>
      </Pressable>
      <Text style={{ color: tokens.muted, fontSize: 12 }}>
        {rows.length} on your timeline ·{" "}
        {source === "account" ? "synced to your account" : "stored on this device"}
      </Text>
      {message ? <Text style={{ color: tokens.navy }}>{message}</Text> : null}
      {timeline.length === 0 ? (
        <Card>
          <Text style={{ color: tokens.muted }}>
            Add a date you are tracking, or start with the five common planning
            titles. Confirm every date with your employer.
          </Text>
        </Card>
      ) : (
        timeline.map((row) => {
          const days = calendarDaysUntil(row.dueOn);
          const severity = plannerSeverity(days);
          const color =
            severity === "critical"
              ? tokens.critical
              : severity === "warning"
                ? tokens.warning
                : severity === "safe"
                  ? tokens.safe
                  : tokens.muted;
          return (
            <Card key={row.id}>
              <Text style={{ color: tokens.navy, fontWeight: "700" }}>{row.title}</Text>
              <Text style={{ color: tokens.muted }}>
                {row.dueOn || "No date yet — confirm before you rely on this"}
              </Text>
              {row.notes ? <Text>{row.notes}</Text> : null}
              <Text style={{ color, fontWeight: "700" }}>
                {days === null
                  ? "Date TBD"
                  : days < 0
                    ? `${Math.abs(days)}d ago`
                    : days === 0
                      ? "Due today"
                      : `${days}d left`}
              </Text>
              <Pressable onPress={() => void remove(row.id)}>
                <Text style={{ color: tokens.muted }}>Remove</Text>
              </Pressable>
            </Card>
          );
        })
      )}
    </Screen>
  );
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
