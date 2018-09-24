import Service from '@ember/service';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Service.extend({
  @service store: null,
  @service auth: null,

  @reads('auth.currentUser')
  user: null,

  @reads('fetchOrganizations.lastSuccessful.value')
  organizations: null,

  @computed('user', 'organizations.@each')
  all(user, organizations = []) {
    return organizations.unshift(user);
  },

  fetchOrganizations: task(function* () {
    // limit of 100 orgs seems to be enough for all users, so no need to `fetchAll`
    return yield this.store.findAll('organization') || [];
  }).keepLatest(),

  init() {
    this.fetchOrganizations.perform();
  },

  fetch() {
    return this.fetchOrganizations.perform().then(() => this.all);
  }
});
