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

  model({ redirectUri }) {
    if (redirectUri) {
      this.auth.set('redirectUrl', redirectUri);
    }
  },

  renderTemplate() {
    $('body').attr('id', 'auth');
    return this.render('signin');
  },

  redirect() {
    if (this.auth.signedIn) {
      if (this.get('features.dashboard')) {
        return this.transitionTo('dashboard');
      } else {
        return this.transitionTo('index');
      }
    }
  },
});
