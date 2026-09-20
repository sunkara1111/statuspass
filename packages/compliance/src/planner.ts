/** Calendar-day helpers for user-entered planners (not CPT/OPT clocks). */

export function calendarDaysUntil(isoDate: string, todayYmd?: string): number | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const today = todayYmd && /^\d{4}-\d{2}-\d{2}$/.test(todayYmd)
    ? todayYmd
    : localYmd();
  const due = ymdToUtcNoon(isoDate);
  const now = ymdToUtcNoon(today);
  if (due === null || now === null) return null;
  return Math.round((due - now) / 86_400_000);
}

export function localYmd(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function plannerSeverity(
  days: number | null,
): "safe" | "warning" | "critical" | "unset" {
  if (days === null) return "unset";
  if (days < 0) return "critical";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "safe";
}

function ymdToUtcNoon(ymd: string): number | null {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d, 12, 0, 0);
}

export const H1B_STARTER_ITEMS = [
  {
    title: "Confirm employer will sponsor",
    notes:
      "Talk to your manager or immigration coordinator. StatusPass does not file petitions.",
  },
  {
    title: "USCIS registration window",
    notes:
      "Confirm dates on the official USCIS H-1B page. Do not treat this planner as a government calendar.",
  },
  {
    title: "Lottery result check",
    notes:
      "Open the official USCIS account your employer uses. We do not scrape results.",
  },
  {
    title: "Petition filing with counsel",
    notes:
      "Work with the employer’s attorney. StatusPass is not a law firm.",
  },
  {
    title: "Requested start date / I-94 plan",
    notes:
      "Coordinate with your DSO if you are still in F-1 status.",
  },
] as const;
