import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and, not, filterBy, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { billingEndpoint, githubOrgsOauthAccessSettingsUrl } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),
  features: service(),

  activeModel: null,
  model: reads('activeModel'),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),

  isProVersion: reads('features.proVersion'),
  isNotProVersion: not('isProVersion'),

  accountsForBeta: filterBy('accounts.all', 'isMigrationBetaRequested', false),
  hasAccountsForBeta: notEmpty('accountsForBeta'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  reposToMigrate: reads('model.githubAppsRepositoriesOnOrg'),

  showMigrateTab: and('features.proVersion', 'model.allowMigration'),
  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),
  showMigrationBetaBanner: and('isNotProVersion', 'hasAccountsForBeta'),

  isOrganization: reads('model.isOrganization'),
  hasAdminPermissions: reads('model.permissions.admin'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: and('isOrganizationAdmin', 'isProVersion'),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    return !this.features.get('enterpriseVersion') && !!billingEndpoint;
  }),

});
