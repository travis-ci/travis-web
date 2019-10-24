import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  metrics: service(),

  actions: {
    signIn() {
      this.auth.signIn();
    },

    signOut() {
      return this.signOut();
    },
  },
});
