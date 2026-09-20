import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { SevisForm } from "./SevisForm";

export const metadata: Metadata = {
  title: "SEVIS self-status",
  robots: { index: false, follow: false },
};

export default function SevisPage() {
  return (
    <AppShell title="SEVIS wallet">
      <SevisForm />
    </AppShell>
  );
}
