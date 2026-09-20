import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PushTokenForm } from "./PushTokenForm";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <p className="mb-4 max-w-xl text-sm text-muted">
        Account deletion in Supabase Auth cascades student data, USCIS cases,
        H-1B dates, and Expo push tokens.
      </p>
      <PushTokenForm />
    </AppShell>
  );
}
