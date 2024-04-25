/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {},
    colors: {
      'primary': {
        50: '#CCE6E6',
        400: '#2A9595',
        500: '#008080',
        600: '#006B6B',
      },
      'secondary': {
        50: '#D6D3E2',
        400: '#544986',
        500: '#32256E',
        600: '#2A1F5C',
      },
      'accent': {
        200: "#F9FAFA",
        300: "#F6F7F9",
        500: '#EBEDEF',
      },
      'success': {
        100: "#F0FDF4",
        500: "#22C55E",
      },
      'warning': {
        100: "#FEFCE8",
        500: "#EAB308",
      },
      'dark': {
        50: "#dadada",
        70: "#C9CFD4",
        100: "#c1c1c1",
        200: "#9BA2A7",
        250: "#79716b",
        260: "#656B76",
        350: "#495969",
        400: "#36454F",
        600: "#14151a",
      },
    }
  },
  fontFamily: {
    sans: ['Matter SQ Regular']
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

