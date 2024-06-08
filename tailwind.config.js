// tailwind.config.js
const {nextui} = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: () => ({
        brand: {
          50: "#E9E3FF",
          100: "#C0B8FE",
          200: "#A195FD",
          300: "#8171FC",
          400: "#7551FF",
          500: "#422AFB",
          600: "#3311DB",
          700: "#2111A5",
          800: "#190793",
          900: "#11047A",
        },
      }),
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
