import Component from '@ember/component';

export default Component.extend({
  classNames: ['repository-migration-modal'],

  actions: {

    startMigration() {
      this.repositories.forEach(repo => repo.startMigration());
      return this.onClose();
    }

  }

});
