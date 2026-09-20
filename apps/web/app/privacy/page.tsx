import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How StatusPass stores self-reported compliance data. Founded by DINESH S.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-12 text-ink">
        <p>
          <Link href="/" className="text-teal">
            Home
          </Link>
        </p>
        <h1 className="font-serif text-4xl text-navy">Privacy Policy</h1>
        <p className="mt-2 text-muted">Last updated: September 20, 2026</p>
        <p className="mt-6">
          StatusPass stores the information you enter so you can organize CPT,
          OPT, and STEM clocks. We do not perform live SEVIS or ICE lookups, do
          not scrape USCIS, and do not share your data with government agencies.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-navy">What we collect</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink">
          <li>Email and auth credentials</li>
          <li>Program dates and timezone</li>
          <li>Employment records you add</li>
          <li>Self-reported SEVIS ID and status</li>
          <li>USCIS receipt numbers you save</li>
          <li>H-1B deadlines you enter</li>
          <li>Expo push tokens you register</li>
        </ul>
        <h2 className="mt-8 font-serif text-2xl text-navy">Account deletion</h2>
        <p className="mt-3">
          Deleting your auth user cascades student rows, cases, deadlines, and
          device push tokens.
        </p>
        <p className="mt-8 text-sm text-muted">
          StatusPass is a compliance organizer, not a law firm or DSO. Founded
          by DINESH S.
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
