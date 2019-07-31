import Component from '@ember/component';
import { reads, not } from '@ember/object/computed';

export default Component.extend({
  account: null,

  subscription: reads('account.subscription'),
  trial: reads('account.trial'),
  startBillingProcess: false,
  hasNoSubscriptionPermissions: not('account.hasSubscriptionPermissions'),

  actions: {
    startBillingProcess() {
      if (this.account.hasSubscriptionPermissions) {
        this.set('startBillingProcess', true);
      }
    }
  }
});
