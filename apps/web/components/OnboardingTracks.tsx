"use client";

import { useEffect, useState } from "react";
import { ChecklistRow } from "@statuspass/ui";
import { readPreview, writePreview } from "@/lib/preview-store";

const TRACKS = [
  {
    title: "A — Incoming F-1",
    items: [
      {
        id: "a-visa",
        title: "Visa interview prep",
        body: "DS-160, I-20, SEVIS I-901, ties-to-home notes.",
      },
      {
        id: "a-bank",
        title: "No-SSN US bank catalog",
        body: "Catalog offers, not a hard sell.",
      },
      { id: "a-esim", title: "eSIM for landing week" },
      {
        id: "a-room",
        title: "Roommate profile",
        body: "University, arrive-on, budget.",
      },
    ],
  },
  {
    title: "B — Enrolled / CPT",
    items: [
      { id: "b-i20", title: "Confirm I-20 dates" },
      {
        id: "b-cpt",
        title: "Add CPT employment",
        body: "Full-time CPT starts the 364-day clock.",
      },
      { id: "b-ssn", title: "SSN request letter draft" },
    ],
  },
  {
    title: "C — 12-month OPT",
    items: [
      {
        id: "c-i765",
        title: "I-765 helper",
        body: "Reject flags before you treat a packet as ready.",
      },
      {
        id: "c-opt",
        title: "90-day unemployment clock",
        body: "Starts the day after EAD valid-from if you have no qualifying job.",
      },
    ],
  },
  {
    title: "D — STEM OPT",
    items: [
      { id: "d-i983", title: "I-983 draft from CIP + job" },
      { id: "d-ev", title: "Employer E-Verify check" },
      { id: "d-eval", title: "12- and 24-month eval timers" },
    ],
  },
] as const;

export function OnboardingTracks() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(readPreview().onboarding);
  }, []);

  function toggle(id: string) {
    const next = done.includes(id)
      ? done.filter((item) => item !== id)
      : [...done, id];
    setDone(next);
    const preview = readPreview();
    preview.onboarding = next;
    writePreview(preview);
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Work the stage you are in. Checks stay on this device. Confirm details
        with your DSO.
      </p>
      {TRACKS.map((track) => (
        <section key={track.title} className="mb-8 rounded-card bg-surface p-5">
          <h2 className="font-serif text-xl text-navy">{track.title}</h2>
          {track.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className="block w-full text-left"
            >
              <ChecklistRow
                title={item.title}
                body={"body" in item ? item.body : undefined}
                done={done.includes(item.id)}
              />
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}
