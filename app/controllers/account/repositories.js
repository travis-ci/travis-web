import Ember from 'ember';
import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';

export default Controller.extend({
  @computed('model')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },

  @action
  filterQuery(query) {
    return this.get('store')
      .query('repo', {
        slug_filter: query,
        sort_by: 'slug_filter:desc',
        limit: 10,
        custom: {
          owner: this.get('login'),
          type: 'byOwner',
        },
      });
  },
});
