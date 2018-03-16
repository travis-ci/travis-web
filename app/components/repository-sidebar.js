import { isEmpty } from '@ember/utils';
import { schedule } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import Visibility from 'npm:visibilityjs';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default Component.extend({
  @service tabStates: null,
  @service jobState: null,
  @service('updateTimes') updateTimesService: null,
  @service repositories: null,
  @service features: null,
  @service store: null,
  @service auth: null,
  @service router: null,
  classNames: ['dupa'],

  didInsertElement(...args) {
    this._super(args);
    // this starts the fetch after the sidebar is rendered, which is not ideal.
    // But I'm otherwise unable to reference that state within two separate
    // templates...
    schedule('afterRender', () => {
      this.get('fetchRepositoryData').perform();
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
      yield this.get('viewOwned').perform();
      this.set('_data', this.get('repositories.accessible'));
    }

    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, () => {
        const callback = (record) => record.get('currentBuild');
        const withCurrentBuild = this.get('_data').filter(callback).map(callback);
        this.get('updateTimesService').push(withCurrentBuild);
      });
    }
  }),

  actions: {
    showRunningJobs: function () {
      this.get('tabStates').set('sidebarTab', 'running');
    },

    showMyRepositories: function () {
      this.set('tabStates.sidebarTab', 'owned');
      this.attrs.showRepositories();
    },

    onQueryChange(query) {
      if (query === '' || query === this.get('repositories.searchQuery')) { return; }
      this.set('repositories.searchQuery', query);
      this.get('repositories.showSearchResults').perform();
    }
  },

  @alias('runningJobs.length') startedJobsCount: null,

  @computed('runningJobs.length', 'queuedJobs.length')
  allJobsCount(runningAmount, queuedAmount) {
    return runningAmount + queuedAmount;
  },

  @computed('features.showRunningJobsInSidebar', 'jobState.runningJobs.[]')
  runningJobs(showRunningJobs, runningJobs) {
    if (!showRunningJobs) { return []; }
    return runningJobs;
  },

  @computed('features.showRunningJobsInSidebar', 'jobState.queuedJobs.[]')
  queuedJobs(showRunningJobs, queuedJobs) {
    if (!showRunningJobs) { return []; }
    return queuedJobs;
  },

  viewOwned: task(function* () {
    const ownedRepositories = yield this.get('repositories.requestOwnedRepositories').perform();
    const onIndexPage = this.get('router.currentRouteName') === 'index';

    if (this.get('auth.signedIn') && isEmpty(ownedRepositories) && onIndexPage) {
      this.get('router').transitionTo('getting_started');
    }
  }),

  @alias('tabStates.sidebarTab') tab: null,

  @computed('tab', 'repositories.{searchResults.[],accessible.[]}')
  repositoryResults(tab, searchResults, accessible) {
    let results = accessible;

    if (tab === 'search') {
      results =  searchResults;
    }

    return results.filter(repo => repo.get('active'));
  },

  @computed('tab', 'features.showRunningJobsInSidebar')
  showRunningJobs(tab, featureEnabled) {
    return featureEnabled && tab === 'running';
  },
});
