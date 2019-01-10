import Component from '@ember/component';

export default Component.extend({
  disabled: false,
  value: '',
  placeholder: '',
  autocomplete: 'off',
  autofocus: false,
  multiple: false,
  options: null,

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  },

  actions: {

    handleBlur() {
      this.onBlur();
    },

    handleClick() {
      this.onFocus();
    },

    handleChange(value) {
      this.onChange(value);
    }

  }

});
