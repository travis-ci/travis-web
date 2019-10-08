import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  metrics: service(),

  actions: {
    gaCta(location) {
      const page = `/virtual/signup?${location}`;
      this.metrics.trackPage({ page });
      this.auth.signIn();
    },

    signIn() {
      return this.signIn();
    },

    signOut() {
      return this.signOut();
    },
  },
});
