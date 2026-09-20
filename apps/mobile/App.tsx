import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

const TOKENS = {
  background: "#F7F4EE",
  surface: "#FFFFFF",
  navy: "#1E3A5F",
  teal: "#2A9D8F",
  muted: "#5C6773",
  ink: "#1B2430",
  safe: "#2F9E44",
  warning: "#E6A817",
};

type Tab = "clocks" | "sevis" | "uscis" | "h1b";

const TABS: { id: Tab; label: string }[] = [
  { id: "clocks", label: "Clocks" },
  { id: "sevis", label: "SEVIS" },
  { id: "uscis", label: "USCIS" },
  { id: "h1b", label: "H-1B" },
];

/**
 * Expo organizer shell. Tokens match web. Do not share RN views with Next.js.
 * Push: POST the Expo token to apps/web /api/push-tokens after auth.
 */
export default function App() {
  const [tab, setTab] = useState<Tab>("clocks");
  const [sevisId, setSevisId] = useState("");
  const [selfStatus, setSelfStatus] = useState("unset");
  const [receipt, setReceipt] = useState("");
  const [cases, setCases] = useState<{ id: string; receipt: string }[]>([]);
  const [deadline, setDeadline] = useState("");
  const [dates, setDates] = useState<{ id: string; title: string }[]>([]);

  const body = useMemo(() => {
    if (tab === "sevis") {
      return (
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: TOKENS.navy }}>
            SEVIS wallet
          </Text>
          <Text style={{ color: TOKENS.muted }}>
            Self-reported only. This app never looks up SEVIS or ICE.
          </Text>
          <TextInput
            value={sevisId}
            onChangeText={setSevisId}
            placeholder="N0000000000"
            autoCapitalize="characters"
            style={inputStyle}
          />
          {(["unset", "active", "escalate_dso"] as const).map((value) => (
            <Pressable
              key={value}
              onPress={() => setSelfStatus(value)}
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor:
                  selfStatus === value ? "#2A9D8F20" : TOKENS.surface,
              }}
            >
              <Text style={{ color: TOKENS.navy, fontWeight: "600" }}>
                {value === "unset"
                  ? "Not set yet"
                  : value === "active"
                    ? "I believe SEVIS is active"
                    : "I need to talk to my DSO"}
              </Text>
            </Pressable>
          ))}
          <Text style={{ color: TOKENS.ink }}>
            Wallet: {sevisId || "add ID"} · {selfStatus}
          </Text>
        </View>
      );
    }
    if (tab === "uscis") {
      return (
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: TOKENS.navy }}>
            USCIS case helper
          </Text>
          <Text style={{ color: TOKENS.muted }}>
            Official case status lives on USCIS. We only store the receipt you
            type.
          </Text>
          <TextInput
            value={receipt}
            onChangeText={setReceipt}
            placeholder="IOE1234567890"
            autoCapitalize="characters"
            style={inputStyle}
          />
          <Pressable
            onPress={() => {
              const value = receipt.trim().toUpperCase();
              if (!/^[A-Z]{3}[0-9]{10}$/.test(value)) return;
              setCases((prev) => [{ id: value, receipt: value }, ...prev]);
              setReceipt("");
            }}
            style={buttonStyle}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Save receipt</Text>
          </Pressable>
          {cases.map((row) => (
            <Text key={row.id} style={{ color: TOKENS.navy, fontWeight: "600" }}>
              {row.receipt}
            </Text>
          ))}
        </View>
      );
    }
    if (tab === "h1b") {
      return (
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: TOKENS.navy }}>
            H-1B timeline
          </Text>
          <Text style={{ color: TOKENS.muted }}>
            Planner only. StatusPass does not file petitions.
          </Text>
          <TextInput
            value={deadline}
            onChangeText={setDeadline}
            placeholder="Registration window"
            style={inputStyle}
          />
          <Pressable
            onPress={() => {
              if (!deadline.trim()) return;
              setDates((prev) => [
                { id: deadline, title: deadline.trim() },
                ...prev,
              ]);
              setDeadline("");
            }}
            style={buttonStyle}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Add deadline</Text>
          </Pressable>
          {dates.map((row) => (
            <Text key={row.id} style={{ color: TOKENS.navy, fontWeight: "600" }}>
              {row.title}
            </Text>
          ))}
        </View>
      );
    }
    return (
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: TOKENS.navy }}>
          Your clocks
        </Text>
        <Clock label="CPT full-time" remaining={272} limit={364} color={TOKENS.safe} />
        <Clock label="OPT unemployment" remaining={25} limit={90} color={TOKENS.warning} />
        <Clock label="STEM OPT unemployment" remaining={48} limit={60} color={TOKENS.safe} />
        <Text style={{ color: TOKENS.muted }}>
          Example clocks. Add employment dates on web to replace them.
        </Text>
      </View>
    );
  }, [tab, sevisId, selfStatus, receipt, cases, deadline, dates]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TOKENS.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120, gap: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: TOKENS.navy }}>
          StatusPass
        </Text>
        {body}
        <Text style={{ color: TOKENS.muted, lineHeight: 20 }}>
          Compliance organizer for F-1 / CPT / OPT / STEM OPT. Not a law firm or
          DSO. Founded by DINESH S.
        </Text>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 12,
          backgroundColor: TOKENS.surface,
          borderTopColor: "#5C677320",
          borderTopWidth: 1,
        }}
      >
        {TABS.map((item) => (
          <Pressable key={item.id} onPress={() => setTab(item.id)}>
            <Text
              style={{
                color: tab === item.id ? TOKENS.teal : TOKENS.muted,
                fontWeight: "700",
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function Clock({
  label,
  remaining,
  limit,
  color,
}: {
  label: string;
  remaining: number;
  limit: number;
  color: string;
}) {
  return (
    <View
      style={{
        backgroundColor: TOKENS.surface,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text style={{ color: TOKENS.muted, fontWeight: "600" }}>{label}</Text>
      <Text style={{ color, fontSize: 28, fontWeight: "700" }}>
        {remaining}
        <Text style={{ fontSize: 14, color: TOKENS.muted }}> / {limit} left</Text>
      </Text>
    </View>
  );
}

const inputStyle = {
  backgroundColor: TOKENS.surface,
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  color: TOKENS.ink,
} as const;

const buttonStyle = {
  backgroundColor: TOKENS.teal,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center" as const,
};
