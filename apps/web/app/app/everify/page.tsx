import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { EverifySearch } from "./EverifySearch";

export const metadata: Metadata = {
  title: "E-Verify search",
  robots: { index: false, follow: false },
};

export default function EverifyPage() {
  return (
    <AppShell title="E-Verify employer search">
      <EverifySearch />
    </AppShell>
  );
}
