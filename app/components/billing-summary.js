import Component from '@ember/component';
import { reads }  from '@ember/object/computed';

export default Component.extend({

  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  resubscribeLoading: reads('subscription.resubscribe.isRunning'),

  actions: {

    cancelSubscription() {
      this.subscription.cancelSubscription.perform();
    },

    resubscribe() {
      this.subscription.resubscribe.perform();
    }
  }
});
