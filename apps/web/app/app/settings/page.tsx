import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PushTokenStub } from "./PushTokenStub";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <p className="mb-4 max-w-xl text-sm text-muted">
        Account deletion cascades student data and Expo push tokens. Use
        Supabase Auth when keys are configured.
      </p>
      <PushTokenStub />
    </AppShell>
  );
}
