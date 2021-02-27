import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel() {
    if (this.auth.signedOut)
      return;
    const {token, id} = this.auth.currentUser;
    this.api.get(`/auth/request_confirmation/${token}/${id}`, {'travisApiVersion': null});
  }
});
