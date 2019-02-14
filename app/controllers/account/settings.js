import Controller from '@ember/controller';
import { reads, equal, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import fetchAll from 'travis/utils/fetch-all';

export const SECTION = {
  NONE: '',
  EMAIL: 'email'
};

export default Controller.extend({
  features: service(),
  preferences: service(),
  flashes: service(),

  queryParams: ['section'],
  section: SECTION.NONE,

  featureFlags: reads('model.featureFlags'),
  account: reads('model.account'),

  scrollToEmail: equal('section', SECTION.EMAIL),
  repositories: reads('fetchRepositories.lastSuccessful.value'),
  buildEmails: reads('preferences.buildEmails'),
  showResubscribeList: and('buildEmails', 'unsubscribedRepos.length'),

  privateInsightsVisibility: reads('preferences.privateInsightsVisibility'),
  insightsVisibilityOptions: [{
    value: 'private',
    displayValue: 'you',
    description: 'Do not allow everyone to see insights from your private builds',
    modalText: 'Do not allow everyone to see my private insights',
  }, {
    value: 'public',
    displayValue: 'everyone',
    description: 'Allow everyone to see insights from your private builds',
    modalText: 'Allow everyone to see my private build insights',
  }],

  unsubscribedRepos: computed('repositories.@each.emailSubscribed', function () {
    let repositories = this.get('repositories') || [];
    return repositories.filter(repo => !repo.emailSubscribed);
  }),

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
  }).restartable(),

  setPrivateInsights: task(function* (val) {
    try {
      yield this.preferences.set('private_insights_visibility', val);
      this.flashes.clear();
      this.flashes.success(`Your private build insights are now ${val}.`);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
  }).restartable(),

  actions: {
    setInsightsVis(val) {
      this.setPrivateInsights.perform(val);
    }
  },
});
