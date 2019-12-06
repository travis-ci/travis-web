import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  tagName: '',

  durations: service(),

  animationDuration: reads('durations.quick'),
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
