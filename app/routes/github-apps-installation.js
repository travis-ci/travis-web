import SimpleLayoutRoute from 'travis/routes/simple-layout';
import { inject as service } from '@ember/service';
import { reject } from 'rsvp';

export default SimpleLayoutRoute.extend({
  auth: service(),

  beforeModel(transition) {
    if (!this.auth.signedIn) {
      this.set('auth.afterSignInTransition', transition);
      return reject('needs-auth');
    }
  },

  setupController(controller) {
    this._super(...arguments);
    controller.startPolling();
  }
});
