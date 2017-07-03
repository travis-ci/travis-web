import Ember from 'ember';
import Visibility from 'npm:visibilityjs';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  tabStates: service(),
  ajax: service(),
  updateTimesService: service('updateTimes'),
  repositories: service(),
  store: service(),

  didReceiveAttrs() {
    if (this.get('repositories.searchQuery')) {
      this.viewSearch();
    } else {
      this.viewOwned();
    }
  },

  actions: {
    activate: function (name) {
      return this.activate(name);
    },

    showRunningJobs: function () {
      this.get('tabStates').set('sidebarTab', 'running');
      return this.activate('running');
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

  // repoController: controller('repo'),

  // selectedRepo:
  // Ember.computed('repoController.repo',
  // 'repoController.repo.content', function () {
  //   return this.get('repoController.repo.content') || this.get('repoController.repo');
  // }),

  startedJobsCount: Ember.computed.alias('runningJobs.length'),

  allJobsCount: Ember.computed('startedJobsCount', 'queuedJobs.length', function () {
    return this.get('startedJobsCount') + this.get('queuedJobs.length');
  }),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(this.config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  runningJobs: Ember.computed('features.proVersion', function () {
    if (!this.get('features.proVersion')) { return []; }
    let result;

    let runningStates = ['queued', 'started', 'received'];
    result = this.get('store').filter('job', {}, job => runningStates.includes(job.get('state')));

    result.set('isLoaded', false);

    result.then(() => result.set('isLoaded', true));

    return result;
  }),

  queuedJobs: Ember.computed('features.proVersion', function () {
    if (!this.get('features.proVersion')) { return []; }

    const queuedStates = ['created'];
    let result = this.get('store').filter('job', job => queuedStates.includes(job.get('state')));
    result.set('isLoaded', false);
    result.then(() => result.set('isLoaded', true));

    return result;
  }),

  updateTimes() {
    let records = this.get('repos');

    let callback = (record) => record.get('currentBuild');
    records = records.filter(callback).map(callback);

    this.get('updateTimesService').push(records);
  },

  activate(tab, params) {
    this.set('sortProperties', ['sortOrder']);
    let tabState = this.get('tabStates.sidebarTab');
    this.set('tab', tabState);
    // find the data based on tab
    // tab == 'owned' => viewOwned invoked
    return this[(`view_${tabState}`).camelize()](params);
  },

  reset() {
    this.set('_repos', null);
    this.set('ownedRepos', null);
  },

  viewOwned() {
    const taskInstance = this.get('repositories.requestOwnedRepositories').perform();
    this.set('currentTaskInstance', taskInstance);
  },

  viewRunning() {},

  viewSearch() {
    this.get('repositories.performSearchRequest').perform();
  },

  noReposMessage: Ember.computed('tab', function () {
    const tab = this.get('tab');
    if (tab === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else if (tab === 'recent') {
      return 'Repositories could not be loaded';
    } else {
      return 'Could not find any repos';
    }
  }),

  showRunningJobs: Ember.computed('tab', function () {
    return this.get('tab') === 'running';
  }),

  repos: alias('repositories.repos')
});
