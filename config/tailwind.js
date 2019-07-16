/* eslint-env node */

const screenInfo = require('./screens.js')();
const screens = Object.keys(screenInfo).reduce((screenMap, key) => {
  const { min, units } = screenInfo[key];
  if (min === 0) {
    return screenMap;
  }

  screenMap[key] = `${min}${units}`;

  return screenMap;
}, {});

module.exports = {
  theme: {
    /* ~~ Override ~~ */

    screens,

    // Colors //
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',

      // Accent Color
      blue: {
        100: '#deefff',
        200: '#cce1ff',
        300: '#66a4ff',
        400: '#0068ff',
        default: '#0068ff',
        500: '#0558dd',
      },

      // Passing Color
      green: {
        100: '#e6faf0',
        200: '#adedcd',
        300: '#32d282',
        default: '#32d282',
        400: '#15b75e',
        500: '#049661',
      },

      // Failing Color
      red: {
        100: '#ffdcdc',
        200: '#ffabab',
        300: '#ff5050',
        default: '#ff5050',
        400: '#e23a3c',
      },

      // Errored Color
      orange: {
        100: '#ffe8d8',
        200: '#ffba8b',
        300: '#ff8c3e',
        default: '#ff8c3e',
        400: '#f27520',
      },

      // Running Color
      yellow: {
        100: '#fcf5cd',
        200: '#f9f3a5',
        300: '#ffe000',
        default: '#ffe000',
        400: '#efcc03',
        500: '#dcc800',
      },

      // Cancelled / Neutral Color
      grey: {
        100: '#f6f7fa',
        150: '#eef0f4',
        200: '#dcdfe2',
        250: '#d5e0ea',
        300: '#b4bfca',
        400: '#9ea3a8',
        500: '#8794a0',
        default: '#8794a0',
        600: '#7b868e',
        700: '#686b6e',
        800: '#333333',
      },
    },

    // Fonts //
    fontFamily: {
      sans: [
        '"Source Sans Pro"',
        'Helvetica',
        'sans-serif'
      ],
      mono: [
        'Cousine',
        'monospace'
      ],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },

    /* ~~ Extend ~~ */
    extend: {
      fill: {
        transparent: 'transparent'
      },
      stroke: {
        transparent: 'transparent'
      },
      boxShadow: {
        even: '0 0 3px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.06)',
        'even-md': '0 0 6px -0px rgba(0, 0, 0, 0.1), 0 0 4px -0px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  variants: {},
  plugins: []
};
