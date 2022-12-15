/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio")
  ],
  safelist: [
    'bg-red-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-indigo-700'
  ],
  // variants: {
  //   extend: {
  //     opacity: ['disabled'],
  //     backgroundColor: ['disabled']
  //   }
  // }
}
