import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel() {
    if (this.auth.signedOut)
      return;
    const { id } = this.auth.currentUser;
    this.api.get(`/auth/request_confirmation/${id}`, {'travisApiVersion': null});
  }
});
