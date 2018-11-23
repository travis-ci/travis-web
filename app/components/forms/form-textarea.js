import Component from '@ember/component';

export default Component.extend({
  tagName: 'textarea',
  classNames: ['travis-form__field-textarea'],
  attributeBindings: ['disabled', 'placeholder', 'rows', 'readonly'],

  disabled: false,
  readonly: false,
  placeholder: '',
  rows: 2,

  value: '',

  onChange() {},
  onFocus() {},
  onBlur() {},

  focusIn() {
    this.onFocus();
  },

  focusOut() {
    this.onBlur(this.value);
  },

  change({ target }) {
    this.set('value', target.value);
    this.onChange(this.value);
  }
});
