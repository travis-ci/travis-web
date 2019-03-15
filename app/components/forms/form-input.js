import Component from '@ember/component';

export default Component.extend({
  tagName: 'input',
  classNames: ['travis-form__field-input'],
  attributeBindings: ['disabled', 'type', 'value', 'placeholder', 'autocomplete', 'autofocus'],

  disabled: false,
  type: 'text',
  value: '',
  placeholder: '',
  autocomplete: 'off',
  autofocus: false,

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
    this.onChange && this.onChange(target.value);
  },

  keyUp({ target }) {
    this.onKeyUp && this.onKeyUp(target.value);
  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  }

});
