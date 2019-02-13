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
  isShowingInsightsVisibilityModal: false,

  // This is for detecting whether visibility is being increased or restricted.
  visibilityChange: computed(
    'preferences.privateInsightsVisibility',
    'privateInsightsVisibility',
    function () {
      const oldVis = this.preferences.privateInsightsVisibility;
      const newVis = this.privateInsightsVisibility;

      if (oldVis === newVis) {
        return 0;
      }

      if (newVis === 'private' || oldVis === 'public') {
        return -1;
      }

      return 1;
    }
  ),

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

  setPrivateInsights: task(function* () {
    let val = this.get('privateInsightsVisibility');
    try {
      yield this.preferences.set('private_insights_visibility', val);
      this.flashes.clear();
      this.flashes.success(`Your private build insights are now ${val}.`);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
    this.set('isShowingInsightsVisibilityModal', false);
  }).restartable(),

  actions: {
    toggleInsightsVisibilityModal() {
      this.toggleProperty('isShowingInsightsVisibilityModal');
    },
  }
});
