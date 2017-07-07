import Ember from 'ember';
import TravisRoute from "travis/src/ui/routes/basic";

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),
  needsAuth: false,

  activate() {
    if (this.get('auth').get('signedIn')) {
      this.transitionTo('main');
    } else {
      this.get('auth').signIn();
    }
  }
});
