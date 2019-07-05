/* eslint-env node */

module.exports = {
  theme: {
    /* ~~ Override ~~ */

    // Colors //
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',

      // Accent Color
      blue: {
        default: '#0068ff',
        hover: '#0558dd',
        medium: '#66a4ff',
        light: '#cce1ff',
        'light-2': '#deefff',
      },

      // Passing Color
      green: {
        default: '#32d282',
        hover: '#049661',
        text: '#15b75e',
        medium: '#adedcd',
        light: '#e6faf0',
      },

      // Failing Color
      red: {
        default: '#ff5050',
        hover: '#e23a3c',
        medium: '#ffabab',
        light: '#ffdcdc',
      },

      // Errored Color
      orange: {
        default: '#ff8c3e',
        hover: '#f27520',
        medium: '#ffba8b',
        light: '#ffe8d8',
      },

      // Running Color
      yellow: {
        default: '#ffe000',
        hover: '#efcc03',
        text: '#dcc800',
        medium: '#f9f3a5',
        light: '#fcf5cd',
      },

      // Cacelled Color
      grey: {
        default: '#8794a0',
        hover: '#7b868e',
        medium: '#b4bfca',
        light: '#d5e0ea',
      },

      // Neutrals
      neutral: {
        '1': '#333333',
        '2': '#686b6e',
        '3': '#9ea3a8',
        '4': '#dcdfe2',
        '5': '#eef0f4',
        '6': '#f6f7fa',
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
    }
  },
  variants: {},
  plugins: []
};
