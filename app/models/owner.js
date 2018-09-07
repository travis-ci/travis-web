import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Model.extend({
  name: attr(),
  login: attr(),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr(),
  githubId: attr(),
  education: attr('boolean'),

  // These are inserted artificially by routes:accounts
  subscription: attr(),
  subscriptionError: attr('boolean'),
  trial: attr(),

  installation: belongsTo({async: false}),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  // This is set by serializers:trial
  trialPermissions: attr(),

  @computed('subscription', 'subscription.permissions.write', 'subscriptionPermissions.create')
  hasSubscriptionPermissions(subscription, writePermissions, createPermissions) {
    if (subscription) {
      return writePermissions;
    } else {
      return createPermissions;
    }
  },

  @computed('trial', 'trial.permissions.write', 'trialPermissions.create')
  hasCreateSubscriptionPermissions(trial, writePermissions, createPermissions) {
    if (trial) {
      return writePermissions;
    } else {
      return createPermissions;
    }
  },

  @computed('type', 'login')
  billingUrl(type, login) {
    let id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('type', 'login')
  newSubscriptionUrl(type, login) {
    let id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/new?id=${id}`;
  }
});
