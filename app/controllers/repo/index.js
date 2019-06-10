import Controller from '@ember/controller';
import { or, not } from '@ember/object/computed';

export default Controller.extend({

  repo: null,

  isNotMigratable: not('repo.isMigratable'),
  isMigrateButtonDisabled: or('isMigrationInProgress', 'isNotMigratable'),

  actions: {

    migrate() {
      this.repo.startMigration();
    }

  }

});
