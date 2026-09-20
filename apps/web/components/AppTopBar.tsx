import Link from "next/link";

export function AppTopBar() {
  return (
    <header className="shrink-0 border-b border-white/10 bg-navy pt-[env(safe-area-inset-top)] text-white">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4">
        <Link href="/app" className="font-serif text-lg font-semibold tracking-tight">
          StatusPass
        </Link>
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
          Organizer
        </span>
      </div>
    </header>
  );
}
