import Link from "next/link";
import { exampleGuestClocks } from "@statuspass/compliance";
import { DeadlineCard, StatusClock } from "@statuspass/ui";
import { AppShell } from "@/components/AppShell";
import { DashboardOverview } from "@/components/DashboardOverview";
import { isSupabaseConfigured } from "@/lib/site";

export default function DashboardPage() {
  const guest = exampleGuestClocks();
  const preview = !isSupabaseConfigured();

  return (
    <AppShell title="Your clocks">
      <DashboardOverview previewMode={preview} />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {guest.clocks.map((clock) => (
          <StatusClock
            key={clock.kind}
            label={clock.label}
            remaining={clock.remaining}
            limit={clock.limit}
            used={clock.used}
            severity={clock.severity}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Example clocks from the shared compliance package — sign in and add
        employment dates to replace them with yours.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <DeadlineCard
          title="Morning digest"
          date="Your program timezone"
          nextAction="One digest per local date. OPT and STEM hard-caps the same day stay separate."
        />
        <DeadlineCard
          title="Danger alerts"
          date="Red only on the chip and banner"
          nextAction="Push only at ≤7 days left or a hard cap."
        />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["/app/sevis", "SEVIS wallet"],
          ["/app/cases", "USCIS case helper"],
          ["/app/h1b", "H-1B docs & timeline"],
          ["/app/i765", "I-765 packet check"],
          ["/app/i983", "I-983 draft"],
          ["/app/everify", "E-Verify sample catalog"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-card border border-muted/20 bg-surface px-4 py-3 font-medium text-navy"
          >
            {label}
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
