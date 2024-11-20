/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./views/**/*.ejs", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'line-blue': '#046baf',
        'line-red': '#e70614',
      }
    },
  },
  plugins: [],
}