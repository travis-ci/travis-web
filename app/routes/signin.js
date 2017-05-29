import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),
  needsAuth: false,

  activate() {
    if (this.auth.get('signedIn')) {
      this.transitionTo('index');
    } else {
      this.auth.signIn();
    }
  }
});
