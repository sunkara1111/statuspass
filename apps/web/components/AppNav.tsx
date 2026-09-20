"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {NAV.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-pill px-3 py-1 ${
              active
                ? "bg-navy text-white"
                : "text-muted hover:bg-navy/5 hover:text-navy"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
