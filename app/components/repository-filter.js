import Component from '@ember/component';
import { isBlank, isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import fuzzyMatch from 'travis/utils/fuzzy-match';

export default Component.extend({
  tagName: '',
  store: service(),

  repositoriesResult: computed('repositories', 'filteredRepositories', function () {
    let repositories = this.get('repositories');
    let filteredRepositories = this.get('filteredRepositories');
    return filteredRepositories || repositories;
  }),

  isFiltering: computed('search.isRunning', 'lastQuery', function () {
    let isRunning = this.get('search.isRunning');
    let lastQuery = this.get('lastQuery');
    return isRunning || !isEmpty(lastQuery);
  }),

  actions: {
    onSearch(query) {
      this.get('search').perform(query);
    }
  },

  search: task(function* (query) {
    if (this.get('lastQuery') === query) {
      return;
    }

    this.set('lastQuery', query);

    if (isBlank(query)) {
      this.set('filteredRepositories', null);
      return;
    }

    yield timeout(config.intervals.repositoryFilteringDebounceRate);

    let repositories = yield this.get('queryFunction')(query);

    this.set('filteredRepositories', repositories);
  }).restartable(),

  computeName(name, isFiltering, query) {
    if (isFiltering) {
      return htmlSafe(fuzzyMatch(name, query));
    } else {
      return name;
    }
  },
});
