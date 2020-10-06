import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  creditsTab: 0,
  creditsPublicTotal: reads('subscription.addonUsage.public.totalCredits'),
  creditsPublicUsed: reads('subscription.addonUsage.public.usedCredits'),
  creditsPublicAvailable: reads('subscription.addonUsage.public.remainingCredits'),
  creditsPublicValidDate: reads('subscription.addonUsage.public.validDate'),
  creditsPrivateTotal: reads('subscription.addonUsage.private.totalCredits'),
  creditsPrivateUsed: reads('subscription.addonUsage.private.usedCredits'),
  creditsPrivateAvailable: reads('subscription.addonUsage.private.remainingCredits'),
  creditsPrivatePurchaseDate: reads('subscription.addonUsage.private.purchaseDate'),

  creditsTotal: computed('creditsTab', 'creditsPublicTotal', 'creditsPrivateTotal', function () {
    if (this.creditsTab === 1)
      return this.creditsPublicTotal;
    return this.creditsPrivateTotal;
  }),

  creditsUsed: computed('creditsTab', 'creditsPublicUsed', 'creditsPrivateUsed', function () {
    if (this.creditsTab === 1)
      return this.creditsPublicUsed;
    return this.creditsPrivateUsed;
  }),

  creditsAvailable: computed('creditsTab', 'creditsPublicAvailable', 'creditsPrivateAvailable', function () {
    if (this.creditsTab === 1)
      return this.creditsPublicAvailable;
    return this.creditsPrivateAvailable;
  }),

  creditsUsedPercentage: computed('creditsAvailable', 'creditsTotal', function () {
    return (this.creditsAvailable / this.creditsTotal) * 100;
  }),

  isNegativeBalance: computed('creditsAvailable', function () {
    return this.creditsAvailable < 0;
  }),

  actions: {
    setPrivateCreditsTab() {
      this.set('creditsTab', 0);
    },

    setOSSCreditsTab() {
      this.set('creditsTab', 1);
    }
  }

});
