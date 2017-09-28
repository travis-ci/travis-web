import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: '',
  @service store: null,

  @computed('repositories', 'filteredRepositories')
  repositoriesResult(repositories, filteredRepositories) {
    return filteredRepositories || repositories;
  },

  @computed('search.isRunning', 'filteredRepositories')
  isFiltering(isRunning, filteredRepositories) {
    return isRunning || filteredRepositories;
  },

  search: task(function* (query) {
    if (Ember.isBlank(query)) {
      this.set('filteredRepositories', null);
      return;
    }

    if (this.get('lastQuery') === query) {
      return;
    }

    this.set('lastQuery', query);

    yield timeout(config.intervals.repositoryFilteringDebounceRate);

    const repositories = yield this.get('store')
      .query('repo', {
        slug_matches: query,
        sort_by: 'slug_match:desc',
        limit: 10,
        custom: {
          owner: this.get('login'),
          type: 'byOwner',
        },
      });

    this.set('filteredRepositories', repositories);
  }).restartable(),
});
