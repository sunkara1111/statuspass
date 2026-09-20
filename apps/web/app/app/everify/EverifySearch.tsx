"use client";

import { useMemo, useState } from "react";
import { SAMPLE_EMPLOYERS } from "@/lib/sample-employers";

export function EverifySearch() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SAMPLE_EMPLOYERS;
    return SAMPLE_EMPLOYERS.filter((row) =>
      [row.legal_name, row.hq_city, row.hq_state, row.ein]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <p className="rounded-card border border-navy/15 bg-surface p-4 text-sm">
        Not a live DHS extract. Every catalog row here is a fictional SAMPLE.
        No verified chrome on samples.
      </p>
      <label className="block text-sm font-medium">
        Search employers
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, city, or EIN"
          className="mt-1 w-full max-w-md rounded-card border border-muted/30 px-3 py-2"
        />
      </label>
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.ein}
            className="rounded-card border border-muted/20 bg-surface p-4"
          >
            <div className="mb-2">
              <span className="rounded-pill bg-warning/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">
                SAMPLE
              </span>
            </div>
            <p className="font-semibold text-navy">{row.legal_name}</p>
            <p className="text-sm text-muted">
              {row.hq_city}, {row.hq_state} · EIN {row.ein}
            </p>
            <p className="mt-1 text-sm">
              Listed status in this sample catalog: {row.everify_status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
