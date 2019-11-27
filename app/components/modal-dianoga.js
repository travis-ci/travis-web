import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  clickOutsideToClose: true,
  isVisible: true,
  position: 'fixed',

  onClose() {
    this.set('isVisible', false);
  },

  actions: {
    onClose() {
      this.onClose();
    },

    clickOverlay() {
      if (this.clickOutsideToClose) {
        this.onClose();
      }
    },
  },
});
