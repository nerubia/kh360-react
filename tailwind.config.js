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
      },
    },
  },
  plugins: [],
}
