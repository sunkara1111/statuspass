import {
  AMBER_DAYS_LEFT,
  CPT_AMBER_USED,
  CPT_FULL_TIME_LIMIT,
  DEFAULT_PROGRAM_TIMEZONE,
  OPT_UNEMPLOYMENT_LIMIT,
  RED_DAYS_LEFT,
  STEM_COMBINED_UNEMPLOYMENT_LIMIT,
  STEM_UNEMPLOYMENT_ADDON,
  VALID_PAUSE_REASONS,
  type PauseReason,
} from "./constants";
import {
  addDaysYmd,
  calendarDaysInclusive,
  ymdCompare,
  zonedYmd,
} from "./timezone";

export type ClockKind =
  | "cpt_full_time_days"
  | "opt_unemployment_days"
  | "stem_opt_unemployment_days";

export type ClockSeverity = "safe" | "warning" | "critical";

export type EmploymentKind =
  | "on_campus"
  | "cpt_part_time"
  | "cpt_full_time"
  | "opt"
  | "stem_opt"
  | "unpaid_volunteer"
  | "unpaid_research";

export type EmploymentSlice = {
  kind: EmploymentKind;
  startDate: string;
  endDate?: string | null;
  countsTowardCptCap?: boolean;
  pauseReason?: PauseReason | null;
};

export type UnemploymentSlice = {
  startedOn: string;
  endedOn?: string | null;
};

export function remainingDays(limit: number, used: number): number {
  return Math.max(0, limit - used);
}

export function usedDays(limit: number, remaining: number): number {
  return Math.max(0, limit - remaining);
}

export function clockSeverity(args: {
  kind: ClockKind;
  used: number;
  limit: number;
}): ClockSeverity {
  const remaining = remainingDays(args.limit, args.used);
  if (args.kind === "cpt_full_time_days") {
    if (remaining <= RED_DAYS_LEFT || args.used >= CPT_FULL_TIME_LIMIT) {
      return "critical";
    }
    if (args.used >= CPT_AMBER_USED || remaining <= AMBER_DAYS_LEFT) {
      return "warning";
    }
    return "safe";
  }
  if (remaining <= RED_DAYS_LEFT) return "critical";
  if (remaining <= AMBER_DAYS_LEFT) return "warning";
  return "safe";
}

export function cptKillsOpt(fullTimeDaysUsed: number): boolean {
  return fullTimeDaysUsed >= 365;
}

function isValidPause(reason: PauseReason | null | undefined): boolean {
  return Boolean(reason && (VALID_PAUSE_REASONS as readonly string[]).includes(reason));
}

/** Full-time CPT only. Part-time CPT does not count toward the 364-day cap. */
export function computeCptFullTimeDays(
  records: EmploymentSlice[],
  asOfYmd: string,
): number {
  let used = 0;
  for (const row of records) {
    const counts =
      row.countsTowardCptCap === true ||
      (row.countsTowardCptCap !== false && row.kind === "cpt_full_time");
    if (row.kind !== "cpt_full_time" || !counts) continue;
    const end = row.endDate && ymdCompare(row.endDate, asOfYmd) < 0 ? row.endDate : asOfYmd;
    if (ymdCompare(end, row.startDate) < 0) continue;
    used += calendarDaysInclusive(row.startDate, end);
  }
  return used;
}

function coversDay(row: EmploymentSlice, ymd: string): boolean {
  if (ymdCompare(ymd, row.startDate) < 0) return false;
  if (row.endDate && ymdCompare(ymd, row.endDate) > 0) return false;
  return true;
}

function dayIsPausedOrEmployed(records: EmploymentSlice[], ymd: string): boolean {
  return records.some((row) => {
    if (!coversDay(row, ymd)) return false;
    if (isValidPause(row.pauseReason ?? null)) return true;
    return (
      row.kind === "opt" ||
      row.kind === "stem_opt" ||
      row.kind === "on_campus" ||
      row.kind === "cpt_full_time" ||
      row.kind === "cpt_part_time"
    );
  });
}

/**
 * Cumulative unemployment days in program-local calendar dates.
 * OPT cap is 90. STEM adds 60 (150 across the whole OPT + STEM period).
 */
export function computeUnemploymentDays(args: {
  records?: EmploymentSlice[];
  events?: UnemploymentSlice[];
  eadValidFrom?: string | null;
  stemStartedOn?: string | null;
  asOfYmd: string;
  timeZone?: string;
}): {
  optUsed: number;
  stemUsed: number;
  totalUsed: number;
  optRemaining: number;
  stemRemaining: number;
  combinedRemaining: number;
} {
  void args.timeZone;
  const records = args.records ?? [];
  const events = args.events ?? [];

  let start = args.eadValidFrom ? addDaysYmd(args.eadValidFrom, 1) : null;
  if (!start && events.length > 0) {
    start = events.map((e) => e.startedOn).sort()[0] ?? null;
  }

  let optUsed = 0;
  let stemUsed = 0;

  if (start && ymdCompare(args.asOfYmd, start) >= 0) {
    let cursor = start;
    while (ymdCompare(cursor, args.asOfYmd) <= 0) {
      const inEvent = events.some((event) => {
        if (ymdCompare(cursor, event.startedOn) < 0) return false;
        if (event.endedOn && ymdCompare(cursor, event.endedOn) > 0) return false;
        return true;
      });
      const unemployed =
        inEvent || !dayIsPausedOrEmployed(records, cursor);
      if (unemployed) {
        const inStem =
          args.stemStartedOn && ymdCompare(cursor, args.stemStartedOn) >= 0;
        if (inStem) stemUsed += 1;
        else optUsed += 1;
      }
      cursor = addDaysYmd(cursor, 1);
    }
  }

  const totalUsed = optUsed + stemUsed;
  return {
    optUsed,
    stemUsed,
    totalUsed,
    optRemaining: remainingDays(OPT_UNEMPLOYMENT_LIMIT, optUsed),
    stemRemaining: remainingDays(STEM_UNEMPLOYMENT_ADDON, stemUsed),
    combinedRemaining: remainingDays(STEM_COMBINED_UNEMPLOYMENT_LIMIT, totalUsed),
  };
}

export function buildClock(args: {
  kind: ClockKind;
  used: number;
  limit: number;
  label: string;
  asOfYmd?: string;
  policySource?: string;
}) {
  const remaining = remainingDays(args.limit, args.used);
  return {
    kind: args.kind,
    label: args.label,
    used: args.used,
    limit: args.limit,
    remaining,
    severity: clockSeverity({
      kind: args.kind,
      used: args.used,
      limit: args.limit,
    }),
    asOfYmd: args.asOfYmd,
    policySource: args.policySource,
  };
}

export function exampleGuestClocks(asOf = new Date()) {
  const asOfYmd = zonedYmd(asOf, DEFAULT_PROGRAM_TIMEZONE);
  return {
    asOfYmd,
    timezone: DEFAULT_PROGRAM_TIMEZONE,
    clocks: [
      buildClock({
        kind: "cpt_full_time_days",
        used: 92,
        limit: CPT_FULL_TIME_LIMIT,
        label: "CPT full-time days",
        asOfYmd,
        policySource: "sevp",
      }),
      buildClock({
        kind: "opt_unemployment_days",
        used: 65,
        limit: OPT_UNEMPLOYMENT_LIMIT,
        label: "OPT unemployment",
        asOfYmd,
        policySource: "sevp",
      }),
      buildClock({
        kind: "stem_opt_unemployment_days",
        used: 12,
        limit: STEM_UNEMPLOYMENT_ADDON,
        label: "STEM OPT unemployment",
        asOfYmd,
        policySource: "sevp",
      }),
    ],
  };
}
