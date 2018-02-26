import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service appLoading: null,

  didInsertElement() {
    this._super(...arguments);
    return this.get('appLoading.fetchTravisStatus').perform();
  },
});
