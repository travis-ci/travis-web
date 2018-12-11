import Component from '@ember/component';
import { and, equal, reads } from '@ember/object/computed';

export default Component.extend({
  account: null,

  subscription: reads('account.subscription'),
  trial: reads('account.trial'),

  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),

  isFreePlan: equal('account.subscription.plan.id', 'free-plan')
});
