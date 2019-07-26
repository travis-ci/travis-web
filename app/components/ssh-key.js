import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['settings-sshkey'],

  sshKeyDeleted() {},

  delete: task(function* () {
    try {
      const key = this.key;
      key.deleteRecord();
      yield key.save();
    } catch (e) {}

    this.sshKeyDeleted();
  }).drop()
});
