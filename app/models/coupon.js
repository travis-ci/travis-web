import Model, { attr } from '@ember-data/model';
import { task } from 'ember-concurrency';
import { reads, not } from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  percentageOff: attr('number'),
  amountOff: attr('number'),
  valid: attr('boolean'),
  couponResult: reads('validateCoupon.lastSuccessful.value'),
  isValidCoupon: reads('couponResult.valid'),
  isInvalidCoupon: not('isValidCoupon'),

  // validateCoupon: task(function* () {
  //   try {
  //     const result = yield this.api.get(`/coupons/${this.coupon}`);
  //     this.set('couponResult', result);
  //   } catch (error) {
  //     const { error_type: errorType } = error.responseJSON;
  //     if (errorType === 'not_found') {
  //       this.set('couponResult', error.responseJSON);
  //     } else {
  //       this.raven.logException('Coupon validation error');
  //     }
  //   }
  // }).drop(),

  validateCoupon: task(function* (couponId) {
    try {
      debugger;
      return yield this.store.findRecord('coupon', couponId, {
        reload: true,
      });
    } catch (error) {
    }
  }).drop(),
});
