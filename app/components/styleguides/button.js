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
    light: 100,
    main: 300,
    dark: 300,
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

  variantSet: computed(() => VARIANTS),
  variant: DEFAULT_VARIANT,
  color: DEFAULT_COLOR,
  shades: computed('currentColor', function () {
    const { currentColor } = this;
    return COLORSETS[currentColor] || DEFAULT_SHADES;
  }),

  currentColor: computed('color', 'disabled', function () {
    return this.disabled ? 'grey' : this.color;
  }),
  currentShades: computed('disabled', 'shades', function () {
    return this.disabled ? COLORSETS['disabled'] : this.shades;
  }),

  variantClasses: computed('currentColor', 'currentShades', 'variant', 'variantSet', function () {
    const { currentColor, currentShades, variant: variantName, variantSet } = this;
    const getVariantClasses = variantSet[variantName] || VARIANTS[DEFAULT_VARIANT];

    const classes = getVariantClasses(currentColor, currentShades);

    return classes.join(' ');
  }),

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle();
    }
  }
});
