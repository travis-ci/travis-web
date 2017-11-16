import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  @computed('model')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },
});
