import Component from '@ember/component';
import abstractMethod from 'travis/utils/abstract-method';
import { computed } from '@ember/object';

const DEFAULT_SHADES = {
  light: 100,
  main: 400,
  dark: 500,
};

const DEFAULT_COLOR = 'blue';
const COLORSETS = {
  disabled: {
    color: 'grey',
    shades: {
      light: 100,
      main: 300,
      dark: 300,
    }
  }
};

export const DEFAULT_VARIANT = 'fill';
export const VARIANTS = {
  fill: (color, shades) => [
    `bg-${color}-${shades['main']}`,
    'text-white',
    `hover:bg-${color}-${shades['dark']}`,
  ],

  outline: (color, shades) => [
    `text-${color}-${shades['main']}`,
    'border',
    'border-solid',
    `border-${color}-${shades['main']}`,
    `hover:bg-${color}-${shades['light']}`,
  ],
};

export default Component.extend({
  tagName: 'button',
  classNameBindings: ['defaultClasses', 'variantClasses'],
  attributeBindings: ['role', 'type', 'disabled'],

  type: 'button',
  role: 'button',
  disabled: false,
  defaultClasses: 'rounded uppercase px-3 py-2 font-bold',

  defaultShades: computed(() => DEFAULT_SHADES),
  colorSetDefs: computed(() => COLORSETS),
  variantDefs: computed(() => VARIANTS),
  variant: DEFAULT_VARIANT,
  color: DEFAULT_COLOR,

  colorSet: computed('disabled', 'color', 'colorSetDefs', 'defaultShades', function () {
    const { color, colorSetDefs, defaultShades, disabled } = this;
    return disabled ?
      colorSetDefs['disabled'] :
      colorSetDefs[color] || { color, shades: defaultShades };
  }),
  currentVariant: computed('variant', 'variantDefs', function () {
    const { variant: variantName, variantDefs } = this;
    return variantDefs[variantName] || VARIANTS[DEFAULT_VARIANT];
  }),

  variantClasses: computed('colorSet.color', 'colorSet.shades.{light,main,dark}', 'currentVariant', function () {
    const { currentVariant } = this;
    const { color, shades } = this.colorSet;

    const classes = currentVariant(color, shades);
    return classes.join(' ');
  }),

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle();
    }
  }
});
