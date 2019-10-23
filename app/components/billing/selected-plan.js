import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  price: computed('totalPrice', 'selectedPlan.price', function () {
    return this.totalPrice || Math.floor(this.selectedPlan.price / 100);
  })
});
