import Component from '@ember/component';
import { action } from 'ember-decorators/object';

export default Component.extend({
  classNames: ['repository-migration-modal'],

  @action
  startMigration() {
    this.get('repository').startMigration();
    return this.get('onClose')();
  },
});
