import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';

export default Component.extend({
  classNames: ['form--envvar'],

  store: service(),
  raven: service(),
  flashes: service(),

  reset() {
    return this.setProperties({
      name: null,
      value: null,
      'public': null,
      branch: null
    });
  },

  search: task(function* (query) {
    yield timeout(config.intervals.searchDebounceRate);
    let branches = yield this.store.query('branch', {
      repository_id: this.repo.id,
      data: {
        name: query,
        sort_by: 'name',
        limit: 10,
        exists_on_github: true
      }
    });
    return branches;
  }).restartable(),

  save: task(function* () {
    const envVar = this.get('store').createRecord('env_var', {
      name: this.name.trim(),
      value: this.value.trim(),
      'public': this.public,
      repo: this.repo,
      branch: this.branch ? this.branch.name : null
    });

    try {
      yield envVar.save().then(saved => saved.set('newlyCreated', true));
      this.reset();
    } catch (e) {
      // eslint-disable-next-line
      this.get('flashes').error('There was an error saving this environment variable.');
      this.get('raven').logException(e);
    }
  }).drop()
});
