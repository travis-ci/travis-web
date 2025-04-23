import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {
  alias,
  reads,
  or,
  and,
  not,
  filterBy,
  notEmpty,
  match
} from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { vcsLinks } from 'travis/services/external-links';
import { task } from 'ember-concurrency';


const { billingEndpoint } = config;

export default Component.extend({
  tagName: '',

  auth: service(),
  accounts: service(),
  features: service(),
  flashes: service(),
  storage: service(),
  wizard: service('wizard-state'),

  activeModel: null,
  model: reads('activeModel'),

  currentUser: alias('auth.currentUser'),
  userRoMode: reads('currentUser.roMode'),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),
  vcsType: reads('user.vcsType'),
  vcsId: reads('user.vcsId'),

  isProVersion: reads('features.proVersion'),
  isNotProVersion: not('isProVersion'),

  isEnterpriseVersion: reads('features.enterpriseVersion'),
  isNotEnterpriseVersion: not('isEnterpriseVersion'),

  isMatchGithub: match('vcsType', /Github\S+$/),

  accountsForBeta: filterBy('accounts.all', 'isMigrationBetaRequested', false),
  hasAccountsForBeta: notEmpty('accountsForBeta'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),
  accessSettingsUrl: computed('user.vcsType', 'user.vcsId', function () {
    return vcsLinks.accessSettingsUrl(this.user.vcsType, { owner: this.user.login });
  }),

  reposToMigrate: reads('model.githubAppsRepositoriesOnOrg'),

  showMigrateTab: false,
  showSubscriptionStatusBanner: and('showSubscriptionTab', 'model.subscriptionError'),
  showMigrationBetaBanner: false,

  isOrganization: reads('model.isOrganization'),
  hasAdminPermissions: reads('model.permissions.admin'),
  hasPlanViewPermissions: reads('model.permissions.plan_view'),
  hasPlanUsagePermissions: reads('model.permissions.plan_usage'),
  hasPlanCreatePermissions: reads('model.permissions.plan_create'),
  hasBillingViewPermissions: reads('model.permissions.billing_view'),
  hasInvoicesViewPermissions: reads('model.permissions.plan_invoices'),
  hasSettingsCreatePermissions: reads('model.permissions.settings_create'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: computed('isOrganization', 'isOrganizationAdmin', 'isProVersion', 'hasSettingsCreatePermissions', function () {
    const forOrganization = !this.isOrganization || this.hasSettingsCreatePermissions;
    return (this.isOrganizationAdmin || forOrganization) && this.isProVersion;
  }),

  showSubscriptionTab: computed('features.enterpriseVersion', 'hasPlanViewPermissions',
    'hasPlanCreatePermissions', 'model.isAssembla', 'model.isUser',
    'isOrganization', function () {
      const forOrganization = !this.isOrganization ||
        ((this.model.hasSubscription || this.model.hasV2Subscription) && !!this.hasPlanViewPermissions) ||
        !!this.hasPlanCreatePermissions;

      const isAssemblaUser = this.model.isUser && this.model.isAssembla;
      const isEnterprise = this.features.get('enterpriseVersion');
      return !isEnterprise && !isAssemblaUser && !!billingEndpoint && !!forOrganization;
    }),

  showSharePlanTab: computed('features.enterpriseVersion', 'hasPlanViewPermissions',
    'hasPlanCreatePermissions', 'model.isAssembla', 'model.isUser', 'model.v2subscription',
    'isOrganization', function () {
      const forOrganization = !this.isOrganization ||
        ((this.model.hasSubscription || this.model.hasV2Subscription) && !!this.hasPlanViewPermissions);

      const isAssemblaUser = this.model.isUser && this.model.isAssembla;
      const isEnterprise = this.features.get('enterpriseVersion');
      const isOnSharedPlan = !!(
        this.model.hasV2Subscription &&
        (this.model.v2subscription.sharedBy && this.model.v2subscription.sharedBy != this.model.id)
      );

      return this.model.isPlanShareEnabled && this.model.hasV2Subscription && !isEnterprise && !isAssemblaUser &&
        !!billingEndpoint && !!forOrganization && !isOnSharedPlan;
    }),

  isSharePlanTabDisabled: computed('model.v2subscription.isCanceled', 'model.v2subscription.isExpired',
    'model.v2subscription.current_trial', 'model.v2subscription.plan.isFree', 'model.v2subscription', 'model.isUser', 'isOrganization', function () {
      const isCanceled = this.model.v2subscription?.isCanceled;
      const isExpired = this.model.v2subscription?.isExpired;
      const isOnTrialOrFree = !!(
        this.model.v2subscription &&
        (
          this.model.v2subscription.current_trial ||
          (this.model.v2subscription.plan && this.model.v2subscription.plan.isFree)
        )
      );
      return isCanceled || isExpired || isOnTrialOrFree;
    }),

  showPaymentDetailsTab: computed('showSubscriptionTab', 'isOrganization', 'isOrganizationAdmin',
    'hasBillingViewPermissions', 'hasInvoicesViewPermissions', 'model.isNotGithubOrManual', function () {
      if (this.isOrganization) {
        const forOrganization = !this.isOrganization || this.hasBillingViewPermissions || this.hasInvoicesViewPermissions;
        const isOnSharedPlan = !!(
          this.model.hasV2Subscription &&
                                (this.model.v2subscription.sharedBy && this.model.v2subscription.sharedBy != this.model.id)
        );

        return this.showSubscriptionTab &&  this.model.get('isNotGithubOrManual') && (this.isOrganizationAdmin || forOrganization) && !isOnSharedPlan;
      } else {
        return this.showSubscriptionTab && this.model.get('isNotGithubOrManual');
      }
    }),
  showPlanUsageTab: computed('showSubscriptionTab', 'model.hasCredits', 'hasPlanUsagePermissions', function () {
    const forOrganization = !this.isOrganization || this.hasPlanUsagePermissions;
    return this.showSubscriptionTab && this.model.hasCredits && forOrganization;
  }),

  usersUsage: computed('account.allowance.userUsage', 'addonUsage', 'hasPlanUsagePermissions', function () {
    // const forOrganization = !this.isOrganization || this.hasPlanUsagePermissions;
    const userUsage = this.model.allowance.get('userUsage');
    if (userUsage === undefined) {
      return true;
    }
    return userUsage;
  }),

  wizardStep: reads('storage.wizardStep'),
  wizardState: reads('wizard.state'),
  showWizard: computed('wizardStep', function () {
    let state = this.wizardStep;
    return state && state <= 3;
  }),

  didRender() {
    const allowance = this.model.allowance;

    if (this.userRoMode) {
      this.flashes.custom('flashes/read-only-mode', {}, 'read-only-mode');
    }

    if (!allowance) {
      return;
    }

    if (allowance.get('subscriptionType') !== 2) {
      return;
    }

    if (allowance.get('pendingUserLicenses')) {
      this.flashes.custom('flashes/pending-user-licenses',
        { owner: this.model, isUser: this.model.isUser }, 'pending-user-licenses');
    } else if (!this.usersUsage) {
      this.flashes.custom('flashes/users-limit-exceeded',
        { owner: this.model, isUser: this.model.isUser }, 'users-limit-exceeded');
    }
  },

  willDestroyElement() {
    const allowance = this.model.allowance;

    if (allowance && allowance.get('subscriptionType') === 2) {
      this.flashes.removeCustomsByClassName('warning');
    }
  },

  closeWizard: task(function* () {
    this.set('showWizard', false);
    yield this.wizard.delete.perform();
  }).drop(),

  actions: {
    onWizardClose() {
      this.closeWizard.perform();
    }
  }
});
