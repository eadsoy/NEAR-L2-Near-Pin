const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {   
    extend: {
      colors: {
        transparent: 'transparent',
        'blue-gray': colors.blueGray,
        'rose': colors.rose,
        'teal': colors.teal,
        'cool-gray': colors.coolGray
      }
    }
  },
  variants: {
    extend: {
      textColor: ['visited'],
      opacity: ['disabled']
    },
  },
  plugins: [],
}
