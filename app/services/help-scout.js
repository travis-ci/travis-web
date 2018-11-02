/* global HS */

import Service from '@ember/service';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service store: null,

  openHelpScout() {
    if (typeof HS.beacon.open === 'function') {
      HS.beacon.open();
    } else {
      window.location.href = 'mailto:support@travis-ci.com';
    }
  }
});
