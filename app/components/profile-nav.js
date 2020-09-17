import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {
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

const { billingEndpoint } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),
  features: service(),
  flashes: service(),

  activeModel: null,
  model: reads('activeModel'),

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

  showMigrateTab: and('features.proVersion', 'isNotEnterpriseVersion', 'isMatchGithub'),
  showSubscriptionStatusBanner: and('showSubscriptionTab', 'model.subscriptionError'),
  showMigrationBetaBanner: and('isNotProVersion', 'isNotEnterpriseVersion', 'hasAccountsForBeta'),

  isOrganization: reads('model.isOrganization'),
  hasAdminPermissions: reads('model.permissions.admin'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: and('isOrganizationAdmin', 'isProVersion'),

  showSubscriptionTab: computed('features.enterpriseVersion', 'model.isAssembla', 'model.isUser', function () {
    const isAssemblaUser = this.model.isUser && this.model.isAssembla;
    const isEnterprise = this.features.get('enterpriseVersion');
    return !isEnterprise && !isAssemblaUser && !!billingEndpoint;
  }),

  didRender() {
    const allowance = this.model.allowance;

    if (!allowance || allowance.subscriptionType !== 2)
      return;

    if (!allowance.privateRepos) {
      this.flashes.custom('flashes/negative-balance-private', { owner: this.model, isUser: this.model.isUser }, 'warning');
    } else if (!allowance.publicRepos) {
      this.flashes.custom('flashes/negative-balance-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
    }
  },

  willDestroyElement() {
    const allowance = this.model.allowance;

    if (allowance && allowance.subscriptionType === 2) {
      this.flashes.removeCustomsByClassName('warning');
    }
  }
});
