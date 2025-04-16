import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  storage: service(),
  bannerText: 'travis.temporary-announcement-banner',

  message: '',
  enabled: false,

  init() {
    this._super(...arguments);
    const isBannerEnabled = config.tempBanner.tempBannerEnabled === 'true';
    const isNewBannerMessage = this.storage.getItem(this.bannerText) !== config.tempBanner.tempBannerMessage;
    this.set('enabled', isBannerEnabled && isNewBannerMessage);
    this.set('message', config.tempBanner.tempBannerMessage || '');
  },

  actions: {
    closeBanner() {
      this.storage.setItem(this.bannerText, config.tempBanner.tempBannerMessage);
      this.set('enabled', false);
    },
  }
});
