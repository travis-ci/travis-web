import Component from '@ember/component';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  tagName: '',

  transition: fade,

  clickOutsideToClose: true,
  closeButton: false,
  isVisible: true,
  position: 'fixed',

  onClose() {
  },

  clickModal(event) {
    event.stopPropagation();
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
