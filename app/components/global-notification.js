import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, lt, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  auth: service(),
  storage: service(),
  router: service(),
  features: service(),
  user: reads('auth.currentUser'),
  trial: reads('user.trial'),
  isBuildLessThanEleven: lt('trial.buildsRemaining', 11),
  isBuildFinished: equal('trial.buildsRemaining', 0),
  bannerText: 'travis.temporary-announcement-banner',

  isTemporaryAnnouncementBannerEnabled: computed(function () {
    const isBannerEnabled = config.tempBanner.tempBannerEnabled === 'true';
    const isNewBannerMessage = this.storage.getItem(this.bannerText) !== config.tempBanner.tempBannerMessage;
    return isBannerEnabled && isNewBannerMessage;
  }),

  hasNoPlan: computed('user.allowance.subscriptionType', 'user.hasV2Subscription', 'user.subscription', function () {
    return !this.get('user.hasV2Subscription')
              && this.get('user.subscription') === undefined
              && this.get('user.allowance.subscriptionType') === 3
              && !(this.get('user.isUser') && this.get('user.isAssembla'));
  }),

  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user ||
        (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1) ||
        this.router.currentRouteName == 'first_sync' ||
        this.router.currentRouteName == 'github_apps_installation')
      return false;
    return !this.user.confirmedAt;
  }),

  bannersToDisplay: computed('hasNoPlan', 'isTemporaryAnnouncementBannerEnabled', 'isBuildFinished',
    'isBuildLessThanEleven', 'isUnconfirmed', function () {
      const banners = [];

      if (this.hasNoPlan) {
        banners.push('NoPlan');
      }

      if (this.isTemporaryAnnouncementBannerEnabled) {
        banners.push('TemporaryAnnouncementBanner');
      }

      if (this.isBuildFinished) {
        banners.push('BuildFinished');
      } else if (this.isBuildLessThanEleven) {
        banners.push('BuildRunningOut');
      }

      if (this.isUnconfirmed) {
        banners.push('UnconfirmedUserBanner');
      }

      return banners.slice(0, 2);
    }),
});
