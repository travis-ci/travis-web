/* global HS */

import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  openHelpScout() {
    if (typeof HS.beacon.open === 'function') {
      HS.beacon.open();
    } else {
      window.location.href = 'mailto:support@travis-ci.com';
    }
  }
});
