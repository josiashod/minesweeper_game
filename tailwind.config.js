/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        towards: ["Towards", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
