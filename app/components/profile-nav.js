import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and, gt, collect, sum } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { billingEndpoint, githubOrgsOauthAccessSettingsUrl } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),
  features: service(),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),

  activeModel: null,
  model: reads('activeModel'),

  webhooksRepositories: reads('model.webhooksRepositories'),
  githubAppsRepositories: reads('model.githubAppsRepositoriesOnOrg'),

  webhooksRepositoriesCount: reads('webhooksRepositories.total'),
  githubAppsRepositoriesCount: reads('githubAppsRepositories.total'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  hasWebhookRepos: gt('webhooksRepositoriesCount', 0),
  hasReposOnOrg: gt('githubAppsRepositoriesCount', 0),
  hasReposToMigrate: or('hasWebhookRepos', 'hasReposOnOrg'),

  showMigrateTab: and('features.proVersion', 'hasReposToMigrate'),
  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),

  migrateReposTotals: collect('webhooksRepositoriesCount', 'githubAppsRepositoriesCount'),
  migrateReposCount: sum('migrateReposTotals'),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    return !this.features.get('enterpriseVersion') && !!billingEndpoint;
  }),

});
