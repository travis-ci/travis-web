import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, equal, lt, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  auth: service(),
  storage: service(),
  router: service(),
  features: service(),
  store: service(),
  user: reads('auth.currentUser'),
  isProVersion: reads('features.proVersion'),
  hasAdminPermissions: reads('model.permissions.admin'),
  isOrganization: reads('model.isOrganization'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  isUser: reads('user.isUser'),
  bannerText: 'travis.temporary-announcement-banner',
  bannerKey: 'travis.repository-security-banner',
  lsSeats: 'travis.enterprise.seats_msg_seen',
  isBuildLessThanEleven: lt('model.trial.buildsRemaining', 11),
  isBuildFinished: equal('model.trial.buildsRemaining', 0),
  activeModel: null,
  model: reads('activeModel'),
  planShareReceiver: null,

  paymentDetailsEditLockedTime: computed('model.allowance.paymentChangesBlockCaptcha', function () {
    const allowance = this.model?.allowance;
    if (!allowance) return undefined;

    let time;
    if (allowance.get('paymentChangesBlockCaptcha')) time = allowance.get('captchaBlockDuration');
    if (allowance.get('paymentChangesBlockCredit')) time = allowance.get('creditCardBlockDuration');

    return time;
  }),

  isBalanceNegativeProfile: computed('model.allowance.publicRepos', 'model.allowance.privateRepos', function () {
    const allowance = this.model?.allowance;
    if (!allowance) {
      return;
    }
    return allowance.get('subscriptionType') !== 3 && (this.isOrganizationAdmin || this.model.isUser)
      && (allowance.get('privateRepos') === false || allowance.get('publicRepos') === false);
  }),

  isBalanceNegativeRepo: computed('repo.allowance', function () {
    const repo = this.get('repo');
    if (!repo) {
      return;
    }
    const allowance = repo.get('allowance');

    return allowance && allowance.get('subscriptionType') !== 3 && this.isProVersion && !repo.canOwnerBuild
      && this.auth.currentUser && this.auth.currentUser.confirmedAt;
  }),

  isTemporaryAnnouncementBannerEnabled: computed(function () {
    const isBannerEnabled = config.tempBanner.tempBannerEnabled === 'true';
    const isNewBannerMessage = this.storage.getItem(this.bannerText) !== config.tempBanner.tempBannerMessage;
    return isBannerEnabled && isNewBannerMessage;
  }),

  hasNoPlan: computed('model.allowance.subscriptionType', 'model.hasV2Subscription', 'model.subscription', function () {
    return !this.get('model.hasV2Subscription')
              && this.get('model.subscription') === undefined
              && this.get('model.allowance.subscriptionType') === 3
              && !(this.get('model.isUser') && this.get('model.isAssembla'));
  }),

  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user ||
        (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1) ||
        this.router.currentRouteName == 'first_sync' ||
        this.router.currentRouteName == 'github_apps_installation')
      return false;
    return !this.user.confirmedAt;
  }),

  isPlanShareAdminRevoked: computed('model.v2subscription', function () {
    let sharedPlanDonor = !!(this.model && this.model.v2subscription &&
                          (
                            !this.model.v2subscription.sharedBy && this.model.v2subscription.planShares &&
                            this.model.v2subscription.planShares.length > 0 ||
                            this.model.v2subscription.sharedBy == this.model.id)
    );
    let adminRevoked = false;
    if (sharedPlanDonor && this.model.v2subscription.planShares) {
      this.model.v2subscription.planShares.forEach(item => {
        const key = `travis.plan-share-admin-revoked-banner-${item.receiver.login}`;
        let isDismissed = !!this.storage.getItem(key);
        if (item.admin_revoked) {
          if (!isDismissed) {
            adminRevoked = true;
            this.planShareReceiver = item.receiver.login;
          }
        } else if (isDismissed) {
          this.storage.removeItem(key);
        }
      });
    }
    return adminRevoked;
  }),

  showLicenseBanner: computed(function () {
    return this.user && this.user.isUser && !this.storage.getItem(this.bannerKey);
  }),

  showEnterpriseBanner: computed(function () {
    return this.features.get('enterpriseVersion');
  }),

  bannersToDisplay: computed('hasNoPlan', 'isTemporaryAnnouncementBannerEnabled', 'isBuildFinished',
    'isBuildLessThanEleven', 'showLicenseBanner', 'isUnconfirmed', 'isBalanceNegative', 'paymentDetailsEditLockedTime',
    'isBalanceNegativeRepo', 'isBalanceNegativeProfile', 'isPlanShareAdminRevoked', 'showEnterpriseBanner',  function () {
      const banners = [];

      if (this.hasNoPlan) {
        banners.push('NoPlan');
      }

      if (this.isBalanceNegativeProfile) {
        const allowance = this.model.allowance;

        if (allowance && !allowance.get('privateRepos') && !allowance.get('publicRepos')) {
          banners.push('NegativeBalancePrivateAndPublic');
        } else if (allowance && !allowance.get('privateRepos')) {
          banners.push('NegativeBalancePrivate');
        } else if (allowance && !allowance.get('publicRepos')) {
          banners.push('NegativeBalancePublic');
        }
      }

      if (this.isBalanceNegativeRepo) {
        const repo = this.get('repo');

        if (repo.private) {
          banners.push('NegativeBalancePrivate');
        } else {
          banners.push('NegativeBalancePublic');
        }
      }

      if (this.isTemporaryAnnouncementBannerEnabled) {
        banners.push('TemporaryAnnouncementBanner');
      }

      if (this.isBuildFinished) {
        banners.push('BuildFinished');
      } else if (this.isBuildLessThanEleven) {
        banners.push('BuildRunningOut');
      }

      if (this.showLicenseBanner) {
        banners.push('RepositorySecurityBanner');
      }

      if (this.isUnconfirmed) {
        banners.push('UnconfirmedUserBanner');
      }

      if (this.paymentDetailsEditLockedTime) {
        banners.push('PaymentDetailsEditLock');
      }

      if (this.showEnterpriseBanner) {
        banners.push('EnterpriseBanner');
      }
      if (this.isPlanShareAdminRevoked) {
        banners.push('PlanShareAdminRevokedBanner');
      }
      return banners.slice(0, 2);
    })
});
