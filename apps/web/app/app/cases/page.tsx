import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { CasesForm } from "./CasesForm";

export const metadata: Metadata = {
  title: "USCIS cases",
  robots: { index: false, follow: false },
};

export default function CasesPage() {
  return (
    <AppShell title="USCIS case helper">
      <CasesForm />
    </AppShell>
  );
}
