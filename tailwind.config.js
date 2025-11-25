/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.hbs", // todas tus vistas HBS
    "./public/**/*.js"  // si usas JS en public
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcss()],
}
