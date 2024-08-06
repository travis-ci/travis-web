import Component from '@ember/component';
import config from 'travis/config/environment';

export default Component.extend({
  message: '',
  enabled: false,

  init() {
    this._super(...arguments);
    this.set('enabled', config.tempBanner.tempBannerEnabled === 'true');
    this.set('message', config.tempBanner.tempBannerMessage || '');
  },

  closeBanner() {
    this.set('enabled', false);
  }
});
