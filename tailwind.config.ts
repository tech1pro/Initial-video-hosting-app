import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#0c0b09",
          900: "#1c1917",
          800: "#292524",
          500: "#78716f",
          400: "#a8a29e",
          300: "#d6d3d1",
          100: "#f5f5f4",
        },
        accent: {
          DEFAULT: "#fbbf24",
          dim: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
