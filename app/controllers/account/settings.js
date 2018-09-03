import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import { and, reads } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,
  @service featureFlags: null,
  @service preferences: null,
  @service flashes: null,

  repositories: null,

  @reads('preferences.buildEmails')
  buildEmails: false,

  @computed('repositories.@each.emailSubscribed')
  unsubscribedRepos(repositories = []) {
    return repositories.filter(repo => !repo.emailSubscribed);
  },

  @and('buildEmails', 'unsubscribedRepos.length')
  showResubscribeList: false,

  toggleBuildEmails: task(function* (value) {
    try {
      yield this.preferences.set('build_emails', value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your email settings were not saved.');
    }
  }).restartable()
});
