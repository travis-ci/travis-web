import Service from '@ember/service';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads, bool } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import fetchAll from 'travis/utils/fetch-all';

const { billingEndpoint } = config;

export default Service.extend({
  @service store: null,
  @service auth: null,

  user: reads('auth.currentUser'),
  organizations: reads('fetchOrganizations.lastSuccessful.value'),

  subscriptions: reads('fetchSubscriptions.lastSuccessful.value'),
  subscriptionError: false,
  trials: reads('fetchTrials.lastSuccessful.value'),

  @computed('user', 'organizations.@each')
  all(user, organizations = []) {
    return organizations.toArray().concat([user]);
  },

  fetchOrganizations: task(function* () {
    yield fetchAll(this.store, 'organization', {});
    const organizations = this.store.peekAll('organization') || [];
    return organizations;
  }).keepLatest(),

  fetchSubscriptions: task(function* () {
    this.set('subscriptionError', false);
    try {
      const subscriptions = yield this.store.findAll('subscription') || [];
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
  }

});
