import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SEVIS_ID_PATTERN } from "@statuspass/compliance";
import { useAuth } from "../../src/auth";
import { readPreview, writePreview, type SevisWallet } from "../../src/preview";
import { createMobileClient } from "../../src/supabase";
import { ensureStudent } from "../../src/student";
import { Card, Field, Notice, PrimaryButton, Screen } from "../../src/ui";
import { tokens } from "../../src/theme";

const STATUSES: { value: SevisWallet["selfStatus"]; label: string; detail: string }[] = [
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
];

export default function SevisScreen() {
  const { student } = useAuth();
  const [sevisId, setSevisId] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [selfStatus, setSelfStatus] = useState<SevisWallet["selfStatus"]>("unset");
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"device" | "account">("device");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const preview = await readPreview();
      setSevisId(preview.sevis.sevisId);
      setSelfStatus(preview.sevis.selfStatus);
      setUniversityName(preview.sevis.universityName);
      if (student) {
        setSevisId(student.sevis_id ?? preview.sevis.sevisId);
        setSelfStatus(student.sevis_self_status ?? preview.sevis.selfStatus);
        setUniversityName(student.university_name ?? preview.sevis.universityName);
        setSource("account");
      }
    })();
  }, [student]);

  async function save() {
    const id = sevisId.trim().toUpperCase();
    if (id && !SEVIS_ID_PATTERN.test(id)) {
      setMessage("SEVIS ID must be N followed by 10 digits.");
      return;
    }
    setBusy(true);
    const preview = await readPreview();
    preview.sevis = { sevisId: id, selfStatus, universityName: universityName.trim() };
    await writePreview(preview);

    const supabase = createMobileClient();
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

  const meta = STATUSES.find((item) => item.value === selfStatus) ?? STATUSES[0];

  return (
    <Screen title="SEVIS wallet">
      <Notice>
        Self-reported only. StatusPass never looks up SEVIS or ICE.
      </Notice>
      <Card>
        <Text style={{ color: tokens.teal, fontWeight: "700", fontSize: 12 }}>
          SEVIS WALLET
        </Text>
        <Text style={{ color: tokens.navy, fontSize: 24, fontWeight: "700" }}>
          {formatSevisId(sevisId) || "Add your SEVIS ID"}
        </Text>
        <Text style={{ color: tokens.muted }}>
          {universityName.trim() || "School name is optional"}
        </Text>
        <Text style={{ color: tokens.navy, fontWeight: "600" }}>{meta.label}</Text>
        <Text style={{ color: tokens.muted, fontSize: 13 }}>{meta.detail}</Text>
        <Text style={{ color: tokens.muted, fontSize: 12 }}>
          Stored {source === "account" ? "on your account" : "on this device"}.
        </Text>
      </Card>
      <Field
        label="SEVIS ID"
        value={sevisId}
        autoCapitalize="characters"
        placeholder="N0000000000"
        onChangeText={(value) => setSevisId(value.toUpperCase())}
      />
      <Field
        label="School or university"
        value={universityName}
        placeholder="As printed on your I-20"
        onChangeText={setUniversityName}
      />
      <View style={{ gap: 8 }}>
        {STATUSES.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setSelfStatus(item.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor:
                selfStatus === item.value ? "#2A9D8F20" : tokens.surface,
            }}
          >
            <Text style={{ color: tokens.navy, fontWeight: "700" }}>{item.label}</Text>
            <Text style={{ color: tokens.muted, fontSize: 12 }}>{item.detail}</Text>
          </Pressable>
        ))}
      </View>
      <PrimaryButton label="Save self-status" onPress={() => void save()} disabled={busy} />
      {message ? <Text style={{ color: tokens.navy }}>{message}</Text> : null}
    </Screen>
  );
}

function formatSevisId(value: string) {
  const raw = value.toUpperCase().replace(/\s/g, "");
  if (!/^N\d{0,10}$/.test(raw)) return value;
  if (raw.length < 5) return raw;
  return `${raw.slice(0, 5)} ${raw.slice(5, 8)} ${raw.slice(8)}`.trim();
}
