import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads, empty, bool, not, and } from '@ember/object/computed';

export default Component.extend({
  @service store: null,

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

  @computed('subscription.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  }
});
