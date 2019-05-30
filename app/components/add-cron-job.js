import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { mapBy } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Component.extend({
  store: service(),

  classNames: ['form--cron'],

  intervals: ['Monthly', 'Weekly', 'Daily'],

  options: [{
    name: 'Always run',
    value: false
  }, {
    name: 'Do not run if there has been a build in the last 24h',
    value: true
  }],

  currentCronJobsBranches: mapBy('repository.cronJobs', 'branch.name'),

  init() {
    this.reset();
    this._super(...arguments);
  },

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: this.intervals.firstObject,
      selectedOption: this.options[0]
    });
  },

  search: task(function* (query) {
    yield timeout(config.intervals.searchDebounceRate);
    let branchNames = this.get('currentCronJobsBranches');
    let branches = yield this.store.query('branch', {
      repository_id: this.repository.id,
      data: {
        name: query,
        sort_by: 'name',
        limit: 10,
        exists_on_github: true
      }
    });
    return branches.reject(branch => (branchNames.includes(branch.name)));
  }).restartable(),

  save: task(function* () {
    const cron = this.store.createRecord('cron', {
      branch: this.selectedBranch,
      interval: this.selectedInterval.toLowerCase(),
      dont_run_if_recent_build_exists: this.selectedOption.value
    });
    try {
      yield cron.save();
      this.reset();
    } catch (error) {
      cron.unloadRecord();
      this.flashes.error('There was an error saving the cron task. Please try again.');
    }
  }).drop()
});
