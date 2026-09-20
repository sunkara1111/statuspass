"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_I765_FEE_CENTS,
  I765_FLAG_COPY,
  i765RejectFlags,
  type I765Flag,
} from "@statuspass/compliance";
import { FormProgress } from "@statuspass/ui";
export function I765Form({ feeCents }: { feeCents: number }) {
  const fee = feeCents || DEFAULT_I765_FEE_CENTS;
  const [category, setCategory] = useState("c03b");
  const [sevisId, setSevisId] = useState("");
  const [cipCode, setCipCode] = useState("");
  const [stemEligible, setStemEligible] = useState(false);
  const [signatureOk, setSignatureOk] = useState(false);
  const [filingFeeCents, setFilingFeeCents] = useState(fee);
  const [attempted, setAttempted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const flags = useMemo(
    () =>
      i765RejectFlags({
        category,
        sevisId,
        cipCode,
        stemEligible,
        signatureOk,
        filingFeeCents,
        currentFeeCents: fee,
      }),
    [category, sevisId, cipCode, stemEligible, signatureOk, filingFeeCents, fee],
  );

  function chip(flag: I765Flag, show: boolean) {
    if (!show && !attempted) return null;
    if (!flags.includes(flag)) return null;
    return (
      <p className="mt-1 text-xs font-medium text-critical">
        {I765_FLAG_COPY[flag]}
      </p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (flags.length) {
      setMessage("Fix the chips under each field. This is not a USCIS filing.");
      return;
    }
    setMessage(
      "Packet looks complete enough to review with your DSO. StatusPass does not file Form I-765.",
    );
  }

  return (
    <div className="max-w-xl">
      <p className="mb-4 rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Pro stub — not a filing. Current fee on file: ${(fee / 100).toFixed(2)}.
      </p>
      <FormProgress
        steps={["Category", "Identity", "Fee", "Review"]}
        current={flags.length ? 1 : 3}
      />
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">
          Eligibility category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          >
            <option value="c03a">c03a — pre-completion OPT</option>
            <option value="c03b">c03b — post-completion OPT</option>
            <option value="c03c">c03c — STEM OPT</option>
            <option value="other">other</option>
          </select>
          {chip("category", true)}
        </label>
        <label className="block text-sm font-medium">
          SEVIS ID
          <input
            value={sevisId}
            onChange={(e) => setSevisId(e.target.value.toUpperCase())}
            placeholder="N0000000000"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
          {chip("sevis_id", true)}
        </label>
        <label className="block text-sm font-medium">
          CIP code
          <input
            value={cipCode}
            onChange={(e) => setCipCode(e.target.value)}
            placeholder="11.0701"
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={stemEligible}
            onChange={(e) => setStemEligible(e.target.checked)}
          />
          STEM eligible (confirm with your DSO)
        </label>
        {chip("stem_cip", true)}
        <label className="block text-sm font-medium">
          Filing fee (cents)
          <input
            type="number"
            value={filingFeeCents}
            onChange={(e) => setFilingFeeCents(Number(e.target.value))}
            className="mt-1 w-full rounded-card border border-muted/30 px-3 py-2"
          />
          {chip("fee", true)}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={signatureOk}
            onChange={(e) => setSignatureOk(e.target.checked)}
          />
          I will sign the packet before anyone mails it
        </label>
        {chip("signature", true)}
        <button
          type="submit"
          className="rounded-card bg-teal px-5 py-2.5 font-semibold text-white"
        >
          Check packet
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-navy">{message}</p> : null}
    </div>
  );
}
