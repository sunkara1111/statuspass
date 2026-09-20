"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FOUNDER_LINE, ORGANIZER_LINE } from "@/lib/site";

const PRIMARY = [
  { href: "/app", label: "Clocks", icon: ClockIcon },
  { href: "/app/sevis", label: "SEVIS", icon: SevisIcon },
  { href: "/app/cases", label: "USCIS", icon: CaseIcon },
  { href: "/app/h1b", label: "H-1B", icon: TimelineIcon },
] as const;

const MORE = [
  { href: "/app/i765", label: "I-765 packet" },
  { href: "/app/i983", label: "I-983 draft" },
  { href: "/app/everify", label: "E-Verify" },
  { href: "/app/onboarding", label: "Onboarding" },
  { href: "/app/settings", label: "Settings" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMoreRoute(pathname: string) {
  return MORE.some((item) => isActive(pathname, item.href));
}

export function AppNav() {
  const pathname = usePathname();
  const moreActive = isMoreRoute(pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Close more tools"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 rounded-t-[20px] border-t border-muted/20 bg-surface px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(27,36,48,0.12)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-pill bg-muted/30" />
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              More tools
            </p>
            <div className="grid gap-2">
              {MORE.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-card px-4 py-3 text-sm font-semibold ${
                    isActive(pathname, item.href)
                      ? "bg-navy text-white"
                      : "bg-background text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-muted">
              {ORGANIZER_LINE} {FOUNDER_LINE}
            </p>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Organizer"
        className="relative z-30 border-t border-muted/20 bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5 px-1 pt-1.5">
          {PRIMARY.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-card px-1 py-1.5 text-[11px] font-semibold ${
                  active ? "text-teal" : "text-muted"
                }`}
              >
                <Icon active={active} />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={`flex flex-col items-center gap-0.5 rounded-card px-1 py-1.5 text-[11px] font-semibold ${
              moreActive || open ? "text-teal" : "text-muted"
            }`}
            aria-expanded={open}
            aria-controls="app-more-sheet"
          >
            <MoreIcon active={moreActive || open} />
            More
          </button>
        </div>
      </nav>
    </>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4.2l2.6 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {active ? <circle cx="12" cy="12" r="1.2" fill="currentColor" /> : null}
    </svg>
  );
}

function SevisIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="4"
        width="14"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 9h7M8.5 12.5h7M8.5 16h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {active ? <circle cx="17" cy="6" r="1.4" fill="currentColor" /> : null}
    </svg>
  );
}

function CaseIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 8.5h14v9.2A2.3 2.3 0 0 1 16.7 20H7.3A2.3 2.3 0 0 1 5 17.7V8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 8.5V6.8A1.8 1.8 0 0 1 10.8 5h2.4A1.8 1.8 0 0 1 15 6.8v1.7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {active ? <path d="M9 13.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : null}
    </svg>
  );
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M5 12h10M5 17h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="19" cy="12" r={active ? 2.2 : 1.6} fill="currentColor" />
    </svg>
  );
}

function MoreIcon({ active }: { active: boolean }) {
  const r = active ? 2.1 : 1.7;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="6.5" cy="12" r={r} />
      <circle cx="12" cy="12" r={r} />
      <circle cx="17.5" cy="12" r={r} />
    </svg>
  );
}
