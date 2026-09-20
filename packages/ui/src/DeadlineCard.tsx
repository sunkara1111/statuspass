import { tokens } from "./tokens";

export function DeadlineCard({
  title,
  date,
  nextAction,
}: {
  title: string;
  date?: string | null;
  nextAction: string;
}) {
  return (
    <article
      style={{
        background: tokens.surface,
        borderRadius: tokens.radiusCard,
        padding: 20,
        border: "1px solid #5C677320",
      }}
    >
      <h3 style={{ margin: 0, color: tokens.navy, fontSize: 18 }}>{title}</h3>
      {date ? (
        <p style={{ margin: "8px 0 0", color: tokens.muted, fontSize: 14 }}>{date}</p>
      ) : null}
      <p style={{ margin: "12px 0 0", color: tokens.ink, fontSize: 15 }}>
        Next: {nextAction}
      </p>
    </article>
  );
}
