import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  titleToken: 'Settings',

  model() {
    var repo;
    repo = this.modelFor('repo');
    return repo.fetchSettings().then(function (settings) {
      return repo.set('settings', settings);
    });
  }
});
