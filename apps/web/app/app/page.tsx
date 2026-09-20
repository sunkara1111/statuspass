import Link from "next/link";
import { exampleGuestClocks } from "@statuspass/compliance";
import { DeadlineCard, StatusClock } from "@statuspass/ui";
import { AppShell } from "@/components/AppShell";
import { isSupabaseConfigured } from "@/lib/site";

export default function DashboardPage() {
  const guest = exampleGuestClocks();
  const preview = !isSupabaseConfigured();

  return (
    <AppShell title="Your clocks">
      {preview ? (
        <p className="mb-4 rounded-card border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Preview mode — add Supabase keys to persist a real student graph.
          Example clocks below use the shared compliance package.
        </p>
      ) : (
        <p className="mb-4 text-sm text-muted">
          Next action: confirm employment dates so unemployment stays accurate.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-3">
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
          ["/app/sevis", "SEVIS self-status"],
          ["/app/cases", "USCIS cases"],
          ["/app/h1b", "H-1B organizer"],
          ["/app/i765", "I-765 (Pro stub)"],
          ["/app/i983", "I-983 (Pro stub)"],
          ["/app/everify", "E-Verify search (Pro stub)"],
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
