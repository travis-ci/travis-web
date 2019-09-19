import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  auth: service(),
  features: service(),

  enableAssemblaLogin: computed(function () {
    return this.features.get('enable-assembla-login');
  }),

  actions: {
    signIn(provider) {
      return this.auth.signInWith(provider);
    },

    signOut() {
      return this.signOut();
    },
  },
});
