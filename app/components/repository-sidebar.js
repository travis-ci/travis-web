import { isEmpty } from '@ember/utils';
import { schedule } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { and, filterBy, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import fetchAll from 'travis/utils/fetch-all';
import fetchSome from 'travis/utils/fetch-some';


export default Component.extend({
  tabStates: service(),
  jobState: service(),
  updateTimesService: service('updateTimes'),
  permissionsService: service('permissions'),
  repositories: service(),
  features: service(),
  auth: service(),
  router: service(),
  store: service(),

  classNames: ['repository-sidebar'],

  didInsertElement(...args) {
    this._super(args);
    // this starts the fetch after the sidebar is rendered, which is not ideal.
    // But I'm otherwise unable to reference that state within two separate
    // templates...
    schedule('afterRender', () => {
      this.fetchRepositoryData.perform();
      if (this.get('features.showRunningJobsInSidebar')) {
        this.get('jobState.fetchUnfinishedJobs').perform();
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

  showRunningJobs: function () {
    this.tabStates.switchSidebarToRunning();
  },

  showMyRepositories: function () {
    this.tabStates.switchSidebarToOwned();
    this.router.transitionTo('index');
  },

  onQueryChange(query) {
    if (query.target) {
      query = query.target.value;
    }

    if (query === '' || query === this.get('repositories.searchQuery')) { return; }
    this.set('repositories.searchQuery', query);
    this.get('repositories.showSearchResults').perform();
  },

  startedJobsCount: reads('runningJobs.length'),
  allJobsCount: reads('jobState.unfinishedJobs.length'),
  runningJobs: reads('jobState.runningJobs'),
  queuedJobs: reads('jobState.queuedJobs'),
  jobsLoaded: reads('jobState.jobsLoaded'),

  viewOwned: task(function* () {
    this.permissionsService.fetchPermissions.perform();
    let repos = [];
    repos = yield this.get('getAllRepos').perform();
    let ownedRepositories =  yield this.get('repositories.requestOwnedRepositories').perform();

    const onIndexPage = this.get('router.currentRouteName') === 'index';

    if (this.get('auth.signedIn') && isEmpty(ownedRepositories) && onIndexPage && isEmpty(repos)) {
      this.router.transitionTo('getting_started');
    }
  }),

  isTabRunning: reads('tabStates.isSidebarRunning'),
  isTabSearch: reads('tabStates.isSidebarSearch'),

  getAllRepos: task(function* () {
    yield fetchSome(this.store, 'repo', {limit: 1, offset: 0, noInclude: true, representation: 'list'});

    return this.store.peekAll('repo');
  }).drop(),

  fetchRepositories: task(function* () {
    yield fetchAll(this.store, 'repo', { noInclude: true, representation: 'list'});
    return this.store.peekAll('repo');
  }).drop(),


  repositoryResults: computed('isTabSearch', 'repositories.searchResults.[]', 'repositories.accessible.[]', function () {
    const { isTabSearch, repositories } = this;

    if (isTabSearch) {
      return repositories.searchResults;
    }
    return repositories.accessible;
  }),
  activeRepositoryResults: filterBy('repositoryResults', 'active', true),

  isShowingRunningJobs: and('isTabRunning', 'features.showRunningJobsInSidebar'),
});
