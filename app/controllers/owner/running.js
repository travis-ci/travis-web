import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,
  running: function() {
    var data, repos;
    data = this.get('model');
    repos = data.repositories.filter(function(item, index) {
      if (item.default_branch.current_build !== null) {
        if (item.default_branch.current_build.state === 'started') {
          return item;
        }
      }
    });
    return repos;
  }.property('model')
});
