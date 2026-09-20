import type { Metadata } from "next";
import { ChecklistRow } from "@statuspass/ui";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <AppShell title="Incoming F-1 to STEM OPT">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Linear stepper. You only need the stage you are in. Confirm details with
        your DSO.
      </p>
      <section className="mb-8 rounded-card bg-surface p-5">
        <h2 className="font-serif text-xl text-navy">A — Incoming F-1</h2>
        <ChecklistRow title="Visa interview prep" body="DS-160, I-20, SEVIS I-901, ties-to-home notes." />
        <ChecklistRow title="No-SSN US bank catalog" body="Catalog offers, not a hard sell." />
        <ChecklistRow title="eSIM for landing week" />
        <ChecklistRow title="Roommate profile" body="University, arrive-on, budget." />
      </section>
      <section className="mb-8 rounded-card bg-surface p-5">
        <h2 className="font-serif text-xl text-navy">B — Enrolled / CPT</h2>
        <ChecklistRow title="Confirm I-20 dates" />
        <ChecklistRow title="Add CPT employment" body="Full-time CPT starts the 364-day clock." />
        <ChecklistRow title="SSN request letter draft" />
      </section>
      <section className="mb-8 rounded-card bg-surface p-5">
        <h2 className="font-serif text-xl text-navy">C — 12-month OPT</h2>
        <ChecklistRow title="I-765 helper" body="Reject flags before you treat a packet as ready." />
        <ChecklistRow title="90-day unemployment clock" body="Starts the day after EAD valid-from if you have no qualifying job." />
      </section>
      <section className="rounded-card bg-surface p-5">
        <h2 className="font-serif text-xl text-navy">D — STEM OPT</h2>
        <ChecklistRow title="I-983 draft from CIP + job" />
        <ChecklistRow title="Employer E-Verify check" />
        <ChecklistRow title="12- and 24-month eval timers" />
      </section>
    </AppShell>
  );
}
