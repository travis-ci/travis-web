import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
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
