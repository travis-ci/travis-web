import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and } from '@ember/object/computed';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

const { billingEndpoint } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),

  activeModel: null,
  model: reads('activeModel'),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'account.subscriptionError'),

  @computed('features.enterpriseVersion')
  checkSubscriptionStatus(enterprise) {
    return !enterprise && !!billingEndpoint;
  },

});
