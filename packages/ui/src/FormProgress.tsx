import { tokens } from "./tokens";

export function FormProgress({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol
      style={{
        display: "flex",
        gap: 8,
        listStyle: "none",
        padding: 0,
        margin: "0 0 24px",
        flexWrap: "wrap",
      }}
    >
      {steps.map((step, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <li
            key={step}
            style={{
              padding: "6px 12px",
              borderRadius: tokens.radiusPill,
              background: active ? tokens.navy : done ? `${tokens.teal}22` : "#5C677315",
              color: active ? "#fff" : tokens.ink,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {index + 1}. {step}
          </li>
        );
      })}
    </ol>
  );
}
