import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Route.extend({
  auth: service(),
  router: service(),
  features: service(),

  title: 'Travis CI - Help Center',

  beforeModel() {
    if (config.environment !== 'test') {
      window.location.replace('https://www.travis-ci.com/help');
    }
  },

  afterModel() {
    if (this.auth.signedIn) {
      return this.auth.reloadCurrentUser(['user.emails']);
    }
  }
});
