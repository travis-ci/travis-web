import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    if (this.get('features.dashboard')) {
      return this.transitionTo('dashboard');
    } else {
      return this.transitionTo('main');
    }
  }
});
