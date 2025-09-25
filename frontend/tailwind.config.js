/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-7765DA': '#7765DA',
        'primary-5767D0': '#5767D0',
        'primary-4F0DCE': '#4F0DCE',
        'bg-light': '#F2F2F2',
        'bg-dark': '#373737',
        'gray-6E6E6E': '#6E6E6E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}