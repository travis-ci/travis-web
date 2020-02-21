import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),

  title: 'Travis CI - Help Center',

  afterModel() {
    if (this.auth.signedIn) {
      return this.auth.reloadCurrentUser(['user.emails']);
    }
  }
});
