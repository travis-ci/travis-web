import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Component.extend({
  newSubscription: null,

  billingInfo: reads('subscription.billingInfo'),

  actions: {
    updateEmails(values) {
      this.billingInfo.set('billingEmail', values.join(','));
    },
  }
});
