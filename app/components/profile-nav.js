import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and, alias } from '@ember/object/computed';
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

  isOrganization: alias('model.isOrganization'),
  hasAdminPermissions: alias('model.permissions.admin'),
  isOrganizationAdmin: and('isOrganization', 'hasAdminPermissions'),
  isProVersion: alias('features.proVersion'),
  showOrganizationSettings: and('isOrganizationAdmin', 'isProVersion'),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    let enterprise = this.get('features.enterpriseVersion');
    return !enterprise && !!billingEndpoint;
  }),

});
