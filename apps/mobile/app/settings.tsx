import { Text } from "react-native";
import * as Linking from "expo-linking";
import { useAuth } from "../src/auth";
import {
  FALLBACK_PRIVACY_URL,
  FALLBACK_URL,
  PRIVACY_URL,
  SITE_URL,
} from "../src/config";
import { Card, GhostButton, Notice, PrimaryButton, Screen } from "../src/ui";
import { FOUNDER_LINE, tokens } from "../src/theme";

export default function SettingsScreen() {
  const { user, configured, signOut } = useAuth();

  return (
    <Screen title="Settings">
      <Notice>
        StatusPass is not listed on the App Store or Play Store yet. This build
        is ready for the owner to submit with their Apple Developer and Google
        Play accounts.
      </Notice>
      <Card>
        <Text style={{ color: tokens.navy, fontWeight: "700" }}>Account</Text>
        <Text style={{ color: tokens.muted }}>
          {configured
            ? user?.email ?? "Signed out — guest mode on this device"
            : "Supabase env is not set. Guest mode only."}
        </Text>
        {user ? (
          <PrimaryButton label="Sign out" onPress={() => void signOut()} />
        ) : null}
      </Card>
      <Card>
        <Text style={{ color: tokens.navy, fontWeight: "700" }}>Privacy</Text>
        <GhostButton label="Open privacy policy" onPress={() => void Linking.openURL(PRIVACY_URL)} />
        <GhostButton
          label="Fallback privacy page"
          onPress={() => void Linking.openURL(FALLBACK_PRIVACY_URL)}
        />
        <Text style={{ color: tokens.muted, fontSize: 12 }}>
          {PRIVACY_URL} · fallback {FALLBACK_PRIVACY_URL}
        </Text>
      </Card>
      <Card>
        <Text style={{ color: tokens.navy, fontWeight: "700" }}>Web organizer</Text>
        <GhostButton
          label="Open StatusPass on the web"
          onPress={() => void Linking.openURL(`${SITE_URL}/app`)}
        />
        <GhostButton
          label="Open Vercel fallback"
          onPress={() => void Linking.openURL(`${FALLBACK_URL}/app`)}
        />
      </Card>
      <Text style={{ color: tokens.muted }}>{FOUNDER_LINE}</Text>
    </Screen>
  );
}
