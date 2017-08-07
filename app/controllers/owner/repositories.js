import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  isLoading: false,

  @computed('model')
  repos(data) {
    var repos;
    repos = [];
    if (data.repositories) {
      repos = data.repositories.filter(function (item) {
        if (item.active) {
          return item;
        }
      }).sortBy('default_branch.last_build.finished_at').reverse();
    }
    return repos;
  },
});
