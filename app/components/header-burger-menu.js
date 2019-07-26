import Component from '@ember/component';

export default Component.extend({
  actions: {
    toggleBurgerMenu() {
      this.toggleProperty('isOpen');
      return false;
    },
  },
});
