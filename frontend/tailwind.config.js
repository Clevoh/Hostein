// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ebf5ff',
          100: '#e1effe',
          200: '#c3ddfd',
          300: '#a4cafe',
          400: '#76a9fa',
          500: '#3f83f8', // main blue
          600: '#1c64f2',
          700: '#1a56db',
          800: '#1e429f',
          900: '#233876',
        },
      },
    },
  },
  plugins: [],
};
