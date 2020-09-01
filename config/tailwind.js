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
        90: '#fce8e2',
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
        600: '#c1a417',
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
        concrete: '#9ea3a8',
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
      '3xs': '0.7778rem',
      '2xs': '0.875rem',
      xs: '1rem',
      sm: '1.125rem',
      md: '1.2857rem',
      lg: '1.325rem',
      xl: '1.425rem',
      '2xl': '1.6rem',
      '3xl': '1.875rem',
      '4xl': '2.125rem',
      '5xl': '3rem',
      '6xl': '4.75rem',
    },
    letterSpacing: {
      sm: '-0.025em',
      md: '0',
      lg: '0.025em',
    },
    lineHeight: {
      none: '1',
      '2xs': '1.15',
      xs: '1.25',
      sm: '1.375',
      md: '1.5',
      lg: '1.7',
      xl: '2',
    },

    // Block Props //
    borderColor: theme => ({
      ...theme('colors'),
      default: theme('colors.grey.150', 'currentColor'),
    }),
    borderWidth: {
      none: '0',
      px: '1px',
      sm: '0.1429rem',
      md: '0.25rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.1429rem',
      md: '0.25rem',
      lg: '0.5rem',
      full: '9999px',
    },
    boxShadow: {
      sm: '0 0 3px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 0 6px -0px rgba(0, 0, 0, 0.1), 0 0 4px -0px rgba(0, 0, 0, 0.06)',
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
      '7': '1.75rem',
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

    // Height & Width //
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
      'max-content': 'max-content',
    }),
    maxHeight: {
      full: '100%',
      screen: '100vh',
    },
    maxWidth: {
      '2xs': '16rem',
      xs: '20rem',
      sm: '24rem',
      md: '30rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '73.1429rem', // 1024px
      full: '100%',
    },
    minHeight: {
      '0': '0',
      full: '100%',
      screen: '100vh',
    },
    minWidth: {
      '0': '0',
      md: '16rem',
      full: '100%',
    },

    /* ~~ Extend ~~ */
    extend: {
      flex: {
        'grow-single': '1 0 auto',
        'shrink-single': '0 1 auto',
        'resize-single': '1 1 auto',
      },
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
