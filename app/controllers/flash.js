import Controller from '@ember/controller';

import { inject as service } from '@ember/service';

export default Controller.extend({
  flashes: service(),

  loadFlashes() {
    return this.flashes.loadFlashes(...arguments);
  }
});
