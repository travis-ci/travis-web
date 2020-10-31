import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  newSubscription: null,

  billingInfo: reads('subscription.billingInfo'),

  actions: {
    updateEmails(values) {
      this.billingInfo.set('billingEmail', values.join(','));
    },
  }
});
