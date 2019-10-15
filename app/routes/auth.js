import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  auth: service(),
  features: service(),

  queryParams: {
    redirectUri: {
      refreshModel: true
    }
  },

  needsAuth: false,

  model(params) {
    if (params.redirectUri) {
      return { redirectUri: params.redirectUri };
    }
  },

  renderTemplate(controller, model) {
    $('body').attr('id', 'auth');
    return this.render('signin', {
      model
    });
  },

  deactivate() {
    return this.auth.set('redirected', false);
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
