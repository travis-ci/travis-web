import Component from '@ember/component';
import { computed } from '@ember/object';
import abstractMethod from 'travis/utils/abstract-method';

export default Component.extend({
  tagName: 'button',
  classNames: ['travis-switch', 'switch', 'inline-block'],
  classNameBindings: ['active:active', 'disabled:disabled'],
  attributeBindings: ['aria-checked', 'role', 'type'],

  type: 'button',
  role: 'switch',
  description: '',
  active: false,
  disabled: false,

  'aria-checked': computed('active', function () {
    return this.get('active') ? 'true' : 'false';
  }),

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
