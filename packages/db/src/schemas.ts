import { z } from "zod";
import {
  employerVerifyStatus,
  employmentKind,
  pauseReason,
  sevisSelfStatus,
  visaStatus,
} from "./enums";

export const sevisId = z
  .string()
  .regex(/^N[0-9]{10}$/, "SEVIS ID must be N + 10 digits");

export const cipCode = z
  .string()
  .regex(/^\d{2}\.\d{4}$/, "CIP must look like 11.0701");

export const uscisReceipt = z
  .string()
  .regex(/^[A-Z]{3}[0-9]{10}$/, "Receipt must be 3 letters + 10 digits");

export const studentRow = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  sevis_id: sevisId.nullable().optional(),
  university_name: z.string().nullable().optional(),
  cip_code: cipCode.nullable().optional(),
  stem_eligible: z.boolean().default(false),
  current_status: visaStatus,
  program_timezone: z.string().default("America/New_York"),
  sevis_self_status: sevisSelfStatus.default("unset"),
  ead_valid_from: z.string().nullable().optional(),
  ead_valid_to: z.string().nullable().optional(),
});

export const employmentRecordRow = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  kind: employmentKind,
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  counts_toward_cpt_cap: z.boolean().default(false),
  pause_reason: pauseReason.nullable().optional(),
});

export const uscisCaseRow = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  receipt_number: uscisReceipt.nullable().optional(),
  label: z.string().nullable().optional(),
  last_opened_at: z.string().nullable().optional(),
});

export const h1bDeadlineRow = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  title: z.string().min(1),
  due_on: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const employerRow = z.object({
  id: z.string().uuid(),
  legal_name: z.string(),
  ein: z.string().nullable().optional(),
  everify_status: employerVerifyStatus,
  hq_city: z.string().nullable().optional(),
  hq_state: z.string().nullable().optional(),
  is_sample: z.boolean().default(false),
});

export const devicePushTokenRow = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  token: z.string().min(8),
  platform: z.enum(["ios", "android", "web"]),
});

export const pushTokenInput = z.object({
  token: z.string().min(8),
  platform: z.enum(["ios", "android", "web"]),
});
