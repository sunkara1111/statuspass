"use client";

import { useMemo, useState } from "react";
import { draftI983Sections, looksLikeCip } from "@statuspass/compliance";
import { FormProgress } from "@statuspass/ui";

export function I983Form() {
  const [cipCode, setCipCode] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [major, setMajor] = useState("");
  const [everifyOk, setEverifyOk] = useState(false);

  const sections = useMemo(() => {
    if (!looksLikeCip(cipCode) || !jobTitle.trim()) return null;
    return draftI983Sections({ cipCode, jobTitle, jobDescription, major });
  }, [cipCode, jobTitle, jobDescription, major]);

  return (
    <div className="max-w-2xl space-y-4">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Draft helper only. Employer must be E-Verify listed (or E-Verify + LCA)
        for STEM OPT. Confirm with your DSO. This does not submit Form I-983.
      </p>
      <FormProgress steps={["CIP", "Job", "Draft"]} current={sections ? 2 : 0} />
      <label className="block text-sm font-medium">
        CIP code
        <input
          value={cipCode}
          onChange={(e) => setCipCode(e.target.value)}
          placeholder="11.0701"
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
        {cipCode && !looksLikeCip(cipCode) ? (
          <p className="mt-1 text-xs text-critical">Use the ##.#### CIP format.</p>
        ) : null}
      </label>
      <label className="block text-sm font-medium">
        Major
        <input
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Job title
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Job description
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={everifyOk}
          onChange={(e) => setEverifyOk(e.target.checked)}
        />
        Employer is everify_listed or everify_and_lca (confirm yourself)
      </label>
      {sections ? (
        <div className="space-y-3 rounded-card border border-muted/20 bg-surface p-4">
          {Object.entries(sections).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs uppercase tracking-wide text-muted">{key}</p>
              <p className="mt-1 text-sm">{value}</p>
            </div>
          ))}
          {!everifyOk ? (
            <p className="text-sm text-warning">
              Next action: confirm E-Verify before you treat this as a STEM plan.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Add a CIP and job title to draft sections.
        </p>
      )}
    </div>
  );
}
