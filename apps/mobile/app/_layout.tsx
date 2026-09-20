import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/auth";
import { tokens } from "../src/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: tokens.navy },
          headerTintColor: tokens.cream,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: tokens.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Log in", presentation: "modal" }} />
        <Stack.Screen name="signup" options={{ title: "Get started", presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="i765" options={{ title: "I-765 helper" }} />
        <Stack.Screen name="more" options={{ title: "More tools" }} />
      </Stack>
    </AuthProvider>
  );
}
