import Link from "next/link";

export function SiteHeader({
  ctaHref = "/signup",
  ctaLabel = "Get Started",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <header className="border-b border-muted/20 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold text-navy">
          StatusPass
        </Link>
        <nav className="flex items-center gap-6 text-[15px]">
          <Link href="/login" className="text-muted hover:text-navy">
            Login
          </Link>
          <Link
            href={ctaHref}
            className="rounded-card bg-navy px-5 py-2 font-semibold text-white"
          >
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
