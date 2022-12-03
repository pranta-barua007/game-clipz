/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-400',
    'bg-green-400',
    'bg-blue-400',
  ],
  // variants: {
  //   extend: {
  //     opacity: ['disabled'],
  //     backgroundColor: ['disabled']
  //   }
  // }
}
