import { DEFAULT_PROGRAM_TIMEZONE } from "./constants";

/** YYYY-MM-DD in the student's program timezone. Never use UTC midnight. */
export function zonedYmd(
  date: Date,
  timeZone: string = DEFAULT_PROGRAM_TIMEZONE,
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) {
    throw new Error("Unable to format zoned date");
  }
  return `${y}-${m}-${d}`;
}

export function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) {
    throw new Error(`Invalid YYYY-MM-DD: ${ymd}`);
  }
  return { y, m, d };
}

/** Inclusive calendar-day count between two YYYY-MM-DD values. */
export function calendarDaysInclusive(startYmd: string, endYmd: string): number {
  const a = parseYmd(startYmd);
  const b = parseYmd(endYmd);
  const start = Date.UTC(a.y, a.m - 1, a.d);
  const end = Date.UTC(b.y, b.m - 1, b.d);
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function addDaysYmd(ymd: string, days: number): string {
  const { y, m, d } = parseYmd(ymd);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  const yy = next.getUTCFullYear();
  const mm = String(next.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(next.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function ymdCompare(a: string, b: string): number {
  return a === b ? 0 : a < b ? -1 : 1;
}
