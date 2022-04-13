import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  storage: service(),

  bannerKey: 'travis.repository-security-banner',

  showLicenseBanner: computed(function () {
    return !this.storage.getItem(this.bannerKey);
  }),

  actions: {
    closeLicenseBanner() {
      this.storage.setItem(this.bannerKey, 'true');
      this.set('showLicenseBanner', false);
    },
  }
});
