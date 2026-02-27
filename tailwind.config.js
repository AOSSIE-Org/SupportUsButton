/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        sponsor: {
          primary: "#facc15",   // example accent color
          dark: "#111827"
        }
      }
    }
  },
  plugins: []
}