import { tokens } from "./tokens";

export const ORGANIZER_DISCLAIMER =
  "StatusPass is a compliance organizer, not a law firm or DSO.";

export function Disclaimer({ extra }: { extra?: string }) {
  return (
    <p style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.5, margin: 0 }}>
      {ORGANIZER_DISCLAIMER}
      {extra ? ` ${extra}` : ""}
    </p>
  );
}
