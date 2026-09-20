import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { H1bForm } from "./H1bForm";

export const metadata: Metadata = {
  title: "H-1B organizer",
  robots: { index: false, follow: false },
};

export default function H1bPage() {
  return (
    <AppShell title="H-1B docs & timeline">
      <H1bForm />
    </AppShell>
  );
}
