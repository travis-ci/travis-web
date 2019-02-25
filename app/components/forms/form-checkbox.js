import Component from '@ember/component';

export default Component.extend({
  classNames: ['travis-form__field-checkbox'],
  classNameBindings: [
    'disabled:travis-form__field-checkbox--disabled',
    'checked:travis-form__field-checkbox--checked:travis-form__field-checkbox--unchecked'
  ],

  disabled: false,
  checked: false,

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},

  click() {
    this.send('toggle');
  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  },

  actions: {

    toggle() {
      this.onChange(!this.checked);
    },

    focus() {
      this.onFocus();
    },

    blur() {
      this.onBlur();
    }

  }

});
