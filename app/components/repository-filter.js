import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';

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

  @action
  onSearch(query) {
    this.get('search').perform(query);
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

    const repositories = yield this.get('queryFunction')(query);

    this.set('filteredRepositories', repositories);
  }).restartable(),
});
