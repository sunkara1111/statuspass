import {
  DEFAULT_I765_FEE_CENTS,
  SEVIS_ID_PATTERN,
  VALID_I765_CATEGORIES,
} from "./constants";
import { looksLikeCip } from "./cip";

export type I765Input = {
  category?: string | null;
  signatureOk?: boolean | null;
  filingFeeCents?: number | null;
  sevisId?: string | null;
  stemEligible?: boolean | null;
  cipCode?: string | null;
  currentFeeCents?: number;
};

export type I765Flag =
  | "category"
  | "signature"
  | "fee"
  | "sevis_id"
  | "stem_cip";

export const I765_FLAG_COPY: Record<I765Flag, string> = {
  category: "Category must be c03a, c03b, or c03c.",
  signature: "Signature confirmation is required before you prepare a packet.",
  fee: "Filing fee does not match the current I-765 fee on file.",
  sevis_id: "SEVIS ID must look like N followed by 10 digits.",
  stem_cip: "c03c needs STEM-eligible plus a CIP code.",
};

/** Inline reject flags. Block submit when any flag is present. */
export function i765RejectFlags(input: I765Input): I765Flag[] {
  const flags: I765Flag[] = [];
  const fee = input.currentFeeCents ?? DEFAULT_I765_FEE_CENTS;
  const category = (input.category ?? "").toLowerCase();

  if (!(VALID_I765_CATEGORIES as readonly string[]).includes(category)) {
    flags.push("category");
  }
  if (input.signatureOk !== true) {
    flags.push("signature");
  }
  if (input.filingFeeCents !== fee) {
    flags.push("fee");
  }
  if (!input.sevisId || !SEVIS_ID_PATTERN.test(input.sevisId)) {
    flags.push("sevis_id");
  }
  if (
    category === "c03c" &&
    !(input.stemEligible === true && looksLikeCip(input.cipCode ?? ""))
  ) {
    flags.push("stem_cip");
  }
  return flags;
}

export function canSubmitI765(input: I765Input): boolean {
  return i765RejectFlags(input).length === 0;
}
