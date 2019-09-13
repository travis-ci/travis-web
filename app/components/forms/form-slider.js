import Component from '@ember/component';

export default Component.extend({
  classNames: ['travis-form__field--slider'],

  max: '',
  min: '',
  value: '',
  step: 1,
  list: '',

  onInit() {},
  onChange() {},

  input({ target }) {
    this.set('value', target.value);
    this.onChange(this.value);
  },

  didInsertElement() {
    this._super(...arguments);
    this.onInit(this.elementId);
  },

});
