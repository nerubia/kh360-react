/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f7fb",
          100: "#f2eff8",
          200: "#e7e2f2",
          300: "#d5cbe7",
          400: "#bdadd8",
          500: "#a78ec8",
          600: "#9371b6",
          700: "#825ea3",
          800: "#6c4f88",
          900: "#5a4270",
          950: "#3a2a4b",
        },
        customRed: {
          500: "#edc9d4",
        },
        customOrange: {
          500: "#ffd3c9",
        },
        customYellow: {
          500: "#f4ba42",
        },
        customLightGreen: {
          500: "#bbeec7",
        },
        customGreen: {
          500: "#8fc862",
        },
        customBlue: {
          500: "#b7e0ff",
        },
      },
    },
  },
  plugins: [],
}
