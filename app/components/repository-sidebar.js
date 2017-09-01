import Ember from 'ember';
import Visibility from 'npm:visibilityjs';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service tabStates: null,
  @service jobState: null,
  @service ajax: null,
  @service('updateTimes') updateTimesService: null,
  @service repositories: null,
  @service store: null,
  @service auth: null,
  @service router: null,

  init(...args) {
    this._super(args);
    // this starts the fetch after the sidebar is rendered, which is not ideal.
    // But I'm otherwise unable to reference that state within two separate
    // templates...
    Ember.run.schedule('afterRender', () => {
      this.get('fetchRepositoryData').perform();
      this.get('jobState.fetchRunningJobs').perform();
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
      Visibility.every(this.config.intervals.updateTimes, () => {
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

  @computed('features.proVersion', 'jobState.runningJobs.[]')
  runningJobs(proVersion, runningJobs) {
    if (!proVersion) { return []; }
    return runningJobs;
  },

  @computed('features.proVersion')
  queuedJobs(proVersion) {
    if (!proVersion) { return []; }

    const queuedStates = ['created'];
    const result = this.get('store').filter(
      'job',
      job => queuedStates.includes(job.get('state'))
    );
    result.set('isLoaded', false);
    result.then(() => result.set('isLoaded', true));

    return result;
  },

  viewOwned: task(function* () {
    const ownedRepositories = yield this.get('repositories.requestOwnedRepositories').perform();
    const onIndexPage = this.get('router.currentRouteName') === 'index';

    if (this.get('auth.signedIn') && Ember.isEmpty(ownedRepositories) && onIndexPage) {
      this.get('router').transitionTo('getting_started');
    }
  }),

  @alias('tabStates.sidebarTab') tab: null,

  @computed('tab', 'repositories.{searchResults.[],accessible.[]}')
  repositoryResults(tab, searchResults, accessible) {
    if (tab === 'search') {
      return searchResults;
    }
    return accessible;
  },

  @computed('tab')
  showRunningJobs(tab) {
    return tab === 'running';
  },
});
