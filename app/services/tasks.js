import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

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
      this.store.pushPayload('beta-migration-request', data);
    }

    return this.store.peekAll('beta-migration-request');
  }).drop()

});
