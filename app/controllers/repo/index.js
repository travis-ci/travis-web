import Controller from '@ember/controller';
import { reads, and, or, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({

  auth: service(),

  repo: null,

  permissions: reads('repo.permissions'),

  isMigrationAllowed: and('permissions.migrate', 'repo.isMigratable'),
  isMigrationNotAllowed: not('isMigrationAllowed'),

  isMigrateButtonDisabled: or('repo.isMigrationInProgress', 'isMigrationNotAllowed'),

  actions: {

    migrate() {
      this.repo.set('migrationStatus', 'queued');
      this.repo.startMigration();
    }

  }

});
