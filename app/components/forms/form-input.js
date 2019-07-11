import Component from '@ember/component';

export default Component.extend({
  tagName: 'input',
  classNames: ['travis-form__field-input', 'travis-form__field-component'],
  attributeBindings: [
    'disabled',
    'type',
    'value',
    'name',
    'placeholder',
    'autocomplete',
    'autofocus',
    'input:data-test-input-field'
  ],
  input: true,

  name: '',
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
