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
  hasSettingsReadPermissions: reads('model.permissions.settings_read'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: computed('isOrganizationAdmin', 'isProVersion', 'hasSettingsReadPermissions', function () {
    const forOrganization = !this.isOrganization || this.hasSettingsReadPermissions;
    return this.isOrganizationAdmin && this.isProVersion && forOrganization;
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
  showPaymentDetailsTab: computed('showSubscriptionTab', 'isOrganization', 'isOrganizationAdmin',
    'hasBillingViewPermissions', 'hasInvoicesViewPermissions', 'model.isNotGithubOrManual', function () {
      if (this.isOrganization) {
        const forOrganization = !this.isOrganization || this.hasBillingViewPermissions || this.hasInvoicesViewPermissions;

        return this.showSubscriptionTab &&  this.model.get('isNotGithubOrManual') && (this.isOrganizationAdmin || forOrganization);
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
    const userUsage = this.model.allowance.userUsage;
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
      this.flashes.custom('flashes/read-only-mode', {}, 'warning');
    }

    if (!allowance) {
      return;
    }

    if (allowance.paymentChangesBlockCredit || allowance.paymentChangesBlockCaptcha) {
      let time;
      if (allowance.paymentChangesBlockCaptcha) time = allowance.captchaBlockDuration;
      if (allowance.paymentChangesBlockCredit) time = allowance.creditCardBlockDuration;
      this.flashes.custom('flashes/payment-details-edit-lock', { owner: this.model, isUser: this.model.isUser, time: time}, 'warning');
    }

    if (allowance.subscriptionType !== 2) {
      return;
    }

    if (!allowance.privateRepos && !allowance.publicRepos && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-private-and-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!allowance.privateRepos && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-private', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!allowance.publicRepos && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
    }

    if (allowance.pendingUserLicenses) {
      this.flashes.custom('flashes/pending-user-licenses', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!this.usersUsage) {
      this.flashes.custom('flashes/users-limit-exceeded', { owner: this.model, isUser: this.model.isUser }, 'warning');
    }
  },

  willDestroyElement() {
    const allowance = this.model.allowance;

    if (allowance && allowance.subscriptionType === 2) {
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
