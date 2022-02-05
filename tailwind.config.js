const colors = require('tailwindcss/colors');

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        Staatliches: ['Staatliches', 'sans-serif'],
        Exo: ['Exo', 'sans-serif'],
        Inconsolata: ['Inconsolata', 'sans-serif'],
        Karma: ['Karma', 'sans-serif'],
      },
      colors: {
        stone: colors.stone,
        rose: colors.rose,
        orange: colors.orange,
        indigo: colors.indigo,
        purple: colors.purple,
        emerald: colors.emerald,
        violet: colors.violet,
        cyan: colors.cyan,
        blue: colors.blue,
        sky: colors.sky,
        green: colors.green,
        gray: colors.gray,
        yellow: colors.yellow,
        mostlyBlack: '#080404',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
