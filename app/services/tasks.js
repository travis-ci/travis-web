import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { pushPayload } from 'travis/serializers/beta-migration-request'

/**
 * Service for shared Ember Concurrency tasks.
 *
 * The task may be shared if it's result may be used by many different entities or instances.
 */
export default Service.extend({
  store: service(),
  api: service(),
  accounts: service(),
  raven: service(),

  fetchBetaMigrationRequestsTask: task(function* () {
    const data = yield this.api.get(`/user/${this.accounts.user.id}/beta_migration_requests`, {
      travisApiVersion: null,
    }).catch(error => {
      if (error.status !== 404) {
        this.raven.logException(error);
      }
    });

    if (data) {
      const modelClass = this.store.modelFor('beta-migration-request');
      const serializer = this.store.serializerFor('application')
      const json = serializer.normalizeArrayResponse(this.store, modelClass, data);
      this.store.push(json);
    }

    return this.store.peekAll('beta-migration-request');
  }).drop(),

  fetchRepoOwnerAllowance: task(function* (repo) {
    const allowance = this.store.peekRecord('allowance', repo.id);
    if (allowance)
      return allowance;
    return yield this.store.smartQueryRecord('allowance', { login: repo.owner.login, provider: repo.provider || 'github' });
  }).drop(),

  fetchMessages: task(function* (request) {
    const repoId = request.get('repo.id');
    const requestId = request.get('build.request.id');
    if (repoId && requestId) {
      const response = yield request.api.get(`/repo/${repoId}/request/${requestId}/messages`) || {};
      return response.messages;
    }
  }).drop()
});
