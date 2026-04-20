/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: '#020c1b',
        card: '#0a192f',
        card2: '#0d2040',
        accent: '#64ffda',
        aqua: '#00e9fa',
        dim: '#8892b0',
        red: '#ff6b6b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}