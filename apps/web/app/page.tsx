import Link from "next/link";
import { exampleGuestClocks } from "@statuspass/compliance";
import { StatusClock } from "@statuspass/ui";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  const guest = exampleGuestClocks();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader ctaHref="/signup" ctaLabel="Get Started" />

      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 text-center">
        <div className="mb-6 inline-block rounded-pill bg-teal/20 px-4 py-1.5 text-sm font-medium text-teal">
          For F-1, OPT & STEM OPT Students
        </div>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-navy md:text-6xl">
          Stop Worrying About
          <br />
          Compliance Deadlines
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
          StatusPass tracks your CPT days, OPT unemployment, and STEM extension
          in your program timezone. One next action. Free clocks forever.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-card bg-teal px-8 py-3.5 text-lg font-semibold text-white"
        >
          Start free with your OPT clock.
        </Link>
        <p className="mt-4 text-sm text-muted">
          No credit card · Disclaimer sits beside signup, not only the footer
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal">
            Always Free
          </h2>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">
            Real-time compliance clocks
          </p>
          <p className="mt-3 font-semibold text-navy">
            Clocks + danger alerts + SEVIS wallet + case-status helper + H-1B
            docs & timeline organizer: free forever
          </p>
          <p className="mt-2 text-sm text-muted">
            Example clocks — one green, one amber, plus STEM. Sign in to track
            yours. These are illustrations, not other students&apos; data.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {guest.clocks.map((clock) => (
            <StatusClock
              key={clock.kind}
              label={clock.label}
              remaining={clock.remaining}
              limit={clock.limit}
              used={clock.used}
              severity={clock.severity}
              caption={`${clock.policySource} · ${guest.timezone}`}
            />
          ))}
        </div>
        <div className="mt-8 rounded-card border border-safe bg-safe/10 p-6 text-center text-ink">
          <p className="font-medium">
            ✓ Calendar days in your program timezone (default America/New_York)
          </p>
          <p className="mt-2 font-medium">
            ✓ Amber at ≤30 days left (or CPT ≥340). Red + push only at ≤7 or a
            hard cap.
          </p>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-serif text-3xl font-semibold text-navy">
            How StatusPass keeps you organized
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Connect your status",
                d: "Add I-20 dates, CPT records, and employment. Day math lives in one place — never inline in the UI.",
              },
              {
                n: "2",
                t: "See the next action",
                d: "CPT 364 hard alert. OPT 90-day unemployment. STEM adds 60. One primary action per screen.",
              },
              {
                n: "3",
                t: "Get alerts early",
                d: "Green when safe, amber at ≤30 days (or CPT ≥340), red at ≤7 days. Danger color only on the clock and banner.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
                  {step.n}
                </div>
                <h3 className="text-xl font-semibold text-ink">{step.t}</h3>
                <p className="mt-2 text-muted">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[20px] border-2 border-navy bg-surface p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-pill bg-navy px-4 py-1 text-sm font-semibold text-white">
              STATUSPASS PRO
            </div>
            <h2 className="font-serif text-3xl font-semibold text-navy">
              Need more than tracking?
            </h2>
            <p className="mt-2 text-lg text-muted">
              Clocks + danger alerts: free forever. Then Pro I-765 / I-983 /
              E-Verify.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <ProCard
              href="/app/i765"
              title="I-765 Autofill"
              body="Prepare an EAD packet with inline reject flags. Not a filing."
            />
            <ProCard
              href="/app/i983"
              title="I-983 Generator"
              body="Draft STEM training sections from CIP + job description."
            />
            <ProCard
              href="/app/everify"
              title="E-Verify Search"
              body="Look up the sample employer catalog. SAMPLE badge on every sample row."
            />
          </div>
        </div>
      </section>

      <section className="bg-navy px-6 py-14 text-center">
        <h2 className="font-serif text-4xl font-semibold text-white">
          Start with your OPT clock
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">
          Free CPT, OPT, and STEM clocks before you pay for anything.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-card bg-teal px-8 py-3.5 text-lg font-semibold text-white"
        >
          Start free with your OPT clock.
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}

function ProCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="block rounded-card p-1 hover:bg-background">
      <h3 className="text-lg font-semibold text-navy">✓ {title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </Link>
  );
}
