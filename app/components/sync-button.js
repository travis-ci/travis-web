import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  auth: service(),

  user: reads('auth.currentUser'),
  classNames: ['sync-button'],

  actions: {
    sync() {
      if (!this.isOrganization) {
        return this.user.sync();
      }
    }
  }
});
