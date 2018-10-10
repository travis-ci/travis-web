import Controller from '@ember/controller';
import { reads, equal, and } from '@ember/object/computed';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import fetchAll from 'travis/utils/fetch-all';

export const SECTION = {
  NONE: '',
  EMAIL: 'email'
};

export default Controller.extend({
  @service features: null,
  @service preferences: null,
  @service flashes: null,

  queryParams: ['section'],
  section: SECTION.NONE,

  featureFlags: reads('model.featureFlags'),
  account: reads('model.account'),

  scrollToEmail: equal('section', SECTION.EMAIL),
  repositories: reads('fetchRepositories.lastSuccessful.value'),
  buildEmails: reads('preferences.buildEmails'),
  showResubscribeList: and('buildEmails', 'unsubscribedRepos.length'),

  @computed('repositories.@each.emailSubscribed')
  unsubscribedRepos(repositories = []) {
    return repositories.filter(repo => !repo.emailSubscribed);
  },

  fetchRepositories: task(function* () {
    yield fetchAll(this.store, 'repo', {});
    return this.store.peekAll('repo');
  }).drop(),

  toggleBuildEmails: task(function* (value) {
    try {
      yield this.preferences.set('build_emails', value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your email settings were not saved.');
    }
  }).restartable()
});
