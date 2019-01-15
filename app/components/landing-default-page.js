import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),

  actions: {
    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },
  },
});
