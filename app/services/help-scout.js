import Service from '@ember/service';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service store: null,

  openHelpScout() {
    HS.beacon.ready(function() {
      if(typeof this.open === 'function') {
        this.open();
      } else {
        window.location.href = 'mailto:support@travis-ci.com';
        return false;
      }
    });
  }
});
