import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#212121",
        mist: "#F6F7F8",
        accent: "#7050D1",
        accentSoft: "#F1F0FF",
        accentMuted: "#E8E4FF",
        brand: "#F64060",
        warn: "#d97706",
        // Meetup-inspired tokens
        meetup: {
          bg: "#F6F7F8",
          surface: "#FFFFFF",
          border: "#E6E6E6",
          ink: "#212121",
          muted: "#707070",
          purple: "#7050D1",
          lavender: "#F1F0FF",
          pink: "#F64060",
          black: "#000000",
        },
        // legacy Linktree tokens kept for any leftover refs
        chartreuse: "#d2e823",
        hydrangea: "#2665d6",
        currant: "#780016",
        marble: "#f3f3f1",
        shade: "#1e2330",
        forest: "#254f1a",
        lavender: "#e9c0e9",
      },
      boxShadow: {
        meetup: "0 2px 12px rgba(0,0,0,0.06)",
        "meetup-lg": "0 8px 28px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        meetup: "16px",
        "meetup-lg": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
