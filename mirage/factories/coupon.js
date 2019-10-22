import { Factory } from 'ember-cli-mirage';

export default Factory.extend({

  id(i) {
    return `VALID_COUPON_${i}`;
  },

  name(i) {
    return `VALID_COUPON_${i}`;
  },

  // Only one of percentageOff and amountOff attributes can contain a value
  percentageOff(i) {
    return i === 0 ? 10 : null;
  },

  amountOff(i) {
    return i > 0 ? 1000 : null;
  },

  valid() {
    return true;
  },
});
