import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service features: null,

  page: 1,

  @computed('model.deprecated')
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
