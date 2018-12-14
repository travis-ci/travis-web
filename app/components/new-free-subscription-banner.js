import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  ajax: service(),
  flashes: service(),

  actions: {
    createFreeSubscription() {
      this.ajax.postV3('/FIXME').then(() => {
        this.flashes.success('Success FIXME');
      }).catch(() => {
        this.flashes.error('Error FIXME');
      });
    }
  }
});
