import Component from '@ember/component';
import { reads, and, empty } from '@ember/object/computed';

export default Component.extend({
  account: null,
  subcription: null,
  trial: reads('account.trial'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  hasGithubTrialEnded: and('subscription.isGithub', 'trial.isEnded'),
  noSubscription: empty('subscription'),
  isDefaultEducationView: and('noSubscription', 'account.education')
});
