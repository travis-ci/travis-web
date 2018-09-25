import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Model.extend({
  name: attr('string'),
  login: attr('string'),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr('string'),
  githubId: attr('string'),
  education: attr('boolean'),

  // These are inserted artificially by routes:accounts
  subscription: attr(),
  subscriptionError: attr('boolean'),
  trial: attr(),

  installation: belongsTo('installation', { async: false }),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  @computed('subscription', 'subscription.permissions.write', 'subscriptionPermissions.create')
  hasSubscriptionPermissions(subscription, writePermissions, createPermissions) {
    return subscription ? writePermissions : createPermissions;
  },

  @computed('isUser', 'login')
  billingUrl(isUser, login) {
    let id = isUser ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('isUser', 'login')
  newSubscriptionUrl(isUser, login) {
    let id = isUser ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/new?id=${id}`;
  }
});
