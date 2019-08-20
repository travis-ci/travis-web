import Component from '@ember/component';
import { reads, or }  from '@ember/object/computed';

export default Component.extend({

  cancelSubscriptionLoading: reads('subscription.cancelSubscription.isRunning'),
  canceledOrExpired: or('isExpired', 'isCanceled'),
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
