import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  tagName: '',

  durations: service(),

  animationDuration: reads('durations.quick'),
  transition: fade,

  closeOnClickOverlay: true,
  closeButton: false,
  isVisible: true,
  position: 'fixed',

  onClose() {
  },

  onClickOverlay() {
    if (this.closeOnClickOverlay) {
      this.onClose();
    }
  },

  onClickModal(event) {
    event.stopPropagation();
  },
});
