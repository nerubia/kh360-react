/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin")

module.exports = {
  content: [
    "./src/**/*.{html,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
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
          100: "#ffebe8",
          200: "#edc9d4",
          300: "#ffcac8",
          500: "#de3a2d",
          700: "#d1242f",
        },
        customOrange: {
          100: "#fff0e4",
          200: "#ffd3c9",
          300: "#ffd1b1",
          500: "#da602f",
          700: "#bb4b00",
        },
        customYellow: {
          100: "#fff7cf",
          300: "#fff8c5",
          400: "#f1dd9f",
          500: "#f4ba42",
        },
        customLightGreen: {
          100: "#dafbe1",
          500: "#8dc663",
        },
        customGreen: {
          100: "#e4f0c9",
          300: "#bbeec7",
          500: "#8fc862",
          700: "#1b7f37",
        },
        customBlue: {
          100: "#ddf4ff",
          200: "#c7e0ff",
          500: "#b7e0ff",
          700: "#0a69da",
        },
        customPurple: {
          100: "#fbefff",
          200: "#cfcfff",
          300: "#bac3ff",
          400: "#e6ceff",
          700: "#8250df",
        },
        customBrown: {
          500: "#9b6700",
        },
        customPink: {
          100: "#fff0f7",
          200: "#ffe4f3",
          700: "#bf3989",
        },
      },
      width: {
        68: "68px",
        90: "90px",
        100: "100px",
        125: "125px",
        150: "150px",
        170: "170px",
        196: "196px",
        200: "200px",
        210: "210px",
        250: "250px",
        254: "254px",
        270: "270px",
        280: "280px",
        300: "300px",
        450: "450px",
        500: "500px",
        600: "600px",
        650: "650px",
        700: "700px",
        750: "750px",
        800: "800px",
        860: "860px",
        950: "950px",
        1100: "1100px",
        1435: "1435px",
        "9/10": "90%",
        "21/25": "84%",
        "16/25": "64%",
        "61/100": "61%",
        "53/100": "53%",
        "9/20": "45%",
        "2/5": "40%",
        "9/25": "36%",
        "4/25": "16%",
        "1/10": "10%",
        "1/20": "5%",
        "1/30": "2.5%",
        "slider-thumb": "55px",
      },
      height: {
        38: "38px",
        50: "50px",
        185: "185px",
        450: "450px",
        650: "650px",
        "calc-screen": "h-[calc(100vh_-_185px)]",
        "19/20": "95%",
      },
      spacing: {
        6.5: "26px",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("slider-thumb", ["&::-webkit-slider-thumb", "&::slider-thumb"])
      addVariant("moz-slider-thumb", ["&::-moz-range-thumb", "&::slider-thumb"])
    }),
  ],
  darkMode: "",
}
