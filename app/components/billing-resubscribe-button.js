import Component from '@ember/component';
import { reads, or } from '@ember/object/computed';

export default Component.extend({
  isActiveGithubSubscription: reads('githubSubscription.isSubscribed'),
  isResubscribable: or('githubSubscription.isGithubResubscribable', 'subscription.isStripeResubscribable')
});
