import Ember from 'ember';
import { computed, action } from 'ember-decorators/object';

export default Ember.Controller.extend({
  @computed('model')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },

  @action
  filterQuery(query) {
    return this.get('store')
      .query('repo', {
        slug_matches: query,
        sort_by: 'slug_match:desc',
        limit: 10,
        custom: {
          owner: this.get('login'),
          type: 'byOwner',
        },
      });
  },
});
