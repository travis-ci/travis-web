import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,
  repos: Ember.computed('model', function () {
    var data, repos;
    data = this.get('model');
    repos = [];
    if (data.repositories) {
      repos = data.repositories.filter(function (item) {
        if (item.active) {
          return item;
        }
      }).sortBy('currentBuild.finished_at').reverse();
    }
    return repos;
  })
});
