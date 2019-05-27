import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { mapBy } from '@ember/object/computed';
import config from 'travis/config/environment';

const { branchSearchDebounceRate } = config.intervals;

export default Component.extend({
  classNames: ['form--cron'],

  store: service(),
  flashes: service(),

  repository: null,

  intervals: ['Monthly', 'Weekly', 'Daily'],

  options: [
    {
      title: 'Always run',
      value: false
    },
    {
      title: 'Do not run if there has been a build in the last 24h',
      value: true
    }
  ],

  existingBranchNames: mapBy('repository.cronJobs', 'branch.name'),

  init() {
    this.reset();
    this._super(...arguments);
  },

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: null,
      selectedOption: this.options.firstObject
    });
  },

  searchBranches: task(function* (query) {
    yield timeout(branchSearchDebounceRate);
    const foundBranches = yield this.store.query('branch', {
      repository_id: this.repository.id,
      name: name,
      exists_on_github: true
    });
    return foundBranches.sortBy('name');
  }).restartable(),

  saveCron: task(function* () {
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
  }).drop(),

  actions: {

    validateBranch(branch) {
      const isValid = !this.existingBranchNames.includes(branch.name);
      return isValid || 'This branch is in use by another Cron Job';
    }

  }
});
