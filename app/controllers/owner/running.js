import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,
  running: Ember.computed('model', function () {
    let data, repos;
    data = this.get('model');
    repos = data.repositories.filter(item => {
      if (item.currentBuild !== null) {
        if (item.currentBuild.state === 'started') {
          return item;
        }
      }
    });
    return repos;
  })
});
