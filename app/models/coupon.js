import Model, { attr } from '@ember-data/model';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  percentageOff: attr('number'),
  amountOff: attr('number'),
  valid: attr('boolean'),
  couponResult: null,

  discountedPrice: computed('couponResult.{amount_off,percent_off}', 'selectedPlan.price', function () {
    const price = Math.floor(this.selectedPlan.price / 100);
    if (this.couponResult && this.couponResult.amount_off) {
      const amountOff = this.couponResult.amount_off;
      const discountedPrice = price - Math.floor(amountOff / 100);
      return `$${discountedPrice}`;
    } else if (this.couponResult && this.couponResult.percent_off) {
      const percentageOff = this.couponResult.percent_off;
      const discountedPrice = price - (price * percentageOff) / 100;
      return `$${discountedPrice.toFixed(2)}`;
    } {
      return `$${price}`;
    }
  }),

  validateCoupon: task(function* () {
    try {
      const result = yield this.api.get(`/coupons/${this.coupon}`);
      this.set('couponResult', result);
    } catch (error) {
      const { error_type: errorType } = error.responseJSON;
      if (errorType === 'not_found') {
        this.set('couponResult', error.responseJSON);
      } else {
        this.raven.logException('Coupon validation error');
      }
    }
  }).drop(),
});
