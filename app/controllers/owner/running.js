import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,
  running: Ember.computed('model', function () {
    var data, repos;
    data = this.get('model');
    repos = data.repositories.filter(function (item) {
      if (item.currentBuild !== null) {
        if (item.currentBuild.state === 'started') {
          return item;
        }
      }
    });
    return repos;
  })
});
