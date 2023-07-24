import Component from '@ember/component';

export default Component.extend({
  classNames: ['travis-form__field-radio'],
  classNameBindings: [
    'disabled:travis-form__field-radio--disabled',
    'checked:travis-form__field-radio--checked:travis-form__field-radio--unchecked'
  ],

  disabled: false,
  checked: false,

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},

  click() {
    if (!this.disabled)
      this.send('toggle');
  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  },

  actions: {

    toggle() {
      if (!this.disabled)
        this.onChange(!this.checked);
    },

    focus() {
      if (!this.disabled)
        this.onFocus();
    },

    blur() {
      if (!this.disabled)
        this.onBlur();
    }

  }

});
