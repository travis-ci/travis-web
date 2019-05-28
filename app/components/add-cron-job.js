import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { mapBy } from '@ember/object/computed';
import Branch from 'travis/models/branch';
import config from 'travis/config/environment';

export default Component.extend({
  store: service(),

  classNames: ['form--cron'],

  intervals: ['monthly', 'weekly', 'daily'],

  options: ['Always run', 'Do not run if there has been a build in the last 24h'],

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

  performSearchRequest: task(function* (query) {
    yield timeout(config.intervals.searchDebounceRate);
    let branchNames = this.get('currentCronJobsBranches');
    let branches = yield Branch.search(this.store, query, this.repository.id);
    return branches.reject(branch => (branchNames.indexOf(branch.name) > -1));
  }).restartable(),

  saveCron: task(function* () {
    const cron = this.store.createRecord('cron', {
      branch: this.selectedBranch,
      interval: this.selectedInterval,
      dont_run_if_recent_build_exists: this.selectedOption
    });
    yield cron.save();
    this.reset();
  }).drop()
});
