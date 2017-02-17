import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  redirect() {
    if (this.signedIn()) {
      return this.transitionTo('main.repositories');
    } else {
      return this.transitionTo('home');
    }
  }
});
