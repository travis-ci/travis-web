import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, and, empty } from '@ember/object/computed';

export default Component.extend({
  account: null,
  subcription: null,
  trial: reads('account.trial'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  hasGithubTrialEnded: and('subscription.isGithub', 'trial.isEnded'),
  noSubscription: empty('subscription'),
  isDefaultEducationView: computed('subscription', 'account.education', 'subscription.plan_name', function () {
    return this.get('subscription') && this.get('account.education') && this.get('subscription.plan_name') ===
      'Github Student developer pack 1 concurrent plan' && this.get('subscription').isNotEmpty;
  })
});
