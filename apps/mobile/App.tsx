import { StatusBar } from "react-native";
import { SafeAreaView, Text, View, Pressable } from "react-native";

const TOKENS = {
  background: "#F7F4EE",
  navy: "#1E3A5F",
  teal: "#2A9D8F",
  muted: "#5C6773",
};

/**
 * Expo scaffold. Reimplement web primitives with these tokens.
 * Push: POST the Expo token to apps/web /api/push-tokens after auth.
 */
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TOKENS.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: TOKENS.navy }}>
          StatusPass
        </Text>
        <Text style={{ color: TOKENS.muted, lineHeight: 22 }}>
          Compliance organizer for F-1 / CPT / OPT / STEM OPT. Not a law firm or
          DSO. Founded by DINESH S.
        </Text>
        <Text style={{ color: TOKENS.navy, fontWeight: "600" }}>
          Next action: open the web clocks, then register an Expo push token.
        </Text>
        <Pressable
          style={{
            backgroundColor: TOKENS.teal,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Push token stub lives in Settings on web
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
