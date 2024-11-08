import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { typeOf } from '@ember/utils';

export default Component.extend({

  selectedPlanPrice: reads('selectedPlan.price'),

  price: computed('totalPrice', 'selectedPlanPrice', function () {
    return typeOf(this.totalPrice) === 'number' && this.totalPrice >= 0 ? this.totalPrice : Math.floor(this.selectedPlanPrice / 100);
  }),

  hasPremiumVM: computed('selectedPlan', function () {
    console.log(this.selectedPlan);
    return this.selectedPlan.vmSize != null;
  })
});
