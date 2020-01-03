import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  auth: service(),

  actions: {
    signIn(provider) {
      this.auth.signInWith(provider);
    },
  },
});
