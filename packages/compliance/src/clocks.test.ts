import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clockSeverity,
  computeCptFullTimeDays,
  computeUnemploymentDays,
} from "./clocks";
import { i765RejectFlags } from "./i765";
import { zonedYmd } from "./timezone";

describe("clocks", () => {
  it("counts only full-time CPT toward the 364 cap", () => {
    const used = computeCptFullTimeDays(
      [
        {
          kind: "cpt_full_time",
          startDate: "2026-01-01",
          endDate: "2026-01-10",
          countsTowardCptCap: true,
        },
        {
          kind: "cpt_part_time",
          startDate: "2026-01-01",
          endDate: "2026-06-01",
        },
      ],
      "2026-01-10",
    );
    assert.equal(used, 10);
  });

  it("marks CPT amber at 340 used and red at 7 days left", () => {
    assert.equal(
      clockSeverity({ kind: "cpt_full_time_days", used: 340, limit: 364 }),
      "warning",
    );
    assert.equal(
      clockSeverity({ kind: "cpt_full_time_days", used: 358, limit: 364 }),
      "critical",
    );
    assert.equal(
      clockSeverity({ kind: "opt_unemployment_days", used: 65, limit: 90 }),
      "warning",
    );
  });

  it("splits OPT vs STEM unemployment and stays cumulative", () => {
    const result = computeUnemploymentDays({
      eadValidFrom: "2026-01-01",
      stemStartedOn: "2026-01-06",
      asOfYmd: "2026-01-10",
      records: [],
    });
    // Jan 2–5 OPT (4 days), Jan 6–10 STEM (5 days)
    assert.equal(result.optUsed, 4);
    assert.equal(result.stemUsed, 5);
    assert.equal(result.totalUsed, 9);
  });

  it("pauses unemployment only for the three allowed reasons", () => {
    const result = computeUnemploymentDays({
      eadValidFrom: "2026-01-01",
      asOfYmd: "2026-01-05",
      records: [
        {
          kind: "unpaid_volunteer",
          startDate: "2026-01-02",
          endDate: "2026-01-05",
          pauseReason: "sevp_volunteer",
        },
      ],
    });
    assert.equal(result.optUsed, 0);
  });
});

describe("i765 flags", () => {
  it("blocks incomplete packets", () => {
    const flags = i765RejectFlags({
      category: "other",
      signatureOk: false,
      filingFeeCents: 0,
      sevisId: "bad",
    });
    assert.ok(flags.includes("category"));
    assert.ok(flags.includes("signature"));
    assert.ok(flags.includes("fee"));
    assert.ok(flags.includes("sevis_id"));
  });

  it("requires STEM + CIP for c03c", () => {
    const flags = i765RejectFlags({
      category: "c03c",
      signatureOk: true,
      filingFeeCents: 52000,
      sevisId: "N1234567890",
      stemEligible: false,
      cipCode: "11.0701",
    });
    assert.deepEqual(flags, ["stem_cip"]);
  });
});

describe("timezone", () => {
  it("formats a New York calendar date", () => {
    const ymd = zonedYmd(new Date("2026-03-08T02:30:00Z"), "America/New_York");
    assert.match(ymd, /^\d{4}-\d{2}-\d{2}$/);
  });
});

