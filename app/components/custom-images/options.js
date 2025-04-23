import Component from '@ember/component';

export default Component.extend({
  isOpen: false,

  close() {
    this.set('isOpen', false);
  },

  toggle() {
    this.set('isOpen', !this.isOpen);
  },
});
