import Component from '@ember/component';
import { reads, not, lt, equal, and } from '@ember/object/computed';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  account: null,
  accounts: service(),
  flashes: service(),
  raven: service(),
  store: service(),

  subscription: reads('account.subscription'),
  accountTrial: reads('account.trial'),

  isGithubTrial: and('subscription.isGithub', 'accountTrial.hasActiveTrial'),
  newTrial: null,
  trial: computed('accountTrial', 'newTrial', function () {
    return !this.newTrial ? this.accountTrial : this.newTrial;
  }),
  isBuildLessThanEleven: lt('trial.buildsRemaining', 11),
  isBuildFinished: equal('trial.buildsRemaining', 0),
  isBuildRemaining: not('isBuildFinished'),
  showBuildRunningOutBanner: and('isBuildRemaining', 'isBuildLessThanEleven'),
  hasNoSubscriptionPermissions: not('account.hasSubscriptionPermissions'),
  hasNoActiveTrial: not('trial.hasActiveTrial'),

  activateTrial: task(function* () {
    const trial = this.store.createRecord('trial', {
      owner: this.account,
      type: this.account.isOrganization === true ? 'organization' : 'user'
    });

    try {
      const saved = yield trial.save();
      saved.set('status', 'new');
      saved.set('buildsRemaining', 100);
      this.set('newTrial', saved);
      yield this.accounts.fetchTrials.perform();
    } catch (e) {
      this.flashes.error('There was an error activating trial.');
      this.raven.logException(e);
    }
  }).drop(),
});

