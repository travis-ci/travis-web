import Ember from 'ember';
import Visibility from 'npm:visibilityjs';
import { task } from 'ember-concurrency';
import computed, { alias } from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tabStates: service(),
  ajax: service(),
  updateTimesService: service('updateTimes'),
  repositories: service(),
  store: service(),
  auth: service(),
  router: service(),

  didReceiveAttrs() {
    if (this.get('repositories.searchQuery')) {
      this.get('repositories.performSearchRequest').perform();
    } else {
      this.get('viewOwned').perform();
    }
  },

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

  @computed('runningJobs.length', 'queuedJobs.length')
  allJobsCount(runningAmount, queuedAmount) {
    return runningAmount + queuedAmount;
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(this.config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  @computed('features.proVersion')
  runningJobs(proVersion) {
    if (!proVersion) { return []; }
    const runningStates = ['queued', 'started', 'received'];
    const result = this.get('store').filter(
      'job',
      {},
      job => runningStates.includes(job.get('state'))
    );

    result.then(() => result.set('isLoaded', true));

    return result;
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

  updateTimes() {
    let records = this.get('repos');

    let callback = (record) => record.get('currentBuild');
    records = records.filter(callback).map(callback);

    this.get('updateTimesService').push(records);
  },

  viewOwned: task(function* () {
    const ownedRepositories = yield this.get('repositories.requestOwnedRepositories').perform();

    if (this.get('auth.signedIn') && Ember.isEmpty(ownedRepositories)) {
      this.get('router').transitionTo('getting_started');
    }
  }),

  @alias('tabStates.sidebarTab') tab: null,

  @computed('tab')
  noReposMessage(tab) {
    if (tab === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else {
      return 'Could not find any repos';
    }
  },

  @computed('tab')
  repositoryResults(tab) {
    if (tab === 'search') {
      return this.get('repositories.searchResults');
    }
    return this.get('repositories.accessible');
  },

  @computed('tab')
  showRunningJobs(tab) {
    return tab === 'running';
  },
});
