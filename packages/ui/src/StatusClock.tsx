import type { CSSProperties } from "react";
import { severityColor, tokens } from "./tokens";

export type StatusClockProps = {
  label: string;
  remaining: number;
  limit: number;
  used: number;
  severity: "safe" | "warning" | "critical";
  caption?: string;
};

export function StatusClock({
  label,
  remaining,
  limit,
  used,
  severity,
  caption,
}: StatusClockProps) {
  const color = severityColor[severity];
  const pct = Math.min(100, Math.max(0, (used / Math.max(limit, 1)) * 100));
  return (
    <article
      style={{
        background: tokens.surface,
        borderRadius: tokens.radiusCard,
        padding: 20,
        border: "2px solid #5C677320",
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: tokens.muted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {remaining}
        </span>
        <span style={{ fontSize: 16, color: tokens.muted }}>
          days left of {limit}
        </span>
      </div>
      <div
        style={{
          marginTop: 16,
          height: 8,
          background: "#5C677320",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={
            {
              width: `${pct}%`,
              height: "100%",
              background: color,
              borderRadius: 4,
            } satisfies CSSProperties
          }
        />
      </div>
      <p style={{ marginTop: 8, fontSize: 14, color: tokens.muted }}>
        {used} used
        {caption ? ` · ${caption}` : ""}
      </p>
    </article>
  );
}
