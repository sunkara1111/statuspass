import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { OnboardingTracks } from "@/components/OnboardingTracks";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <AppShell title="Incoming F-1 to STEM OPT">
      <OnboardingTracks />
    </AppShell>
  );
}
