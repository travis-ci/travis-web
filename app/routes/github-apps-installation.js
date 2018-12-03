import SimpleLayoutRoute from 'travis/routes/simple-layout';
import { inject as service } from '@ember/service';
import { reject } from 'rsvp';

export default SimpleLayoutRoute.extend({
  auth: service(),

  beforeModel(transition) {
    if (!this.signedIn()) {
      this.set('auth.afterSignInTransition', transition);
      return reject('needs-auth');
    }
  },

  signedIn() {
    return this.get('auth.currentUser');
  },

  model() {
    return {};
  },

  setupController(controller, model) {
    controller.startPolling();
  }
});
