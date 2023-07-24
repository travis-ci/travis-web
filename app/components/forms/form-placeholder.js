import Component from '@ember/component';

export default Component.extend({
  tagName: 'placeholder',
  classNames: ['travis-form__field-placeholder', 'travis-form__field-component'],
  attributeBindings: [
  ],

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},
  onKeyUp() {},

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
