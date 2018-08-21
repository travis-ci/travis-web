import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

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

  @computed('active')
  'aria-checked'(active) {
    return active ? 'true' : 'false';
  },

  onToggle() {},

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
