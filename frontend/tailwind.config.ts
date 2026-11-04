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
      },
    },
  },
  plugins: [],
};

export default config;
