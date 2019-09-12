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
  selectedCancellationReason: null,
  cancellationReasonDetails: null,

  cancelSubscription: task(function* () {
    yield this.subscription.cancelSubscription.perform({
      reason: this.selectedCancellationReason,
      reason_details: this.cancellationReasonDetails
    });
  }).drop(),

  actions: {
    selectCancellationReason(reason) {
      if (this.selectedCancellationReason === reason.name) {
        this.set('selectedCancellationReason', null);
      } else {
        this.set('selectedCancellationReason', reason.name);
      }
    },
  }
});
