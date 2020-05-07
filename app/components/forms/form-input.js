import Component from '@ember/component';

export default Component.extend({
  tagName: '',
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
  onKeyUp() {},

  actions: {

    onFocusIn() {
      this.onFocus();
    },

    onFocusOut() {
      this.onBlur();
    },

    onChange({ target }) {
      this.onChange && this.onChange(target.value);
    },

    keyUp({ target }) {
      this.onKeyUp && this.onKeyUp(target.value);
    },

  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  }

});
