import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { tokens } from "./tokens";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "navy" | "ghost";
};

export function PrimaryButton({
  variant = "primary",
  style,
  children,
  ...props
}: Props) {
  const palette: Record<string, CSSProperties> = {
    primary: { background: tokens.teal, color: "#fff" },
    navy: { background: tokens.navy, color: "#fff" },
    ghost: {
      background: "transparent",
      color: tokens.navy,
      border: `1px solid ${tokens.navy}33`,
    },
  };
  return (
    <button
      type={props.type ?? "button"}
      {...props}
      style={{
        border: "none",
        borderRadius: tokens.radiusCard,
        padding: "14px 32px",
        fontSize: 16,
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.55 : 1,
        ...palette[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
