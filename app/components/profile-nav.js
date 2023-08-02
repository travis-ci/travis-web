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
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: and('isOrganizationAdmin', 'isProVersion'),

  showSubscriptionTab: computed('features.enterpriseVersion', 'model.isAssembla', 'model.isUser', function () {
    const isAssemblaUser = this.model.isUser && this.model.isAssembla;
    const isEnterprise = this.features.get('enterpriseVersion');
    return !isEnterprise && !isAssemblaUser && !!billingEndpoint;
  }),
  showPaymentDetailsTab: computed('showSubscriptionTab', 'isOrganization', 'isOrganizationAdmin', 'model.isNotGithubOrManual', function () {
    if (this.isOrganization) {
      return this.showSubscriptionTab && this.isOrganizationAdmin && this.model.get('isNotGithubOrManual');
    } else {
      return this.showSubscriptionTab && this.model.get('isNotGithubOrManual');
    }
  }),
  showPlanUsageTab: and('showSubscriptionTab', 'model.hasCredits'),
  usersUsage: computed('account.allowance.userUsage', 'addonUsage', function () {
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
      this.flashes.custom('flashes/read-only-mode', {}, 'warning');
    }

    if (!allowance) {
      return;
    }

    if (allowance.get('paymentChangesBlockCredit') || allowance.get('paymentChangesBlockCaptcha')) {
      let time;
      if (allowance.get('paymentChangesBlockCaptcha')) time = allowance.get('captchaBlockDuration');
      if (allowance.get('paymentChangesBlockCredit')) time = allowance.get('creditCardBlockDuration');
      this.flashes.custom('flashes/payment-details-edit-lock', { owner: this.model, isUser: this.model.isUser, time: time}, 'warning');
    }

    if (allowance.get('subscriptionType') !== 2) {
      return;
    }

    if (!allowance.get('privateRepos') && !allowance.get('publicRepos') && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-private-and-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!allowance.get('privateRepos') && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-private', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!allowance.get('publicRepos') && (this.isOrganizationAdmin || this.model.isUser)) {
      this.flashes.custom('flashes/negative-balance-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
    }

    if (allowance.get('pendingUserLicenses')) {
      this.flashes.custom('flashes/pending-user-licenses', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!this.usersUsage) {
      this.flashes.custom('flashes/users-limit-exceeded', { owner: this.model, isUser: this.model.isUser }, 'warning');
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
