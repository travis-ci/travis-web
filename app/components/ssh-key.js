import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['settings-sshkey'],

  delete: task(function* () {
    try {
      const key = this.get('key');
      key.deleteRecord();
      yield key.save();
    } catch (e) {}

    this.sendAction('sshKeyDeleted');
  }).drop()
});
