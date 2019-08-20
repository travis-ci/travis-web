/* eslint-env node */
const { tailwindScreenConfig } = require('./screens.js');

module.exports = {
  theme: {
    /* ~~ Override ~~ */

    screens: tailwindScreenConfig,

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
    lineHeight: {
      none: '1',
      '2xs': '1.15',
      xs: '1.25',
      sm: '1.375',
      md: '1.5',
      lg: '1.625',
      xl: '2',
    },

    // Block Props //
    borderWidth: {
      none: '0',
      '1': '1px',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      lg: '0.5rem',
      full: '9999px',
    },
    boxShadow: {
      sm: '0 0 3px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.06)',
      base: '0 0 6px -0px rgba(0, 0, 0, 0.1), 0 0 4px -0px rgba(0, 0, 0, 0.06)',
      none: 'none',
    },

    // Spacing Props //
    spacing: {
      px: '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '32': '8rem',
      '40': '10rem',
      '48': '12rem',
      '56': '14rem',
      '64': '16rem',
    },
    padding: theme => theme('spacing'),
    margin: (theme, { negative }) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...negative(theme('spacing')),
    }),
    height: theme => ({
      auto: 'auto',
      ...theme('spacing'),
      full: '100%',
      screen: '100vh',
    }),
    width: theme => ({
      auto: 'auto',
      ...theme('spacing'),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      screen: '100vw',
    }),

    /* ~~ Extend ~~ */
    extend: {
      fill: {
        transparent: 'transparent'
      },
      stroke: {
        transparent: 'transparent'
      },
    }
  },
  variants: {},
  plugins: []
};
