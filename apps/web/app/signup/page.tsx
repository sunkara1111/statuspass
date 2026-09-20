import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Start free with your OPT clock",
  description:
    "Create a StatusPass account. Free CPT, OPT, and STEM clocks. Not a law firm or DSO.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-12">
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-navy">
          Start free with your OPT clock.
        </h1>
        <p className="mb-8 text-center text-muted">
          Track your F-1, CPT, OPT, and STEM OPT clocks. One next action.
        </p>
        <AuthForm mode="signup" />
      </main>
      <SiteFooter />
    </div>
  );
}
