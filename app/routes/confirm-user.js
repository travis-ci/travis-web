import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel(transition) {
    const { token } = transition.to.params;
    const that = this;

    this.api.get(`/confirm_user/${token}`)
      .then(_result => {
        if (that.auth.signedOut) {
          that.auth.signIn();
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
