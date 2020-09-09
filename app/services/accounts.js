import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import fetchAll from 'travis/utils/fetch-all';

const { billingEndpoint } = config;

export default Service.extend({
  store: service(),
  auth: service(),
  raven: service(),

  user: reads('auth.currentUser'),
  organizations: reads('fetchOrganizations.lastSuccessful.value'),

  subscriptions: reads('fetchSubscriptions.lastSuccessful.value'),
  v2subscriptions: reads('fetchV2Subscriptions.lastSuccessful.value'),
  subscriptionError: false,
  v2SubscriptionError: false,
  trials: reads('fetchTrials.lastSuccessful.value'),

  all: computed('user', 'organizations.@each', function () {
    let user = this.user;
    let organizations = this.organizations || [];
    return organizations.toArray().concat([user]);
  }),

  fetchOrganizations: task(function* () {
    yield fetchAll(this.store, 'organization', {});
    return this.store.peekAll('organization') || [];
  }).keepLatest(),

  fetchSubscriptions: task(function* () {
    this.set('subscriptionError', false);
    try {
      const subscriptions = yield this.store.findAll('subscription') || [];

      if (subscriptions.any(s => s.isSubscribed && !s.belongsTo('plan').id())) {
        this.logMissingPlanException();
      }

      return subscriptions.sortBy('validTo');
    } catch (e) {
      this.set('subscriptionError', true);
    }
  }),

  fetchV2Subscriptions: task(function* () {
    this.set('v2SubscriptionError', false);
    try {
      const subscriptions = yield this.store.findAll('v2_subscription') || [];

      if (subscriptions.any(s => s.isSubscribed && !s.belongsTo('plan').id())) {
        this.logMissingPlanException();
      }

      return subscriptions;
    } catch (e) {
      this.set('v2SubscriptionError', true);
    }
  }),

  fetchTrials: task(function* () {
    const trials = yield this.store.findAll('trial') || [];
    return trials.sortBy('created_at');
  }),

  init() {
    this._super(...arguments);
    this.fetchOrganizations.perform();
    if (billingEndpoint) {
      this.fetchSubscriptions.perform();
      this.fetchV2Subscriptions.perform();
      this.fetchTrials.perform();
    }
  },

  fetch() {
    return this.fetchOrganizations.perform().then(() => this.all);
  },

  logMissingPlanException() {
    const exception = new Error(`User ${this.user.login} has a subscription with no plan!`);
    this.raven.logException(exception, true);
  },
});
