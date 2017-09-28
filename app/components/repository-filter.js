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

  @computed('search.isRunning', 'lastQuery')
  isFiltering(isRunning, lastQuery) {
    return isRunning || !Ember.isEmpty(lastQuery);
  },

  @action
  onSearch(query) {
    this.get('search').perform(query);
  },

  search: task(function* (query) {
    if (this.get('lastQuery') === query) {
      return;
    }

    this.set('lastQuery', query);

    if (Ember.isBlank(query)) {
      this.set('filteredRepositories', null);
      return;
    }

    yield timeout(config.intervals.repositoryFilteringDebounceRate);

    let repositories = yield this.get('queryFunction')(query);

    this.set('filteredRepositories', repositories);
  }).restartable(),
});
