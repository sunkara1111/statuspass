import { useMemo, useState } from "react";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { OfflineOrganizer } from "./OfflineOrganizer";

const TOKENS = {
  background: "#F7F4EE",
  navy: "#1E3A5F",
  teal: "#2A9D8F",
  muted: "#5C6773",
  cream: "#F7F4EE",
};

const extra = (Constants.expoConfig?.extra ?? {}) as {
  siteUrl?: string;
  fallbackUrl?: string;
};

const CANONICAL = (
  process.env.EXPO_PUBLIC_SITE_URL ||
  extra.siteUrl ||
  "https://statuspass.com"
).replace(/\/$/, "");

const FALLBACK = (
  process.env.EXPO_PUBLIC_FALLBACK_URL ||
  extra.fallbackUrl ||
  "https://temporary-prompt-pavo-7vphl3a.vercel.app"
).replace(/\/$/, "");

function organizerUrl(origin: string) {
  return `${origin}/app`;
}

type Mode = "web" | "offline";

export default function App() {
  const [origin, setOrigin] = useState(CANONICAL);
  const [mode, setMode] = useState<Mode>("web");
  const [loading, setLoading] = useState(true);

  const uri = useMemo(() => organizerUrl(origin), [origin]);

  const onFail = () => {
    if (origin === CANONICAL && FALLBACK !== CANONICAL) {
      setOrigin(FALLBACK);
      setLoading(true);
      return;
    }
    setMode("offline");
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar style={mode === "web" && !loading ? "light" : "light"} />

      {mode === "web" ? (
        <View style={styles.webWrap}>
          <WebView
            source={{ uri }}
            onLoadEnd={() => setLoading(false)}
            onError={onFail}
            onHttpError={(event) => {
              if (event.nativeEvent.statusCode >= 400) onFail();
            }}
            startInLoadingState
            applicationNameForUserAgent="StatusPassMobile/0.1"
            style={styles.webview}
          />
          {loading ? (
            <View style={styles.splash}>
              <Text style={styles.splashTitle}>StatusPass</Text>
              <Text style={styles.splashBody}>
                Opening your clocks, SEVIS wallet, USCIS helper, and H-1B
                timeline.
              </Text>
              <ActivityIndicator color={TOKENS.teal} style={{ marginTop: 16 }} />
              <Text style={styles.splashCredit}>Founded by DINESH S</Text>
              <Pressable
                onPress={() => {
                  setMode("offline");
                  setLoading(false);
                }}
                style={styles.skip}
              >
                <Text style={styles.skipText}>Use offline organizer</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.offlineWrap}>
          <SafeAreaView style={styles.brandBarWrap}>
            <View style={styles.brandBar}>
              <Text style={styles.wordmark}>StatusPass</Text>
              <Text style={styles.credit}>DINESH S</Text>
            </View>
          </SafeAreaView>
          <OfflineOrganizer />
          <SafeAreaView style={styles.brandBarWrap}>
            <Pressable
              onPress={() => {
                setOrigin(CANONICAL);
                setMode("web");
                setLoading(true);
              }}
              style={styles.skip}
            >
              <Text style={styles.liveText}>Open live StatusPass</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TOKENS.navy },
  webWrap: { flex: 1, backgroundColor: TOKENS.background },
  webview: { flex: 1, backgroundColor: TOKENS.background },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TOKENS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  splashTitle: { fontSize: 32, fontWeight: "700", color: TOKENS.navy },
  splashBody: {
    marginTop: 12,
    textAlign: "center",
    color: TOKENS.muted,
    lineHeight: 22,
  },
  splashCredit: { marginTop: 20, color: TOKENS.muted, fontSize: 13 },
  skip: { marginTop: 20, paddingVertical: 8, paddingHorizontal: 12 },
  skipText: { color: TOKENS.teal, fontWeight: "700" },
  offlineWrap: { flex: 1, backgroundColor: TOKENS.background },
  brandBarWrap: { backgroundColor: TOKENS.navy },
  brandBar: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: { color: TOKENS.cream, fontSize: 18, fontWeight: "700" },
  credit: { color: "rgba(247,244,238,0.7)", fontSize: 11, fontWeight: "600" },
  liveText: {
    color: TOKENS.cream,
    textAlign: "center",
    fontWeight: "700",
    paddingVertical: 8,
  },
});
