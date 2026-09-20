import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { I983Form } from "./I983Form";

export const metadata: Metadata = {
  title: "I-983 helper",
  robots: { index: false, follow: false },
};

export default function I983Page() {
  return (
    <AppShell title="I-983 generator">
      <I983Form />
    </AppShell>
  );
}
