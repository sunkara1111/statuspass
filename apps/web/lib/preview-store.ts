"use client";

export type SevisWallet = {
  sevisId: string;
  selfStatus: "unset" | "active" | "escalate_dso";
  universityName: string;
};

export type UscisCase = {
  id: string;
  receiptNumber: string;
  label: string;
  lastOpenedAt?: string;
};

export type H1bDeadline = {
  id: string;
  title: string;
  dueOn: string;
  notes: string;
};

export type PreviewState = {
  sevis: SevisWallet;
  cases: UscisCase[];
  h1b: H1bDeadline[];
  pushTokens: { token: string; platform: "ios" | "android" | "web" }[];
  onboarding: string[];
};

const KEY = "statuspass.preview.v1";

const empty: PreviewState = {
  sevis: { sevisId: "", selfStatus: "unset", universityName: "" },
  cases: [],
  h1b: [],
  pushTokens: [],
  onboarding: [],
};

export function emptyPreview(): PreviewState {
  return {
    sevis: { ...empty.sevis },
    cases: [],
    h1b: [],
    pushTokens: [],
    onboarding: [],
  };
}

export function readPreview(): PreviewState {
  if (typeof window === "undefined") return emptyPreview();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyPreview();
    const parsed = JSON.parse(raw) as Partial<PreviewState>;
    return {
      ...emptyPreview(),
      ...parsed,
      sevis: { ...empty.sevis, ...parsed.sevis },
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
      h1b: Array.isArray(parsed.h1b) ? parsed.h1b : [],
      pushTokens: Array.isArray(parsed.pushTokens) ? parsed.pushTokens : [],
      onboarding: Array.isArray(parsed.onboarding) ? parsed.onboarding : [],
    };
  } catch {
    return emptyPreview();
  }
}

export function writePreview(next: PreviewState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function newId() {
  return crypto.randomUUID();
}

export function nextH1b(rows: H1bDeadline[]): H1bDeadline | null {
  const dated = rows
    .filter((row) => row.dueOn)
    .slice()
    .sort((a, b) => a.dueOn.localeCompare(b.dueOn));
  return dated[0] ?? rows[0] ?? null;
}
