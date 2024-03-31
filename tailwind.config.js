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
      'success': {
        100: "#F0FDF4",
        500: "#22C55E",
      },
      'warning': {
        100: "#FEFCE8",
        500: "#EAB308",
      }
    }
  },
  fontFamily: {
    sans: ['Matter SQ Regular']
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

