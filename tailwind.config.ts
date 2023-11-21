import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "error-25": "#fb6f8440",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3abff8",
          secondary: "#828df8",
          accent: "#f471b5",
          neutral: "#1d283a",
          "base-100": "#0f1729",
          info: "#0ca6e9",
          success: "#2bd4bd",
          warning: "#f4c152",
          error: "#fb6f84",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
