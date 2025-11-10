import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel(transition) {
    const { token } = transition.to.params;
    return this.api.get(`/auth/confirm_user/${token}`, {'travisApiVersion': null})
      .then(() => {
        if (this.auth.signedIn) {
          return this.auth.sync()
            .then(() => this.transitionTo('/'));
        } else {
          return this.transitionTo('/');
        }
      })
      .catch(_error => {
      });
  },

  model() {
    return {
      signedIn: this.get('auth.signedIn')
    };
  },
});
