import Component from '@ember/component';
import { reads, not, lt, equal, and } from '@ember/object/computed';

export default Component.extend({
  account: null,

  subscription: reads('account.subscription'),
  trial: reads('account.trial'),
  isBuildLessThanEleven: lt('trial.buildsRemaining', 11),
  isBuildFinished: equal('trial.buildsRemaining', 0),
  isBuildRemaining: not('isBuildFinished'),
  showBuildRunningOutBanner: and('isBuildRemaining', 'isBuildLessThanEleven'),
  hasNoSubscriptionPermissions: not('account.hasSubscriptionPermissions'),
  hasNoActiveTrial: not('trial.hasActiveTrial'),
});
