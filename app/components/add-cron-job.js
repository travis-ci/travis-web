import Ember from 'ember';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['form--cron'],
  store: service(),

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: null,
      disable: null
    });
  },

  save: task(function * () {
    const store = this.get('store');
    const repoId = this.get('branches.firstObject.repoId');
    const branch = this.get('selectedBranch') ? this.get('selectedBranch') : this.get('branches.firstObject');

    const existingCrons = yield store.filter('cron', {repository_id: repoId}, (c) => {
      return c.get('branch.repoId') === repoId && c.get('branch.name') === branch.get('name');
    });

    if (existingCrons.get('firstObject')) {
      store.unloadRecord(existingCrons.get('firstObject'));
    }

    const cron = store.createRecord('cron', {
      branch: branch,
      interval: this.get('selectedInterval') || 'monthly',
      disable_by_build: this.get('selectedOption') || false
    });

    this.reset();

    yield cron.save();
  }),

  intervals: ['monthly', 'weekly', 'daily'],

  options: ['Always run', 'Only run if no new commits']
});
