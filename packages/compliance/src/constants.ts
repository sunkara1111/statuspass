/** Frozen timer limits. Versioned on rows via policy_source + as_of. */
export const CPT_FULL_TIME_LIMIT = 364;
export const OPT_UNEMPLOYMENT_LIMIT = 90;
export const STEM_UNEMPLOYMENT_ADDON = 60;
export const STEM_COMBINED_UNEMPLOYMENT_LIMIT = 150;
export const AMBER_DAYS_LEFT = 30;
export const RED_DAYS_LEFT = 7;
export const CPT_AMBER_USED = 340;
export const DEFAULT_PROGRAM_TIMEZONE = "America/New_York";
export const DEFAULT_POLICY_SOURCE = "sevp";
export const DEFAULT_POLICY_VERSION = "sevp-2026.1";
export const DEFAULT_I765_FEE_CENTS = 52000;

export const VALID_I765_CATEGORIES = ["c03a", "c03b", "c03c"] as const;
export type I765Category = (typeof VALID_I765_CATEGORIES)[number];

export const VALID_PAUSE_REASONS = [
  "paid_ev",
  "qualifying_unpaid_research",
  "sevp_volunteer",
] as const;
export type PauseReason = (typeof VALID_PAUSE_REASONS)[number];

export const SEVIS_ID_PATTERN = /^N[0-9]{10}$/;
export const CIP_PATTERN = /^\d{2}\.\d{4}$/;
export const USCIS_RECEIPT_PATTERN = /^[A-Z]{3}[0-9]{10}$/;
