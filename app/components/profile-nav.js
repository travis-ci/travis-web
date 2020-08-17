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
  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),
  showMigrationBetaBanner: and('isNotProVersion', 'isNotEnterpriseVersion', 'hasAccountsForBeta'),

  isOrganization: reads('model.isOrganization'),
  hasAdminPermissions: reads('model.permissions.admin'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  showOrganizationSettings: and('isOrganizationAdmin', 'isProVersion'),

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    return !this.features.get('enterpriseVersion') && !!billingEndpoint;
  }),

  didRender() {
    const isUser = this.model.isUser;
    const login = this.model.login;
    const allowance = this.model.allowance;
    const plansPath = isUser ? `https://travis-ci.com/account/${config.planSuffix}` : `https://travis-ci.com/organizations/${login}/${config.planSuffix}`;
    const settingsPath = isUser ? `https://travis-ci.com/account/${config.settingsSuffix}` : `https://travis-ci.com/organizations/${login}/${config.settingsSuffix}`;

    if (allowance && !allowance.public_repos) {
      this.flashes.warning(`Builds have been temporarily disabled for public repositories due to a negative credit balance. \
                            Please go to the <a href="${plansPath}">Plan page</a> to replenish your credit balance or alter your \
                            <a href="${settingsPath}">OSS Credits consumption setting</a>`);
    } else if (allowance && !allowance.private_repos) {
      this.flashes.warning(`Builds have been temporarily disabled for private repositories due to a negative credit balance. \
                            Please go to the <a href="${plansPath}">Plan page</a> to replenish your credit balance`);
    }
  }

});
