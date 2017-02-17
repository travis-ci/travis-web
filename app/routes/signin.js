import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

const { service } = Ember.inject;

export default Ember.Route.extend(BaseRouteMixin, {
  auth: service(),
  needsAuth: false,

  activate() {
    if (this.auth.get('signedIn')) {
      this.transitionTo('main');
    } else {
      this.auth.signIn();
    }
  }
});
