import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FOUNDER_LINE, ORGANIZER_LINE, tokens } from "./theme";

export function Screen({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>StatusPass</Text>
        <Text style={styles.credit}>DINESH S</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.founder}>{FOUNDER_LINE}</Text>
        {children}
        <Text style={styles.disclaimer}>{ORGANIZER_LINE}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={tokens.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && { opacity: 0.55 }]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.ghost}>
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <View style={styles.notice}>
      <Text style={styles.noticeText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.background },
  topBar: {
    backgroundColor: tokens.navy,
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: { color: tokens.cream, fontSize: 18, fontWeight: "700" },
  credit: { color: "rgba(247,244,238,0.7)", fontSize: 11, fontWeight: "600" },
  body: { padding: 16, paddingBottom: 40, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: tokens.navy },
  founder: { color: tokens.muted, fontSize: 12, marginBottom: 4 },
  card: {
    backgroundColor: tokens.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  label: { fontSize: 13, fontWeight: "600", color: tokens.ink },
  input: {
    backgroundColor: tokens.surface,
    borderColor: "#5C677333",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: tokens.ink,
    fontSize: 16,
  },
  button: {
    backgroundColor: tokens.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  ghost: { paddingVertical: 10, alignItems: "center" },
  ghostText: { color: tokens.teal, fontWeight: "700" },
  notice: {
    backgroundColor: tokens.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E3A5F26",
    padding: 12,
  },
  noticeText: { color: tokens.ink, fontSize: 14, lineHeight: 20 },
  disclaimer: { color: tokens.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
});
