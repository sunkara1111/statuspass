export const SITE_NAME = "StatusPass";
export const SITE_TITLE =
  "StatusPass — F-1, CPT, OPT & STEM OPT compliance organizer";
export const SITE_DESCRIPTION =
  "Track CPT days, OPT unemployment, and STEM clocks in your program timezone. Free clocks and danger alerts. Not a law firm or DSO. Founded by DINESH S.";
export const ORGANIZER_LINE =
  "StatusPass is a compliance organizer, not a law firm or DSO.";
export const FOUNDER_LINE = "Founded by DINESH S.";
export const USCIS_CASE_STATUS_URL = "https://egov.uscis.gov/casestatus/";

/** Preferred public origin. Set NEXT_PUBLIC_SITE_URL to this in production. */
export const CANONICAL_PUBLIC_URL = "https://statuspass.com";

/** Last-resort host when the custom domain is not set or not reachable. */
export const VERCEL_FALLBACK_URL =
  "https://temporary-prompt-pavo-7vphl3a.vercel.app";

export function vercelFallbackUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return VERCEL_FALLBACK_URL;
}

/**
 * Canonical public URL.
 * 1. NEXT_PUBLIC_SITE_URL (prefer https://statuspass.com)
 * 2. Preview deployments stay on *.vercel.app
 * 3. Production defaults to https://statuspass.com
 * 4. Otherwise the known Vercel fallback, then localhost
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (raw) return raw;

  if (process.env.VERCEL_ENV === "preview") {
    return vercelFallbackUrl();
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return CANONICAL_PUBLIC_URL;
  }

  if (process.env.VERCEL) {
    return vercelFallbackUrl();
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
