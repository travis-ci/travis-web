import Ember from 'ember';

import { service } from 'ember-decorators/service';

export default Ember.Controller.extend({
  @service flashes: null,

  loadFlashes() {
    return this.get('flashes').loadFlashes(...arguments);
  }
});
