import Service from '@ember/service';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads, bool } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

const { billingEndpoint } = config;

export default Service.extend({
  @service store: null,
  @service auth: null,

  user: reads('auth.currentUser'),
  organizations: reads('fetchOrganizations.lastSuccessful.value'),

  subscriptions: reads('fetchSubscriptions.lastSuccessful.value'),
  subscriptionError: bool('fetchSubscriptions.last.error'),
  trials: reads('fetchTrials.lastSuccessful.value'),

  @computed('user', 'organizations.@each')
  all(user, organizations = []) {
    return organizations.unshift(user);
  },

  fetchOrganizations: task(function* () {
    // limit of 100 orgs seems to be enough for all users, so no need to `fetchAll`
    return yield this.store.findAll('organization') || [];
  }).keepLatest(),

  fetchSubscriptions: task(function* () {
    const subscriptions = yield this.store.findAll('subscription') || [];
    return subscriptions.sortBy('validTo');
  }),

  fetchTrials: task(function* () {
    const trials = yield this.store.findAll('trial') || [];
    return trials.sortBy('created_at');
  }),

  init() {
    this.fetchOrganizations.perform();
    if (billingEndpoint) {
      this.fetchSubscriptions.perform();
      this.fetchTrial.perform();
    }
  },

  fetch() {
    return this.fetchOrganizations.perform().then(() => this.all);
  }

});
