import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  storage: service(),

  bannerKey: 'travis.plan-share-admin-revoked-banner',

  showBanner: computed({
    get() {
      if (isPresent(this._showBanner)) {
        return this._showBanner;
      }
      return !this.storage.getItem(this.bannerKey);
    },
    set(key, value) {
      this.set('_showBanner', value);
      return this._showBanner;
    }
  }),

  actions: {
    closeBanner() {
      this.storage.setItem(this.bannerKey, 'true');
      this.set('showBanner', false);
    },
  }
});
