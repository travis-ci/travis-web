import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  needsAuth: false,

  renderTemplate() {
    $('body').attr('id', 'auth');
    return this.render('signin');
  },

  deactivate() {
    return this.get('auth').set('redirected', false);
  },

  actions: {
    afterSignIn() {
      if (this.get('features.dashboard')) {
        this.transitionTo('dashboard');
      } else {
        this.transitionTo('index');
      }
      return true;
    }
  },

  redirect() {
    if (this.signedIn()) {
      if (this.get('features.dashboard')) {
        return this.transitionTo('dashboard');
      } else {
        return this.transitionTo('index');
      }
    }
  },
});
