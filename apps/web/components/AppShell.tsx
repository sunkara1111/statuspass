import Link from "next/link";
import { ORGANIZER_LINE } from "@/lib/site";

const NAV = [
  { href: "/app", label: "Clocks" },
  { href: "/app/sevis", label: "SEVIS" },
  { href: "/app/cases", label: "USCIS" },
  { href: "/app/h1b", label: "H-1B" },
  { href: "/app/i765", label: "I-765" },
  { href: "/app/i983", label: "I-983" },
  { href: "/app/everify", label: "E-Verify" },
  { href: "/app/onboarding", label: "Onboarding" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted/20 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="font-serif text-xl font-semibold text-navy">
            StatusPass
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-pill px-3 py-1 text-muted hover:bg-navy/5 hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-serif text-3xl font-semibold text-navy">{title}</h1>
        <p className="mt-2 text-sm text-muted">{ORGANIZER_LINE}</p>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
