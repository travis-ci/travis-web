import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['form--envvar'],

  store: service(),
  raven: service(),
  flashes: service(),

  reset() {
    return this.setProperties({
      name: null,
      value: null,
      'public': null
    });
  },

  save: task(function* () {
    const envVar = this.store.createRecord('env_var', {
      name: this.name.trim(),
      value: this.value.trim(),
      'public': this.public,
      repo: this.repo
    });

    try {
      yield envVar.save().then(saved => saved.set('newlyCreated', true));
      this.reset();
    } catch (e) {
      // eslint-disable-next-line
      this.flashes.error('There was an error saving this environment variable.');
      this.raven.logException(e);
    }
  }).drop()
});
