import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Model.extend({
  accounts: service(),
  raven: service(),

  name: attr('string'),
  login: attr('string'),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr('string'),
  githubId: attr('string'),
  education: attr('boolean'),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  installation: belongsTo('installation', { async: false }),

  subscriptionError: bool('accounts.subscriptionError'),

  @computed('accounts.subscriptions.@each.{validTo,owner,isSubscribed}', 'login')
  subscription(subscriptions = [], login) {
    const accountSubscriptions = subscriptions.filterBy('owner.login', login) || [];
    const activeAccountSubscriptions = accountSubscriptions.filterBy('isSubscribed') || [];
    if (activeAccountSubscriptions.length > 1) this.logMultipleSubscriptionsError();
    return activeAccountSubscriptions.get('firstObject') || accountSubscriptions.get('lastObject');
  },

  @computed('accounts.trials.@each.{created_at,owner,hasTrial}', 'login')
  trial(trials = [], login) {
    const accountTrials = trials.filterBy('owner.login', login) || [];
    const activeAccountTrials = accountTrials.filterBy('hasTrial') || [];
    return activeAccountTrials.get('firstObject') || accountTrials.get('lastObject');
  },

  @computed('subscription', 'subscription.permissions.write', 'subscriptionPermissions.create')
  hasSubscriptionPermissions(subscription, writePermissions, createPermissions) {
    return subscription ? writePermissions : createPermissions;
  },

  @computed('type', 'login')
  billingUrl(type, login) {
    let id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('isUser', 'login')
  newSubscriptionUrl(isUser, login) {
    let id = isUser ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/new?id=${id}`;
  },

  logMultipleSubscriptionsError() {
    const exception = new Error(`Account ${this.login} has more than one active subscription!`);
    this.raven.logException(exception, true);
  }
});
