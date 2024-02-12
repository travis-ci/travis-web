import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  storage: service(),

  bannerKey: 'travis.repository-security-banner',

  showLicenseBanner: computed( {
    get() {
      if ( isPresent(this._showLicenseBanner)) {
        return this._showLicenseBanner;
      }
      return !this.storage.getItem(this.bannerKey);
    },
    set(key, value) {
      this.set('_showLicenseBanner', value);
      return this._showLicenseBanner;
    }
  }),

  actions: {
    closeLicenseBanner() {
      this.storage.setItem(this.bannerKey, 'true');
      this.set('showLicenseBanner', false);
    },
  }
});
