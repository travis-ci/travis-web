import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  router: service(),
  features: service(),

  title: 'Travis CI - Help Center',

  beforeModel() {
    let pro = this.get('features.proVersion');
    if (!pro) {
      window.location.replace('https://www.travis-ci.com/help');
    }
  },

  afterModel() {
    if (this.auth.signedIn) {
      return this.auth.reloadCurrentUser(['user.emails']);
    }
  }
});
