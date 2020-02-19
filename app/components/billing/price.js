import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, not, reads } from '@ember/object/computed';

export default Component.extend({
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  isNotGithubTrial: not('isGithubTrial'),
  discount: reads('subscription.discount'),
  durationInMonths: reads('discount.durationInMonths'),
  duration: reads('discount.duration'),
  discountIsValid: reads('discount.valid'),
  percentOff: reads('discount.percentOff'),
  amountOffInCents: reads('discount.amountOff'),
  amountOff: computed('amountOffInCents', function () {
    return this.amountOffInCents && Math.floor(this.amountOffInCents / 100);
  }),
});
