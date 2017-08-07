import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  isLoading: false,

  @computed('model')
  running(data) {
    var repos;
    repos = data.repositories.filter(function (item) {
      if (item.currentBuild !== null) {
        if (item.currentBuild.state === 'started') {
          return item;
        }
      }
    });
    return repos;
  },
});
