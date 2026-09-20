import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F4EE",
        surface: "#FFFFFF",
        ink: "#1B2430",
        muted: "#5C6773",
        navy: "#1E3A5F",
        teal: "#2A9D8F",
        safe: "#2F9E44",
        warning: "#E6A817",
        critical: "#C92A2A",
      },
      borderRadius: {
        card: "12px",
        pill: "20px",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
