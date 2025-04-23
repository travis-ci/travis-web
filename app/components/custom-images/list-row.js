import Component from '@ember/component';

export default Component.extend({
  dropupIsOpen: false,

  openDropup() {
    this.set('dropupIsOpen', true);
  },

  closeDropup() {
    this.set('dropupIsOpen', false);
  },
});
