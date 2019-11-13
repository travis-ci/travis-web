import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';

export default Component.extend({
  account: null,
  trial: reads('account.trial'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  hasGithubTrialEnded: and('subscription.isGithub', 'trial.isEnded'),
});
