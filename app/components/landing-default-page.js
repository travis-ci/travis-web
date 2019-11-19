import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  multiVcs: service(),

  actions: {
    signIn(provider) {
      return this.auth.signInWith(provider);
    },

    signOut() {
      return this.signOut();
    },
  },
});
