import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty, bool, not, and } from '@ember/object/computed';

export default Component.extend({
  store: service(),
  accounts: service(),

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
      return this.store.query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  }),
});
