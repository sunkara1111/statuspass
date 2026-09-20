import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { USCIS_RECEIPT_PATTERN } from "@statuspass/compliance";
import { useAuth } from "../../src/auth";
import {
  newId,
  readPreview,
  writePreview,
  type UscisCase,
} from "../../src/preview";
import { createMobileClient } from "../../src/supabase";
import { ensureStudent } from "../../src/student";
import { Card, Field, Notice, PrimaryButton, Screen } from "../../src/ui";
import { tokens, USCIS_CASE_STATUS_URL } from "../../src/theme";

export default function CasesScreen() {
  const { student } = useAuth();
  const [cases, setCases] = useState<UscisCase[]>([]);
  const [receipt, setReceipt] = useState("");
  const [label, setLabel] = useState("I-765");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const preview = await readPreview();
      setCases(preview.cases);
      const supabase = createMobileClient();
      if (!supabase || !student) return;
      const { data } = await supabase
        .from("uscis_cases")
        .select("id, receipt_number, label, last_opened_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false });
      if (!data) return;
      const mapped = data.map(mapCase);
      const next = await readPreview();
      next.cases = mapped;
      await writePreview(next);
      setCases(mapped);
      setSource("account");
    })();
  }, [student]);

  async function add() {
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
    const supabase = createMobileClient();
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
    const preview = await readPreview();
    const next = [row, ...preview.cases.filter((item) => item.id !== row.id)];
    preview.cases = next;
    await writePreview(preview);
    setCases(next);
    setReceipt("");
    setMessage("Saved. Open the official USCIS tool for status — we do not scrape it.");
    setBusy(false);
  }

  async function remove(id: string) {
    const supabase = createMobileClient();
    if (supabase && student) {
      await supabase.from("uscis_cases").delete().eq("id", id);
    }
    const preview = await readPreview();
    preview.cases = preview.cases.filter((row) => row.id !== id);
    await writePreview(preview);
    setCases(preview.cases);
  }

  async function openOfficial(row: UscisCase) {
    const opened = new Date().toISOString();
    const supabase = createMobileClient();
    if (supabase && student) {
      await supabase
        .from("uscis_cases")
        .update({ last_opened_at: opened })
        .eq("id", row.id);
      setSource("account");
    }
    const preview = await readPreview();
    preview.cases = preview.cases.map((item) =>
      item.id === row.id ? { ...item, lastOpenedAt: opened } : item,
    );
    await writePreview(preview);
    setCases(preview.cases);
    await Linking.openURL(USCIS_CASE_STATUS_URL);
  }

  return (
    <Screen title="USCIS case helper">
      <Notice>
        Self-reported receipt numbers only. StatusPass does not look up or
        scrape USCIS. Use the official case-status page.
      </Notice>
      <Field
        label="Receipt number"
        value={receipt}
        autoCapitalize="characters"
        placeholder="IOE1234567890"
        onChangeText={(value) => setReceipt(value.toUpperCase())}
      />
      <Field
        label="Label"
        value={label}
        placeholder="I-765"
        onChangeText={setLabel}
      />
      <PrimaryButton label="Save receipt" onPress={() => void add()} disabled={busy} />
      {message ? <Text style={{ color: tokens.navy }}>{message}</Text> : null}
      <Text style={{ color: tokens.muted, fontSize: 12 }}>
        {cases.length} saved ·{" "}
        {source === "account" ? "synced to your account" : "stored on this device"}
      </Text>
      {cases.length === 0 ? (
        <Card>
          <Text style={{ color: tokens.muted }}>
            Add a receipt to keep the official USCIS link next to it. We never
            fetch government status.
          </Text>
        </Card>
      ) : (
        cases.map((row) => (
          <Card key={row.id}>
            <Text style={{ color: tokens.navy, fontWeight: "700", letterSpacing: 0.4 }}>
              {row.receiptNumber}
            </Text>
            <Text style={{ color: tokens.muted }}>{row.label}</Text>
            <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
              <Pressable onPress={() => void openOfficial(row)}>
                <Text style={{ color: tokens.teal, fontWeight: "700" }}>
                  Open official USCIS
                </Text>
              </Pressable>
              <Pressable onPress={() => void remove(row.id)}>
                <Text style={{ color: tokens.muted }}>Remove</Text>
              </Pressable>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
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
