import Controller from '@ember/controller';
import { or, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({

  auth: service(),

  repo: null,

  isNotMigratable: not('repo.isMigratable'),
  isMigrateButtonDisabled: or('isMigrationInProgress', 'isNotMigratable'),

  actions: {

    migrate() {
      // TODO use actual migration in release version
      this.repo.set('migrationStatus', 'queued');
      // this.repo.startMigration();
    }

  }

});
