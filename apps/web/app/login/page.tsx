import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to StatusPass clocks and organizers.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-12">
        <h1 className="mb-8 text-center font-serif text-3xl font-semibold text-navy">
          Welcome back
        </h1>
        <AuthForm mode="login" redirect={redirect || "/app"} />
      </main>
      <SiteFooter />
    </div>
  );
}
