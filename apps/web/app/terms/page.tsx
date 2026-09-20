import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "StatusPass terms. Compliance organizer, not a law firm or DSO. Founded by DINESH S.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="prose prose-slate mx-auto max-w-3xl px-6 py-12 text-ink">
        <p>
          <Link href="/" className="text-teal">
            Home
          </Link>
        </p>
        <h1 className="font-serif text-4xl text-navy">Terms of Service</h1>
        <p className="text-muted">Last updated: September 20, 2026</p>
        <h2>What StatusPass is</h2>
        <p>
          StatusPass is a compliance organizer for international students on
          F-1, CPT, OPT, and STEM OPT. Founded by DINESH S.
        </p>
        <p>StatusPass is not a law firm, DSO, or government agency.</p>
        <h2>What we do not do</h2>
        <ul>
          <li>No live SEVIS or ICE lookups</li>
          <li>No scraped USCIS case status — official deep-links only</li>
          <li>No H-1B petition filing</li>
          <li>No guarantee of compliance</li>
        </ul>
        <h2>Your responsibilities</h2>
        <p>
          Enter accurate dates. Confirm calculations with your DSO. Get legal
          advice from an immigration attorney when you need it.
        </p>
        <h2>Free and Pro</h2>
        <p>
          Free: clocks, danger alerts, SEVIS wallet, USCIS helper, H-1B
          organizer. Pro stubs: I-765, I-983, E-Verify search.
        </p>
        <p className="text-sm text-muted">
          StatusPass is a compliance organizer, not a law firm or DSO. Founded
          by DINESH S.
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
