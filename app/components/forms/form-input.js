import Component from '@ember/component';

export default Component.extend({
  tagName: 'input',
  classNames: ['travis-form__field-input'],
  attributeBindings: ['disabled', 'type', 'value', 'placeholder'],

  disabled: false,
  type: 'text',
  value: '',
  placeholder: '',

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},

  focusIn() {
    this.onFocus();
  },

  focusOut() {
    this.onBlur();
  },

  change({ target }) {
    this.onChange(target.value);
  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  }

});
