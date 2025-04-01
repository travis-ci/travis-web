import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, bool, empty, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  store: service(),
  flashes: service(),
  auth: service(),
  currentUser: alias('auth.currentUser'),
  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  hasExpiredStripeSubscription: bool('account.expiredStripeSubscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('account.v2subscription'),
  hasV2Subscription: not('isV2SubscriptionEmpty'),

  isProcessCompleted: computed({
    get() {
      if (isPresent(this._isProcessCompleted)) {
        return this._isProcessCompleted;
      }

      return this.hasV2Subscription;
    },
    set(k, v) {
      this.set('_isProcessCompleted', v);
      return this._isProcessCompleted;
    }
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

  didReceiveAttrs() {
    const date = new Date();
    if (this.v2subscription && this.v2subscription.scheduledPlanName) {
      this.flashes.custom('flashes/scheduled-plan-change',
        {
          scheduledPlan: this.v2subscription.scheduledPlan,
          date: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        },
        'scheduled-plan-change'
      );
      this.storage.setItem('scheduled-plan-change', this.currentUser.id);
    }
  }
});
