import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, bool, empty, not } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),

  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  hasExpiredStripeSubscription: bool('account.expiredStripeSubscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('account.v2subscription'),
  hasV2Subscription: not('isV2SubscriptionEmpty'),

  isProcessCompleted: computed(function () {
    return this.hasV2Subscription;
  }),

  newSubscription: computed(function () {
    const plan = this.store.createRecord('v2-plan-config');
    const billingInfo = this.store.createRecord('v2-billing-info');
    const creditCardInfo = this.store.createRecord('v2-credit-card-info');
    billingInfo.setProperties({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      billingEmail: ''
    });
    creditCardInfo.setProperties({
      token: '',
      lastDigits: ''
    });
    return this.store.createRecord('v2-subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  }),
});
