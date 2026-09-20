import Link from "next/link";
import { FOUNDER_LINE, ORGANIZER_LINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-muted/20 bg-surface px-6 py-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-muted">
        <p className="mb-4 font-medium text-critical">
          {ORGANIZER_LINE} For legal advice, consult an immigration attorney.
        </p>
        <p className="mb-2">
          <Link href="/terms" className="mr-4 underline">
            Terms
          </Link>
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
        </p>
        <p className="mb-2">{FOUNDER_LINE}</p>
        <p>© 2026 StatusPass. All rights reserved.</p>
      </div>
    </footer>
  );
}
