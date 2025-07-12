/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#3A1078',
        'secondary': '#4E31AA', 
        'accent': '#3795BD',
        'light': '#F7F7F8',
        'dark-bg': '#2D1B69'
      }
    },
  },
  plugins: [],
}

