import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  router: service(),
  features: service(),

  actions: {
    signIn() {
      const redirectUrl = window.location.href;
      this.router.transitionTo('signin', { queryParams: { redirectUrl }});
    }
  }
});
