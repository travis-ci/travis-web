import Component from '@ember/component';

export default Component.extend({
  classNames: ['repository-migration-modal'],

  actions: {
    startMigration() {
      this.get('repository').startMigration();
      return this.get('onClose')();
    },
  },
});
