import Component from '@ember/component';
import { task } from 'ember-concurrency';

const switchToFreeReasons = [
  { name: 'Price' },
  { name: 'Support' },
  { name: 'Build Times' },
  { name: 'End of Project' },
  { name: 'Other' },
];

export default Component.extend({
  switchToFreeReasons,
  selectedSwitchToFreeReason: null,
  switchToFreeReasonDetails: null,
  isOpen: false,

  switchToFreeSubscription: task(function* () {
    if (this.selectedSwitchToFreeReason) {
      yield this.subscription.switchToFreeSubscription.perform(this.selectedSwitchToFreeReason, this.switchToFreeReasonDetails);
      this.onClose();
    }
  }).drop(),

  actions: {
    selectSwitchToFreeReason(reason) {
      this.set('selectedSwitchToFreeReason', reason.name);
    },
  }
});
