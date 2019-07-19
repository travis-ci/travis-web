import Component from '@ember/component';
import abstractMethod from 'travis/utils/abstract-method';
import { computed } from '@ember/object';

export const DEFAULT_COLOR = 'blue';
export const COLORS = {
  blue: { main: 'blue-400', light: 'blue-100', dark: 'blue-500'},
  green: { main: 'green-400', light: 'green-100', dark: 'green-500'},
};

export const DEFAULT_VARIANT = 'fill';
export const VARIANTS = {
  fill: (colors) => [
    `bg-${colors['main']}`,
    'text-white',
    `hover:bg-${colors['dark']}`,
  ],

  outline: (colors) => [
    `text-${colors['main']}`,
    'border',
    'border-solid',
    `border-${colors['main']}`,
    `hover:bg-${colors['light']}`,
  ],
};

export default Component.extend({
  tagName: 'button',
  classNameBindings: ['disabled', 'defaultClasses', 'variantClasses'],
  attributeBindings: ['role', 'type'],

  type: 'button',
  role: 'button',
  disabled: false,

  defaultClasses: 'rounded uppercase px-3 py-2 font-bold',
  color: DEFAULT_COLOR,
  variant: DEFAULT_VARIANT,

  variantClasses: computed('color', 'variant', function () {
    const { color: colorName, variant: variantName } = this;
    const colorSet = COLORS[colorName] || COLORS[DEFAULT_COLOR];
    const variant = VARIANTS[variantName] || VARIANTS[DEFAULT_VARIANT];

    const classes = variant(colorSet);

    return classes.join(' ');
  }),

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
