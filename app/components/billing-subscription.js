import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';

export default Component.extend({
  account: null,

  subscription: reads('account.subscription'),
  trial: reads('account.trial'),

  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial')
});
