import Button from 'travis/components/styleguides/button';
import { computed } from '@ember/object';

export const DEFAULT_VARIANT = 'switch';
export const VARIANTS = {
  switch: (color, shades) => [
    `bg-${color}-${shades['main']}`,
    `text-${color}-${shades['main']}`,
  ],
};

export default Button.extend({
  classNameBindings: ['active:active', 'widthClass', 'spaceClass'],

  defaultClasses: 'rounded-full p-px',

  dotSize: 4,
  spaceSize: computed('dotSize', function () {
    return this.dotSize + 1;
  }),
  active: false,
  description: '',

  variantSet: computed(() => VARIANTS),
  variant: DEFAULT_VARIANT,
  shades: computed(() => ({main: 300})),

  currentColor: computed('color', 'disabled', 'active', function () {
    return this.disabled || !this.active ? 'grey' : this.color;
  }),

  spaceClass: computed('spaceSize', 'active', function () {
    const { spaceSize, active } = this;
    const prefix = active ? 'pl' : 'pr';
    return `${prefix}-${spaceSize}`;
  }),

  'aria-checked': computed('active', function () {
    return this.active ? 'true' : 'false';
  }),

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
