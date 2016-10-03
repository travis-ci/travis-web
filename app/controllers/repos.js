/* global Visibility */
import Ember from 'ember';
import Repo from 'travis/models/repo';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  repositories: service(),
  ajax: service(),
  updateTimesService: service('updateTimes'),

  actions: {
    activate: function (name) {
      return this.activate(name);
    },

    showRunningJobs: function () {
      this.get('tabStates').set('sidebarTab', 'running');
      return this.activate('running');
    },

    showMyRepositories: function () {
      this.get('tabStates').set('sidebarTab', 'owned');
      if (this.get('tab') === 'running') {
        return this.activate('owned');
      } else {
        return this.transitionToRoute('main.repositories');
      }
    }
  },

  tabOrIsLoadedDidChange: Ember.observer('isLoaded', 'tab', 'repos.length', function () {
    return this.possiblyRedirectToGettingStartedPage();
  }),

  possiblyRedirectToGettingStartedPage() {
    return Ember.run.scheduleOnce('routerTransitions', this, function () {
      if (this.get('tab') === 'owned' && this.get('isLoaded') && this.get('repos.length') === 0) {
        return Ember.getOwner(this).lookup('router:main').send('redirectToGettingStarted');
      }
    });
  },

  isLoaded: false,
  repoController: controller('repo'),
  currentUser: alias('auth.currentUser'),

  selectedRepo: Ember.computed('repoController.repo', 'repoController.repo.content', function () {
    return this.get('repoController.repo.content') || this.get('repoController.repo');
  }),

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
      return ['queued', 'started', 'received'].contains(job.get('state'));
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
    let records = this.get('repos');

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

  viewSearch() {
    this.get('repositories.performSearchRequest').perform();
  },

  showRunningJobs: Ember.computed('tab', function () {
    return this.get('tab') === 'running';
  }),

  repos: Ember.computed(
    '_repos.[]',
    '_repos.@each.currentBuildFinishedAt',
    '_repos.@each.currentBuildId',
    function () {
      var repos = this.get('_repos');

      if (repos && repos.toArray) {
        repos = repos.toArray();
      }

      let sortCallback = () => {};

      if (repos && repos.sort) {
        let sorted = repos.sort(sortCallback);
        return sorted;
      } else {
        if (Ember.isArray(repos)) {
          return repos;
        } else {
          return [];
        }
      }
    }
  )
});
