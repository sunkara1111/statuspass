import { z } from "zod";

export const visaStatus = z.enum([
  "incoming",
  "active_f1",
  "cpt",
  "opt_pending",
  "opt_authorized",
  "stem_opt",
  "grace",
  "terminated",
]);

export const visaClass = z.enum(["f1", "other"]);
export const degreeLevel = z.enum(["bachelors", "masters", "phd", "other"]);

export const employmentKind = z.enum([
  "on_campus",
  "cpt_part_time",
  "cpt_full_time",
  "opt",
  "stem_opt",
  "unpaid_volunteer",
  "unpaid_research",
]);

export const formType = z.enum([
  "i765",
  "i983",
  "ssn_request_letter",
  "i20_request",
  "other",
]);

export const formStatus = z.enum([
  "draft",
  "ready",
  "submitted",
  "rfe",
  "approved",
  "denied",
  "withdrawn",
]);

export const timerKind = z.enum([
  "cpt_full_time_days",
  "opt_unemployment_days",
  "stem_opt_unemployment_days",
  "i765_clock",
  "i983_12mo_eval",
  "i983_24mo_eval",
  "program_end",
  "grace_period",
]);

export const timerState = z.enum([
  "not_started",
  "running",
  "paused",
  "exhausted",
  "completed",
]);

export const employerVerifyStatus = z.enum([
  "unverified",
  "everify_listed",
  "lca_listed",
  "everify_and_lca",
]);

export const notificationSeverity = z.enum(["info", "warning", "critical"]);
export const orientationTrack = z.enum(["pre_arrival", "cpt", "opt", "stem_opt"]);
export const documentKind = z.enum([
  "i20",
  "passport",
  "ead",
  "i94",
  "offer_letter",
  "transcript",
  "other",
]);
export const notifyChannel = z.enum(["push", "email", "in_app"]);
export const unemploymentReason = z.enum([
  "gap",
  "waiting_ead",
  "between_jobs",
  "volunteer_pause",
]);
export const affiliateCategory = z.enum(["bank_no_ssn", "esim", "telecom"]);
export const pauseReason = z.enum([
  "paid_ev",
  "qualifying_unpaid_research",
  "sevp_volunteer",
]);
export const alertEventKind = z.enum([
  "morning_digest",
  "hard_cap_warning",
  "clock_exhausted",
]);
export const sevisSelfStatus = z.enum(["unset", "active", "escalate_dso"]);
export const pushPlatform = z.enum(["ios", "android", "web"]);
