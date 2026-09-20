import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { i765FeeCents } from "@/lib/site";
import { I765Form } from "./I765Form";

export const metadata: Metadata = {
  title: "I-765 helper",
  robots: { index: false, follow: false },
};

export default function I765Page() {
  return (
    <AppShell title="I-765 autofill">
      <I765Form feeCents={i765FeeCents()} />
    </AppShell>
  );
}
