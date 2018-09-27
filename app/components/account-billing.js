import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads, empty, bool } from '@ember/object/computed';

export default Component.extend({
  @service store: null,

  account: null,

  subscription: reads('account.subscription'),
  trial: reads('account.trial'),

  isTrial: empty('subscription'),
  isManual: bool('subscription.isManual'),
  isManaged: bool('subscription.managedSubscription'),

  @computed('subscription.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  }
});
