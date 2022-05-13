import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  router: service(),

  title: 'Travis CI - Help Center',

  beforeModel() {
    window.location.replace('https://www.travis-ci.com/help');
  },

  afterModel() {
    if (this.auth.signedIn) {
      return this.auth.reloadCurrentUser(['user.emails']);
    }
  }
});
