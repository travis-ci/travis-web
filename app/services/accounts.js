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
  subscriptionError: false,
  trials: reads('fetchTrials.lastSuccessful.value'),

  all: computed('user', 'organizations.@each', function () {
    let user = this.get('user');
    let organizations = this.get('organizations') || [];
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

  fetchTrials: task(function* () {
    const trials = yield this.store.findAll('trial') || [];
    return trials.sortBy('created_at');
  }),

  init() {
    this.fetchOrganizations.perform();
    if (billingEndpoint) {
      this.fetchSubscriptions.perform();
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
