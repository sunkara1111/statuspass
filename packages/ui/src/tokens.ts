export const tokens = {
  background: "#F7F4EE",
  surface: "#FFFFFF",
  ink: "#1B2430",
  muted: "#5C6773",
  navy: "#1E3A5F",
  teal: "#2A9D8F",
  safe: "#2F9E44",
  warning: "#E6A817",
  critical: "#C92A2A",
  radiusCard: 12,
  radiusPill: 20,
} as const;

export const severityColor: Record<"safe" | "warning" | "critical", string> = {
  safe: tokens.safe,
  warning: tokens.warning,
  critical: tokens.critical,
};
