import type { Config } from "tailwindcss";

// Tailwind v4 reads design tokens from the `@theme` block in app/globals.css
// (the source of truth). This file mirrors those tokens for editor tooling
// and documentation parity with the design spec.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#F8F9FB",
          raised: "#FFFFFF",
          sunken: "#EEF0F4",
        },
        border: "#D4D8E1",
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
    },
  },
};

export default config;
