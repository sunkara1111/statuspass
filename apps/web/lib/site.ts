export const SITE_NAME = "StatusPass";
export const SITE_TITLE =
  "StatusPass — F-1, CPT, OPT & STEM OPT compliance organizer";
export const SITE_DESCRIPTION =
  "Track CPT days, OPT unemployment, and STEM clocks in your program timezone. Free clocks and danger alerts. Not a law firm or DSO. Founded by DINESH S.";
export const ORGANIZER_LINE =
  "StatusPass is a compliance organizer, not a law firm or DSO.";
export const FOUNDER_LINE = "Founded by DINESH S.";
export const USCIS_CASE_STATUS_URL = "https://egov.uscis.gov/casestatus/";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (raw) return raw;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function i765FeeCents(): number {
  const n = Number(process.env.I765_FEE_CENTS ?? 52000);
  return Number.isFinite(n) ? n : 52000;
}
