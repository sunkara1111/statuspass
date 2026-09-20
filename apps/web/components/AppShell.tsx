import Link from "next/link";
import { FOUNDER_LINE, ORGANIZER_LINE } from "@/lib/site";
import { AppNav } from "./AppNav";

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
          <AppNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-serif text-3xl font-semibold text-navy">{title}</h1>
        <p className="mt-2 text-sm text-muted">{ORGANIZER_LINE}</p>
        <div className="mt-6">{children}</div>
      </main>
      <footer className="border-t border-muted/20 px-6 py-6 text-center text-xs text-muted">
        {ORGANIZER_LINE} {FOUNDER_LINE}
      </footer>
    </div>
  );
}
