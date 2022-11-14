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
  lastClickInside: false,

  onClose() {
  },

  onClickOverlay() {
    if (!this.lastClickInside && this.closeOnClickOverlay) {
      this.onClose();
    }
    this.lastClickInside = false;
  },

  onClickModal(event) {
    this.lastClickInside = true;
  },
});
