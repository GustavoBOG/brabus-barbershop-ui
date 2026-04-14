/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A", // Neutral de la guía
        primary: "#d4af37",
        secondary: "#cd7f32",
        tertiary: "#97b0ff",
        card: "#18181b", // Gris oscuro para tarjetas
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
