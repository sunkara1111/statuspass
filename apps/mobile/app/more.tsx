import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { Card, Screen } from "../src/ui";
import { tokens } from "../src/theme";

const LINKS = [
  { href: "/i765", label: "I-765 packet check", body: "Reject-flag helper. Not a USCIS filing." },
  { href: "/settings", label: "Settings", body: "Account, privacy, and store-ready links." },
  { href: "/login", label: "Log in", body: "Optional. Guest mode still works." },
  { href: "/signup", label: "Create account", body: "Start free with your OPT clock." },
] as const;

export default function MoreScreen() {
  return (
    <Screen title="More tools">
      {LINKS.map((item) => (
        <Link key={item.href} href={item.href} asChild>
          <Pressable>
            <Card>
              <Text style={{ color: tokens.navy, fontWeight: "700", fontSize: 16 }}>
                {item.label}
              </Text>
              <Text style={{ color: tokens.muted }}>{item.body}</Text>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}
