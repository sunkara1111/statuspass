import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import {
  calendarDaysUntil,
  exampleGuestClocks,
  plannerSeverity,
} from "@statuspass/compliance";
import { useAuth } from "../../src/auth";
import { nextH1b, readPreview, type H1bDeadline, type SevisWallet, type UscisCase } from "../../src/preview";
import { Card, Notice, Screen } from "../../src/ui";
import { tokens } from "../../src/theme";

export default function ClocksScreen() {
  const { configured, user } = useAuth();
  const guest = exampleGuestClocks();
  const [sevis, setSevis] = useState<SevisWallet>({
    sevisId: "",
    selfStatus: "unset",
    universityName: "",
  });
  const [cases, setCases] = useState<UscisCase[]>([]);
  const [deadline, setDeadline] = useState<H1bDeadline | null>(null);

  useEffect(() => {
    void readPreview().then((preview) => {
      setSevis(preview.sevis);
      setCases(preview.cases);
      setDeadline(nextH1b(preview.h1b));
    });
  }, []);

  const days = deadline ? calendarDaysUntil(deadline.dueOn) : null;
  const tone = plannerSeverity(days);
  const sevisLabel =
    sevis.selfStatus === "active"
      ? "I believe SEVIS is active"
      : sevis.selfStatus === "escalate_dso"
        ? "Talk to your DSO"
        : "Self-status not set";

  return (
    <Screen title="Your clocks">
      <Notice>
        {configured
          ? user
            ? "Signed in. Keep employment dates current so unemployment stays accurate."
            : "Supabase is configured. Sign in to sync your student record, or keep using this device."
          : "Working on this device. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to sync an account. The organizer still works."}
      </Notice>

      {guest.clocks.map((clock) => (
        <Card key={clock.kind}>
          <Text style={{ color: tokens.muted, fontWeight: "600" }}>{clock.label}</Text>
          <Text
            style={{
              color:
                clock.severity === "critical"
                  ? tokens.critical
                  : clock.severity === "warning"
                    ? tokens.warning
                    : tokens.safe,
              fontSize: 28,
              fontWeight: "700",
            }}
          >
            {clock.remaining}
            <Text style={{ fontSize: 14, color: tokens.muted }}>
              {" "}
              / {clock.limit} left
            </Text>
          </Text>
          <Text style={{ color: tokens.muted, fontSize: 12 }}>
            {clock.policySource} · {guest.timezone}
          </Text>
        </Card>
      ))}
      <Text style={{ color: tokens.muted, fontSize: 12 }}>
        Example clocks from the shared compliance package. Add employment dates
        after you sign in to replace them with yours.
      </Text>

      <LinkCard href="/sevis" kicker="SEVIS wallet" title={sevis.sevisId || "Add your SEVIS ID"} body={sevisLabel} />
      <LinkCard
        href="/cases"
        kicker="USCIS case helper"
        title={
          cases.length
            ? `${cases.length} receipt${cases.length === 1 ? "" : "s"} saved`
            : "No receipts yet"
        }
        body="Official USCIS deep-link only. We never scrape status."
      />
      <LinkCard
        href="/h1b"
        kicker="H-1B timeline"
        title={deadline?.title ?? "Plan the next date"}
        body={deadlineBody(deadline, days, tone)}
      />

      <View style={{ flexDirection: "row", gap: 16, marginTop: 4 }}>
        <Link href="/more" asChild>
          <Pressable>
            <Text style={{ color: tokens.teal, fontWeight: "700" }}>More tools</Text>
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable>
            <Text style={{ color: tokens.teal, fontWeight: "700" }}>Settings</Text>
          </Pressable>
        </Link>
        {!user ? (
          <Link href="/login" asChild>
            <Pressable>
              <Text style={{ color: tokens.teal, fontWeight: "700" }}>Log in</Text>
            </Pressable>
          </Link>
        ) : null}
      </View>
    </Screen>
  );
}

function LinkCard({
  href,
  kicker,
  title,
  body,
}: {
  href: "/sevis" | "/cases" | "/h1b";
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable>
        <Card>
          <Text style={{ color: tokens.teal, fontSize: 11, fontWeight: "700" }}>
            {kicker.toUpperCase()}
          </Text>
          <Text style={{ color: tokens.navy, fontSize: 18, fontWeight: "700" }}>
            {title}
          </Text>
          <Text style={{ color: tokens.muted, fontSize: 13 }}>{body}</Text>
        </Card>
      </Pressable>
    </Link>
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
  if (tone === "critical" && days < 0) {
    return `${Math.abs(days)} days past the date you entered.`;
  }
  if (days === 0) return "Due today on your planner.";
  return `${days} days left on your planner.`;
}
