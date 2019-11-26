import { isEmpty } from '@ember/utils';
import { schedule } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  tabStates: service(),
  jobState: service(),
  updateTimesService: service('updateTimes'),
  repositories: service(),
  features: service(),
  store: service(),
  auth: service(),
  router: service(),
  classNames: ['repository-sidebar'],

  didInsertElement(...args) {
    this._super(args);
    // this starts the fetch after the sidebar is rendered, which is not ideal.
    // But I'm otherwise unable to reference that state within two separate
    // templates...
    schedule('afterRender', () => {
      this.fetchRepositoryData.perform();
      if (this.get('features.showRunningJobsInSidebar')) {
        this.get('jobState.fetchRunningJobs').perform();
        this.get('jobState.fetchQueuedJobs').perform();
      }
    });
  },

  fetchRepositoryData: task(function* () {
    if (this.get('repositories.searchQuery')) {
      yield this.get('repositories.performSearchRequest').perform();
      this.set('_data', this.get('repositories.searchResults'));
    } else {
      yield this.viewOwned.perform();
      this.set('_data', this.get('repositories.accessible'));
    }

    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, () => {
        const callback = (record) => record.get('currentBuild');
        const withCurrentBuild = this._data.filter(callback).map(callback);
        this.updateTimesService.push(withCurrentBuild);
      });
    }
  }),

  actions: {
    showRunningJobs: function () {
      this.tabStates.set('sidebarTab', 'running');
    },

    showMyRepositories: function () {
      this.set('tabStates.sidebarTab', 'owned');
      this.router.transitionTo('index');
    },

    onQueryChange(query) {
      if (query === '' || query === this.get('repositories.searchQuery')) { return; }
      this.set('repositories.searchQuery', query);
      this.get('repositories.showSearchResults').perform();
    }
  },

  startedJobsCount: alias('runningJobs.length'),

  allJobsCount: computed('runningJobs.length', 'queuedJobs.length', function () {
    let runningAmount = this.get('runningJobs.length');
    let queuedAmount = this.get('queuedJobs.length');
    return runningAmount + queuedAmount;
  }),

  runningJobs: computed(
    'features.showRunningJobsInSidebar',
    'jobState.runningJobs.@each.state',
    function () {
      let showRunningJobs = this.get('features.showRunningJobsInSidebar');
      let runningJobs = this.get('jobState.runningJobs');
      if (!showRunningJobs) { return []; }
      return runningJobs;
    }
  ),

  queuedJobs: computed(
    'features.showRunningJobsInSidebar',
    'jobState.queuedJobs.@each.state',
    function () {
      let showRunningJobs = this.get('features.showRunningJobsInSidebar');
      let queuedJobs = this.get('jobState.queuedJobs');
      if (!showRunningJobs) { return []; }
      return queuedJobs;
    }
  ),

  viewOwned: task(function* () {
    const ownedRepositories = yield this.get('repositories.requestOwnedRepositories').perform();
    const onIndexPage = this.get('router.currentRouteName') === 'index';

    if (this.get('auth.signedIn') && isEmpty(ownedRepositories) && onIndexPage) {
      this.router.transitionTo('getting_started');
    }
  }),

  tab: alias('tabStates.sidebarTab'),

  repositoryResults: computed('tab', 'repositories.{searchResults.[],accessible.[]}', function () {
    let tab = this.tab;
    let searchResults = this.get('repositories.searchResults.[]');
    let accessible = this.get('repositories.accessible.[]');
    let results = accessible;

    if (tab === 'search') {
      results =  searchResults;
    }

    return results.filter(repo => repo.get('active'));
  }),

  showRunningJobs: computed('tab', 'features.showRunningJobsInSidebar', function () {
    let tab = this.tab;
    let featureEnabled = this.get('features.showRunningJobsInSidebar');
    return featureEnabled && tab === 'running';
  }),
});
