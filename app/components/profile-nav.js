import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and, gt } from '@ember/object/computed';
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

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),

  hasWebhookRepos: gt('model.webhooksRepositories.length', 0),
  hasReposOnOrg: gt('model.githubAppsRepositoriesOnOrg.length', 0),
  hasReposToMigrate: or('hasWebhookRepos', 'hasReposOnOrg'),

  showMigrateTab: and('features.proVersion', 'hasReposToMigrate'),

  migrateReposCount: computed(
    'model.webhooksRepositories.[]',
    'model.githubAppsRepositoriesOnOrg.[]',
    function () {
      const { webhooksRepositories, githubAppsRepositoriesOnOrg } = this.model;
      return webhooksRepositories.length + githubAppsRepositoriesOnOrg.length;
    }
  ),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    return !this.features.get('enterpriseVersion') && !!billingEndpoint;
  }),

});
