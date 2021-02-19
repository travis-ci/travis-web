import TravisRoute from 'travis/routes/basic';

import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),

  beforeModel() {
    if (this.auth.signedOut)
      return;
    this.api.get(`/auth/request_confirmation/${this.auth.currentUser.id}`);
  }
});
