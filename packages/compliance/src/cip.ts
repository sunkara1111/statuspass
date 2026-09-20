import { CIP_PATTERN } from "./constants";

export function looksLikeCip(code: string): boolean {
  return CIP_PATTERN.test(code.trim());
}

/**
 * Heuristic only — not a DHS STEM list. Used to prompt the student
 * to confirm stem_eligible with their DSO.
 */
export function cipLooksStem(code: string): boolean {
  if (!looksLikeCip(code)) return false;
  const family = Number(code.slice(0, 2));
  return [11, 14, 15, 26, 27, 40, 51].includes(family);
}

export function draftI983Sections(input: {
  cipCode: string;
  jobTitle: string;
  jobDescription: string;
  major?: string;
}): Record<string, string> {
  const title = input.jobTitle.trim() || "this role";
  const major = input.major?.trim() || "your degree";
  const desc = input.jobDescription.trim() || "the listed duties";
  return {
    student_role: `Training in ${title} applies classroom work from ${major} (CIP ${input.cipCode}).`,
    duties: desc,
    goals: `Connect ${major} coursework to supervised practice in ${title} over the STEM OPT period.`,
    evaluation:
      "Plan 12-month and 24-month self-evaluations with your supervisor. Confirm dates with your DSO.",
    disclaimer:
      "Draft only. StatusPass is a compliance organizer, not a law firm or DSO. Review with your employer and DSO before signing Form I-983.",
  };
}
