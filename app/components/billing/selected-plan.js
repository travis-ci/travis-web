import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  price: computed('discountedPrice', 'selectedPlan.price', function () {
    if (this.discountedPrice) {
      return `${this.discountedPrice}`;
    } else {
      return `$${Math.floor(this.selectedPlan.price / 100)}`;
    }
  })
});
