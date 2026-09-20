import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { createMobileClient } from "./supabase";
import { ensureStudent } from "./student";
import { useAuth } from "./auth";
import { Field, Notice, PrimaryButton, Screen } from "./ui";
import { ORGANIZER_LINE, tokens } from "./theme";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { refresh, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setMessage(null);
    const supabase = createMobileClient();
    if (!supabase) {
      setMessage(
        "Supabase keys are not configured yet. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. You can still use clocks, SEVIS, USCIS, and H-1B on this device.",
      );
      setBusy(false);
      return;
    }

    if (method === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: "statuspass://login" },
      });
      setMessage(error ? error.message : "Check your email for the sign-in link.");
      setBusy(false);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.session) {
        await ensureStudent(supabase);
        await refresh();
        router.replace("/");
        return;
      } else {
        setMessage("Account created. Confirm the email if prompted, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        await ensureStudent(supabase);
        await refresh();
        router.replace("/");
        return;
      }
    }
    setBusy(false);
  }

  return (
    <Screen title={mode === "signup" ? "Start free with your OPT clock." : "Welcome back"}>
      {!configured ? (
        <Notice>
          Auth is optional until Supabase env is set. The organizer tabs work in
          guest mode.
        </Notice>
      ) : null}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => setMethod("password")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: method === "password" ? tokens.navy : tokens.surface,
          }}
        >
          <Text style={{ color: method === "password" ? "#fff" : tokens.muted, fontWeight: "600" }}>
            Email + Password
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMethod("magic")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: method === "magic" ? tokens.navy : tokens.surface,
          }}
        >
          <Text style={{ color: method === "magic" ? "#fff" : tokens.muted, fontWeight: "600" }}>
            Magic Link
          </Text>
        </Pressable>
      </View>
      <Field
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {method === "password" ? (
        <Field
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      ) : null}
      <PrimaryButton
        label={mode === "signup" ? "Start free with your OPT clock." : "Log in"}
        onPress={() => void onSubmit()}
        disabled={busy}
      />
      <Notice>
        <Text style={{ fontWeight: "700", color: tokens.navy }}>Important: </Text>
        {ORGANIZER_LINE}
      </Notice>
      {message ? <Text style={{ color: tokens.navy }}>{message}</Text> : null}
      {mode === "signup" ? (
        <Link href="/login">
          <Text style={{ color: tokens.teal, fontWeight: "700" }}>Already have an account? Log in</Text>
        </Link>
      ) : (
        <Link href="/signup">
          <Text style={{ color: tokens.teal, fontWeight: "700" }}>
            New here? Start free with your OPT clock.
          </Text>
        </Link>
      )}
    </Screen>
  );
}
