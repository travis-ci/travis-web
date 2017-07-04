import Ember from 'ember';
import config from 'travis/config/environment';
import Repo from 'travis/models/repo';
import { task, timeout } from 'ember-concurrency';

const { service } = Ember.inject;
const { alias } = Ember.computed;

const sortCallback = function (repo1, repo2) {
  // this function could be made simpler, but I think it's clearer this way
  // what're we really trying to achieve

  let buildId1 = repo1.get('currentBuild.id');
  let buildId2 = repo2.get('currentBuild.id');
  let finishedAt1 = repo1.get('currentBuild.finishedAt');
  let finishedAt2 = repo2.get('currentBuild.finishedAt');

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

export default Ember.Service.extend({
  auth: service(),
  store: service(),
  tabStates: service(),
  ajax: service(),
  router: service(),

  currentUser: alias('auth.currentUser'),

  tasks: Ember.computed(function () {
    return [
      this.get('requestOwnedRepositories'),
      this.get('performSearchRequest'),
      this.get('showSearchResults'),
    ];
  }),

  loadingData: Ember.computed('tasks.@each.isRunning', function () {
    let tasks = this.get('tasks');
    return tasks.any(task => task.get('isRunning'));
  }),

  performSearchRequest: task(function* () {
    console.log('performSearchRequest in repositories service');
    const searchRequest = Repo.search(this.get('store'), this.get('ajax'), this.get('searchQuery'));
    yield searchRequest.then((reposRecordArray) => {
      this.set('_repos', reposRecordArray);
    });
  }).drop(),

  showSearchResults: task(function* () {
    console.log('showSearchResults called');
    let query = this.get('searchQuery');

    yield timeout(config.repositorySearchDebounceRate);

    yield this.get('performSearchRequest').perform(query);

    this.get('tabStates').set('sidebarTab', 'search');

    query = query.replace(/\//g, '%2F');
    console.log('about to transition');
    this.get('router').transitionTo('search', query);
  }).restartable(),

  requestOwnedRepositories: task(function* () {
    if (!Ember.isEmpty(this.get('ownedRepos'))) {
      return this.set('_repos', this.get('ownedRepos'));
    } else {
      let user = this.get('currentUser');
      if (user) {
        const permissions = yield user.get('_rawPermissions');
        const repositories = yield Repo.accessibleBy(this.get('store'), permissions.pull);
        this.set('_repos', repositories);
        this.set('ownedRepos', repositories);
      }
    }
  }).drop(),

  noResults: Ember.computed('loadingData', 'repos', function () {
    return !this.get('loadingData') && Ember.isEmpty(this.get('repos'));
  }),

  repos: Ember.computed(
    '_repos.[]',
    '_repos.@each.currentBuildFinishedAt',
    '_repos.@each.currentBuildId',
    function () {
      let repos = this.get('_repos');

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
  ),

  reset() {
    this.set('_repos', null);
    this.set('ownedRepos', null);
  },
});
