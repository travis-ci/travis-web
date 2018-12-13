import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty, bool, not, and } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  account: null,

  subscription: reads('account.subscription'),
  isSubscriptionEmpty: empty('subscription'),
  trial: reads('account.trial'),
  isEducationalAccount: bool('account.education'),
  isNotEducationalAccount: not('isEducationalAccount'),

  isTrial: and('isSubscriptionEmpty', 'isNotEducationalAccount'),
  isManual: bool('subscription.isManual'),
  isManaged: bool('subscription.managedSubscription'),
  isEducation: and('isSubscriptionEmpty', 'isEducationalAccount'),

  invoices: computed('subscription.id', function () {
    let subscriptionId = this.get('subscription.id');
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  }),

  actions: {
    // These are for debugging
    overrideStatus(status) {
      let subscription = this.get('subscription');

      if (!subscription && status) {
        subscription = this.store.createRecord('subscription', {
          source: 'stripe',
          plan: this.findOrCreatePlan('free-plan'),
          permissions: {
            write: true
          }
        });
        this.set('account.subscription', subscription);
      }

      if (status) {
        this.set('subscription.status', status);
      } else {
        this.set('account.subscription', undefined);
      }
    },

    overrideToFree() {
      this.set('subscription.plan', this.findOrCreatePlan('free-plan'));
    },

    overrideToTwoBuilds() {
      this.set('subscription.plan', this.findOrCreatePlan('travis-ci-two-builds'));
    },
  },

  findOrCreatePlan(id) {
    return this.store.peekRecord('plan', id) ||
      this.store.createRecord('plan', {
        id,
        builds: 1,
        price: 1919
      });
  },
});
