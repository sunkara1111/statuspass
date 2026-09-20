import AsyncStorage from "@react-native-async-storage/async-storage";

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
};

const KEY = "statuspass.preview.v1";

export function emptyPreview(): PreviewState {
  return {
    sevis: { sevisId: "", selfStatus: "unset", universityName: "" },
    cases: [],
    h1b: [],
  };
}

export async function readPreview(): Promise<PreviewState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyPreview();
    const parsed = JSON.parse(raw) as Partial<PreviewState>;
    return {
      sevis: { ...emptyPreview().sevis, ...parsed.sevis },
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
      h1b: Array.isArray(parsed.h1b) ? parsed.h1b : [],
    };
  } catch {
    return emptyPreview();
  }
}

export async function writePreview(next: PreviewState) {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function nextH1b(rows: H1bDeadline[]): H1bDeadline | null {
  const dated = rows
    .filter((row) => row.dueOn)
    .slice()
    .sort((a, b) => a.dueOn.localeCompare(b.dueOn));
  return dated[0] ?? rows[0] ?? null;
}
