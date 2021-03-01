import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel(transition) {
    const { token } = transition.to.params;
    const that = this;
    this.api.get(`/auth/confirm_user/${token}`, {'travisApiVersion': null})
      .then(() => {
        if (this.auth.signedIn) {
          that.auth.sync()
            .then(() => that.transitionTo('/'));
        } else {
          that.transitionTo('/');
        }
      })
      .catch(_error => _error);
  },

  model() {
    return {
      signedIn: this.auth.signedIn
    };
  },
});
