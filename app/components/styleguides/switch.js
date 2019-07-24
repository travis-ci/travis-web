import Button from 'travis/components/styleguides/button';
import { computed } from '@ember/object';

export default Button.extend({
  classNameBindings: ['active:active', 'widthClass', 'spaceClass'],

  defaultClasses: 'rounded-full p-px',

  dotSize: 4,
  active: false,
  description: '',
  // width: computed('dotSize', function () {
  //   return this.dotSize * 2;
  // }),
  // widthClass: computed('width', function () {
  //   return `w-${this.width}`;
  // }),
  spaceClass: computed('dotSize', 'active', function () {
    const { dotSize, active } = this;
    const prefix = active ? 'pl' : 'pr';
    return `${prefix}-${dotSize + 1}`;
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
