import Component from '@ember/component';
import { task } from 'ember-concurrency';

const cancellationReasons = [
  { name: 'Price' },
  { name: 'Support' },
  { name: 'Build Times' },
  { name: 'End of Project' },
  { name: 'Other' },
];

export default Component.extend({
  cancellationReasons,
  showCancelReasonValidation: false,
  selectedCancellationReason: null,
  cancellationReasonDetails: null,
  isOpen: false,

  cancelSubscription: task(function* () {
    if (this.selectedCancellationReason) {
      yield this.subscription.cancelSubscription.perform({
        reason: this.selectedCancellationReason,
        reason_details: this.cancellationReasonDetails
      });
      this.set('isOpen', false);
    } else {
      this.set('showCancelReasonValidation', true);
    }
  }).drop(),

  actions: {
    selectCancellationReason(reason) {
      this.set('selectedCancellationReason', reason.name);
    },
  }
});
