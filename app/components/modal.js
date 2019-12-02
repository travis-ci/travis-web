import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  clickOutsideToClose: true,
  closeButton: false,
  isVisible: true,
  position: 'fixed',

  onClose() {
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
