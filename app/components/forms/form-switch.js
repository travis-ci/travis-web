import Component from '@ember/component';
import { computed } from '@ember/object';
import abstractMethod from 'travis/utils/abstract-method';

export default Component.extend({
  tagName: 'button',
  classNames: ['switch', 'inline-block', 'travis-form__field--switch'],
  classNameBindings: ['checked:active', 'disabled:disabled'],
  attributeBindings: ['ariaChecked:aria-checked', 'role', 'type'],

  type: 'button',
  role: 'switch',
  checked: false,
  disabled: false,

  onInit() {},
  onChange() {},

  onToggle: abstractMethod('onToggle'),

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  },

  'aria-checked': computed('checked', function () {
    return this.get('checked') ? 'true' : 'false';
  }),

  click() {
    if (!this.disabled) {
      this.onChange(!this.checked);
    }
  }
});
