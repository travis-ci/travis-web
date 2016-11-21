import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  needsAuth: false,

  renderTemplate() {
    // Ember.$('body').attr('id', 'auth');
    return this.render('auth.signin');
  },

  activate() {
    if (this.auth.get('signedIn')) {
      this.transitionTo('main');
    } else {
      this.auth.signIn();
    }
  }
});
