import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, and, not } from '@ember/object/computed';

export default Component.extend({
  plan: service(),

  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  plans: reads('plan.plans'),
  trial: reads('account.trial'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  authenticationNotRequired: not('subscription.clientSecret'),
  isPending: and('subscription.isPending', 'authenticationNotRequired'),
});
