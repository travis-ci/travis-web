import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  multiVcs: service(),
  metrics: service(),

  actions: {
    signIn(provider) {
      this.auth.signInWith(provider);
    },

    signOut() {
      return this.signOut();
    },
  },
});
