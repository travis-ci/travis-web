import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  appLoading: service(),

  didInsertElement() {
    this._super(...arguments);
    return this.get('appLoading.fetchTravisStatus').perform();
  },
});
