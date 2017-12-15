import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import Service from '@ember/service';
import config from 'travis/config/environment';
import Repo from 'travis/models/repo';
import { task, timeout } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service auth: null,
  @service store: null,
  @service tabStates: null,
  @service api: null,
  @service router: null,

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
    const query = this.get('searchQuery');

    const urlQuery = this.get('router._router.currentURL').split('/')[2];

    if (!this.get('_searchResults.length') || urlQuery !== query) {
      const searchResults = yield Repo.search(store, query);
      this.set('_searchResults', searchResults);
    }
  }).drop(),

  showSearchResults: task(function* () {
    let query = this.get('searchQuery');

    yield timeout(config.intervals.repositorySearchDebounceRate);

    yield this.get('performSearchRequest').perform(query);

    query = query.replace(/\//g, '%2F');
    this.get('router').transitionTo('search', query);
  }).restartable(),

  requestOwnedRepositories: task(function* () {
    if (!isEmpty(this.get('ownedRepos'))) {
      return this.set('_repos', this.get('ownedRepos'));
    } else {
      let user = this.get('auth.currentUser');
      if (user) {
        const permissions = yield user.get('_rawPermissions');
        const repositories = yield Repo.accessibleBy(this.get('store'), permissions.pull);
        this.set('_repos', repositories);
        this.set('ownedRepos', repositories);
        return repositories;
      }
    }
  }).drop(),

  @computed('_repos.[]', '_repos.@each.{currentBuildFinishedAt,currentBuildId}')
  accessible(repos) {
    return this.sortData(repos);
  },

  @computed('_searchResults.[]', '_searchResults.@each.{currentBuildFinishedAt,currentBuildId}')
  searchResults(repos) {
    return this.sortData(repos);
  },

  sortData(repos) {
    if (repos && repos.toArray) {
      repos = repos.toArray();
    }

    if (repos && repos.sort) {
      return repos.sort((repo1, repo2) => {
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
      });
    } else {
      if (isArray(repos)) {
        return repos;
      } else {
        return [];
      }
    }
  },
});
