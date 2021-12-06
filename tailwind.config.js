const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './public/index.html'],
    safelist: ['/safe$/'],
  },
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
