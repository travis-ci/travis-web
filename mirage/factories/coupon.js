import { Factory } from 'ember-cli-mirage';

export default Factory.extend({

  id(i) {
    return `VALID_COUPON_${i}`;
  },

  name(i) {
    return `VALID_COUPON_${i}`;
  },

  percentOff(i) {
    return i === 0 ? 15 : null;
  },

  amountOff(i) {
    if (i === 1) {
      return 1000;
    } else if (i > 1) {
      return 10000000;
    } else {
      return null;
    }
  },

  valid() {
    return true;
  },
});
