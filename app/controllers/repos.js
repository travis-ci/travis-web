import Ember from 'ember';
import Repo from 'travis/models/repo';
import { task, timeout } from 'ember-concurrency';
import Visibility from 'npm:visibilityjs';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

var sortCallback = function (repo1, repo2) {
  // this function could be made simpler, but I think it's clearer this way
  // what're we really trying to achieve

  var buildId1 = repo1.get('currentBuild.id');
  var buildId2 = repo2.get('currentBuild.id');
  var finishedAt1 = repo1.get('currentBuild.finishedAt');
  var finishedAt2 = repo2.get('currentBuild.finishedAt');

  if (!buildId1 && !buildId2) {
    // if both repos lack builds, put newer repo first
    return repo1.get('id') > repo2.get('id') ? -1 : 1;
  } else if (buildId1 && !buildId2) {
    // if only repo1 has a build, it goes first
    return -1;
  } else if (buildId2 && !buildId1) {
    // if only repo2 has a build, it goes first
    return 1;
  }

  if (finishedAt1) {
    finishedAt1 = new Date(finishedAt1);
  }
  if (finishedAt2) {
    finishedAt2 = new Date(finishedAt2);
  }

  if (finishedAt1 && finishedAt2) {
    // if both builds finished, put newer first
    return finishedAt1.getTime() > finishedAt2.getTime() ? -1 : 1;
  } else if (finishedAt1 && !finishedAt2) {
    // if repo1 finished, but repo2 didn't, put repo2 first
    return 1;
  } else if (finishedAt2 && !finishedAt1) {
    // if repo2 finisher, but repo1 didn't, put repo1 first
    return -1;
  } else {
    // none of the builds finished, put newer build first
    return buildId1 > buildId2 ? -1 : 1;
  }
};

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
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

  showSearchResults: task(function * () {
    let query = this.get('search');

    if (query === '') { return; }

    yield timeout(500);

    this.transitionToRoute('main.search', query.replace(/\//g, '%2F'));
    this.get('tabStates').set('sidebarTab', 'search');
  }).restartable(),

  performSearchRequest: task(function * (query) {
    if (!query) { return; }
    this.set('search', query);
    this.set('isLoaded', false);
    yield(Repo.search(this.store, this.get('ajax'), query).then((reposRecordArray) => {
      this.set('isLoaded', true);
      this.set('_repos', reposRecordArray);
    }));
  }),

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

  reset() {
    this.set('_repos', null);
    this.set('ownedRepos', null);
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
    this.get('performSearchRequest').perform(query);
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

  repos: Ember.computed(
    '_repos.[]',
    '_repos.@each.currentBuildFinishedAt',
    '_repos.@each.currentBuildId',
    function () {
      var repos = this.get('_repos');

      if (repos && repos.toArray) {
        repos = repos.toArray();
      }

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
