import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,
  repos: function() {
    var data, repos;
    data = this.get('model');
    repos = [];
    if (data.repositories) {
      repos = data.repositories.filter(function(item, index) {
        if (item.active) {
          return item;
        }
      }).sortBy('default_branch.last_build.finished_at').reverse();
    }
    return repos;
  }.property('model')
});
