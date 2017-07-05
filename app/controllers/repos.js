import Ember from 'ember';
import Repo from 'travis/models/repo';
import Visibility from 'npm:visibilityjs';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  ajax: service(),
  repositories: service(),
  updateTimesService: service('updateTimes'),

  actions: {
    activate: function (name) {
      return this.activate(name);
    },
  },

  tabOrIsLoadedDidChange: Ember.observer('isLoaded', 'tab', 'repos.length', function () {
    return this.possiblyRedirectToGettingStartedPage();
  }),

  possiblyRedirectToGettingStartedPage() {
    return Ember.run.scheduleOnce('routerTransitions', this, function () {
      if (this.get('tab') === 'owned' && this.get('isLoaded') && this.get('repos.length') === 0) {
        this.send('redirectToGettingStarted');
      }
    });
  },

  isLoaded: false,
  repoController: controller('repo'),
  currentUser: alias('auth.currentUser'),

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
    var result;

    result = this.store.filter('job', {}, function (job) {
      return ['queued', 'started', 'received'].includes(job.get('state'));
    });

    result.set('isLoaded', false);

    result.then(function () {
      return result.set('isLoaded', true);
    });

    return result;
  }),

  queuedJobs: Ember.computed('features.proVersion', function () {
    if (!this.get('features.proVersion')) { return []; }

    var result;
    result = this.get('store').filter('job', function (job) {
      return ['created'].indexOf(job.get('state')) !== -1;
    });
    result.set('isLoaded', false);
    result.then(function () {
      result.set('isLoaded', true);
    });

    return result;
  }),

  recentRepos: Ember.computed(function () {
    return [];
  }),

  updateTimes() {
    let records = this.get('repositories.accessible');

    let callback = (record) => { return record.get('currentBuild'); };
    records = records.filter(callback).map(callback);

    this.get('updateTimesService').push(records);
  },

  activate(tab, params) {
    this.set('sortProperties', ['sortOrder']);
    let tabState = this.get('tabStates.sidebarTab');
    this.set('tab', tabState);
    // find the data based on tab
    // tab == 'owned' => viewOwned invoked
    return this[('view_' + tabState).camelize()](params);
  },

  viewOwned() {
    if (!Ember.isEmpty(this.get('ownedRepos'))) {
      return this.set('_repos', this.get('ownedRepos'));
    } else if (!this.get('fetchingOwnedRepos')) {
      this.set('isLoaded', false);

      let user = this.get('currentUser');
      if (user) {
        this.set('fetchingOwnedRepos', true);

        let callback = (reposRecordArray) => {
          this.set('isLoaded', true);
          this.set('_repos', reposRecordArray);
          this.set('ownedRepos', reposRecordArray);
          this.set('fetchingOwnedRepos', false);
          return reposRecordArray;
        };

        let onError = () => this.set('fetchingOwnedRepos', false);

        user.get('_rawPermissions').then((data) => {
          Repo.accessibleBy(this.store, data.pull).then(callback, onError);
        }, onError);
      }
    }
  },

  viewRunning() {},

  viewSearch(query) {
    this.get('repositories.performSearchRequest').perform(query);
  },

  noReposMessage: Ember.computed('tab', function () {
    var tab;
    tab = this.get('tab');
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
});
