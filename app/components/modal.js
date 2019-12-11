import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  animation: service(),

  animationDuration: reads('animation.durations.quick'),
  transition: reads('animation.transitions.fade'),

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
