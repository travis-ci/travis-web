import Component from '@ember/component';
import abstractMethod from 'travis/utils/abstract-method';

export default Component.extend({
  tagName: 'button',
  classNames: ['bg-grey-700', 'text-white', 'font-bold', 'py-2', 'px-3', 'rounded'],
  classNameBindings: ['disabled'],
  attributeBindings: ['role', 'type'],

  type: 'button',
  role: 'button',
  disabled: false,

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
