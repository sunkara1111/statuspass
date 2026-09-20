import { tokens } from "./tokens";

export function ChecklistRow({
  title,
  body,
  done,
}: {
  title: string;
  body?: string;
  done?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #5C677320",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: `2px solid ${done ? tokens.teal : tokens.muted}`,
          background: done ? tokens.teal : "transparent",
          color: "#fff",
          fontSize: 12,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {done ? "✓" : ""}
      </span>
      <div>
        <p style={{ margin: 0, color: tokens.ink, fontWeight: 600 }}>{title}</p>
        {body ? (
          <p style={{ margin: "4px 0 0", color: tokens.muted, fontSize: 14 }}>{body}</p>
        ) : null}
      </div>
    </div>
  );
}
