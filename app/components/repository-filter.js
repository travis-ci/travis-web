import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import fuzzyMatch from 'travis/utils/fuzzy-match';

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

  computeSlug(slug, isFiltering, query) {
    if (isFiltering) {
      return Ember.String.htmlSafe(fuzzyMatch(slug, query));
    } else {
      return slug;
    }
  },

  computeOwnerLogin(slug, isFiltering, query) {
    if (isFiltering) {
      let result = fuzzyMatch(slug, query, '{{', '}}');
      // we need to match the entire slug and then split it into 2, but we also
      // need to take into account that the highlight might include the slash,
      // for example travis-{{ci/foo}} if a user searches for ci/foo
      let [owner, name] = result.split('/');
      let match = owner.match(new RegExp('\{\{|\}\}', 'g'));
      if (match && match.length % 2 === 1) {
        // the number of parens is odd, we need to close
        owner = `${owner}}}`
      }
      owner = owner.replace(new RegExp('{{', 'g'), '<b>').replace(new RegExp('}}', 'g'), '</b>')
      return Ember.String.htmlSafe(owner);
    } else {
      return slug.split('/')[0];
    }
  },

  computeRepoName(slug, isFiltering, query) {
    if (isFiltering) {
      let result = fuzzyMatch(slug, query, '{{', '}}');
      // we need to match the entire slug and then split it into 2, but we also
      // need to take into account that the highlight might include the slash,
      // for example travis-{{ci/foo}} if a user searches for ci/foo
      let [owner, name] = result.split('/');
      let match = name.match(new RegExp('\{\{|\}\}', 'g'));
      if (match && match.length % 2 === 1) {
        // the number of parens is odd, we need to open
        name = `{{${name}`
      }
      name = name.replace(new RegExp('{{', 'g'), '<b>').replace(new RegExp('}}', 'g'), '</b>')
      return Ember.String.htmlSafe(name);
    } else {
      return slug.split('/')[1];
    }
  },
});
