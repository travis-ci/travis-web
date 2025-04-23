import Component from '@ember/component';

export default Component.extend({
  classNames: ['square-checkbox'],
  classNameBindings: [
    'disabled:square-checkbox--disabled',
    'checked:square-checkbox--checked:square-checkbox--unchecked'
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
