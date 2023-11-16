/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ["Roboto", "Helvetica", "Arial", 'sans-serif']
      },
      colors: {
        blckprimary: '#244679',
        primary: '#4B68EF',
        dark: '#252D39',
        soft: '#F6F7F8'
      }
    },
  },
  plugins: [],
}