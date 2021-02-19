import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';
import Ember from 'ember';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel(transition) {
    const { token } = transition.to.params;
    const that = this;

    this.api.get(`/auth/confirm_user/${token}`)
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
    const { Logger } = Ember;
    Logger.info(this.auth.signedIn);
    return {
      signedIn: this.auth.signedIn
    };
  },
});
