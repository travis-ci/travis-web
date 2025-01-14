import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  storage: service(),
  bannerKey: 'travis.temporary-announcement-banner',

  message: '',
  enabled: false,

  init() {
    this._super(...arguments);
    this.set('enabled', config.tempBanner.tempBannerEnabled === 'true' && !this.storage.getItem(this.bannerKey));
    this.set('message', config.tempBanner.tempBannerMessage || '');
  },

  closeBanner() {
    this.storage.setItem(this.bannerKey, 'true');
    this.set('enabled', false);
  }
});
