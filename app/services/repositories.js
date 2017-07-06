import Ember from 'ember';
import config from 'travis/config/environment';
import Repo from 'travis/models/repo';
import { task, timeout } from 'ember-concurrency';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

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

  @computed('requestOwnedRepositories', 'performSearchRequest', 'showSearchResults')
  tasks(accessible, performSearch, showSearch) {
    return [
      accessible,
      performSearch,
      showSearch,
    ];
  },

  @computed('tasks.@each.isRunning')
  loadingData(tasks) {
    return tasks.any(task => task.get('isRunning'));
  },

  performSearchRequest: task(function* () {
    const store = this.get('store');
    const ajax = this.get('ajax');
    const query = this.get('searchQuery');

    const searchResults = yield Repo.search(store, ajax, query);
    this.set('_searchResults', searchResults);
  }).drop(),

  showSearchResults: task(function* () {
    let query = this.get('searchQuery');

    yield timeout(config.repositorySearchDebounceRate);

    yield this.get('performSearchRequest').perform(query);

    query = query.replace(/\//g, '%2F');
    this.get('router').transitionTo('search', query);
  }).restartable(),

  requestOwnedRepositories: task(function* () {
    if (!Ember.isEmpty(this.get('ownedRepos'))) {
      return this.set('_repos', this.get('ownedRepos'));
    } else {
      let user = this.get('auth.currentUser');
      if (user) {
        const permissions = yield user.get('_rawPermissions');
        const repositories = yield Repo.accessibleBy(this.get('store'), permissions.pull);
        this.set('_repos', repositories);
        this.set('ownedRepos', repositories);
      }
    }
  }).drop(),

  @computed('_repos.[]', '_repos.@each.{currentBuildFinishedAt,currentBuildId}')
  accessible(repos) {
    if (repos && repos.toArray) {
      repos = repos.toArray();
    }

    if (repos && repos.sort) {
      return repos.sort(sortCallback);
    } else {
      if (Ember.isArray(repos)) {
        return repos;
      } else {
        return [];
      }
    }
  },

  @computed('_searchResults.[]', '_searchResults.@each.{currentBuildFinishedAt,currentBuildId}')
  searchResults(repos) {
    if (repos && repos.toArray) {
      repos = repos.toArray();
    }

    if (repos && repos.sort) {
      return repos.sort(sortCallback);
    } else {
      if (Ember.isArray(repos)) {
        return repos;
      } else {
        return [];
      }
    }
  },

  reset() {
    this.set('_repos', null);
    this.set('ownedRepos', null);
  },
});
