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
        ink: "#0b1220",
        mist: "#e8eef7",
        accent: "#1d9e75",
        accentSoft: "#5dcaa5",
        warn: "#d97706",
        chartreuse: "#d2e823",
        hydrangea: "#2665d6",
        currant: "#780016",
        marble: "#f3f3f1",
        shade: "#1e2330",
        forest: "#254f1a",
        lavender: "#e9c0e9",
      },
    },
  },
  plugins: [],
};

export default config;
