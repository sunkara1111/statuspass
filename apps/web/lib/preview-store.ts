"use client";

export type SevisWallet = {
  sevisId: string;
  selfStatus: "unset" | "active" | "escalate_dso";
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
};

const KEY = "statuspass.preview.v1";

const empty: PreviewState = {
  sevis: { sevisId: "", selfStatus: "unset" },
  cases: [],
  h1b: [],
  pushTokens: [],
};

export function readPreview(): PreviewState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function writePreview(next: PreviewState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function newId() {
  return crypto.randomUUID();
}
