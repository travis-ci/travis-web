import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),
  needsAuth: false,

  renderTemplate() {
    this.render('signin');
  },

  activate() {
    if (this.auth.get('signedIn')) {
      this.transitionTo('main');
    } else {
      this.auth.signIn();
    }
  }
});
