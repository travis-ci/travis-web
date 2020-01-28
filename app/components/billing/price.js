import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, not, reads } from '@ember/object/computed';

export default Component.extend({
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  isNotGithubTrial: not('isGithubTrial'),
  isValidDiscount: reads('subscription.discount.valid'),
  percentOff: reads('subscription.discount.percentOff'),
  amountOffInCents: reads('subscription.discount.amountOff'),
  amountOff: computed('amountOffInCents', function () {
    return this.amountOffInCents && Math.floor(this.amountOffInCents / 100);
  }),
});
