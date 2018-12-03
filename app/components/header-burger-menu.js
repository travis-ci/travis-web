import Component from '@ember/component';

export default Component.extend({
  actions: {
    toggleBurgerMenu() {
      this.toggleProperty('is-open');
      return false;
    },
  },
});
