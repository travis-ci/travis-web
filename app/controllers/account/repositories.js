import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  @computed('model')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },
});
