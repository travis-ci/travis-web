import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({

  selectedPlanPrice: reads('selectedPlan.price'),

  price: computed('totalPrice', 'selectedPlanPrice', function () {
    return this.totalPrice || Math.floor(this.selectedPlanPrice / 100);
  })
});
