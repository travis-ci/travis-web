import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Mixin.create({

  fetchBetaMigrationRequests() {
    return this.fetchBetaMigrationRequestsTask.perform();
  },

  fetchBetaMigrationRequestsTask: task(function* () {
    const data = yield this.ajax.getV3(`/user/${this.accounts.user.id}/beta_migration_requests`);
    this.store.pushPayload('beta-migration-request', data);
    return this.store.peekAll('beta-migration-request');
  }).drop(),

  migrationBetaRequests: computed('fetchBetaMigrationRequestsTask.lastSuccessful.value', 'id', function () {
    const requests = this.fetchBetaMigrationRequestsTask.get('lastSuccessful.value') || [];
    return requests.filter(request =>
      this.isUser && request.ownerId == this.id || request.organizations.mapBy('id').includes(this.id)
    );
  }),

  isMigrationBetaRequested: notEmpty('migrationBetaRequests'),

  isMigrationBetaAccepted: computed('migrationBetaRequests.@each.acceptedAt', function () {
    const migrationBetaRequests = this.migrationBetaRequests || [];
    return migrationBetaRequests.isAny('acceptedAt');
  }),

});
