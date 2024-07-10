import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  store: service(),
  flashes: service(),

  classNames: ['form--cron'],

  intervals: ['Monthly', 'Weekly', 'Daily'],

  options: [{
    name: 'Always run',
    value: false
  }, {
    name: 'Do not run if there has been a build in the last 24h',
    value: true
  }],

  init() {
    this.reset();
    this.loadCurrentCronJobs();
    this._super(...arguments);
  },

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: this.intervals.firstObject,
      selectedOption: this.options[0],
      currentCronJobs: [],
      errorMessage: null
    });
  },

  loadCurrentCronJobs() {
    this.store.query('cron', { repository_id: this.repository.id }).then(crons => {
      this.set('currentCronJobs', crons.toArray());
    });
  },

  search: task(function* (query) {
    const searchResults = yield this.searchBranch.perform(this.repository.id, query);
    return searchResults;
  }),

  save: task(function* () {
    const selectedBranchName = this.selectedBranch?.name;
    const existingCronJob = this.currentCronJobs
      .find(cron => cron.branch?.name === selectedBranchName);

    if (existingCronJob) {
      this.set('errorMessage',
        'You can create only one cron job per branch. If you want to create a new Cron Job for this branch please delete the existing one.');
      return;
    }

    const cron = this.store.createRecord('cron', {
      branch: this.selectedBranch,
      interval: this.selectedInterval.toLowerCase(),
      dont_run_if_recent_build_exists: this.selectedOption.value
    });
    try {
      yield cron.save();
      this.reset();
      this.loadCurrentCronJobs();
    } catch (error) {
      console.log(error);
      cron.unloadRecord();
      this.flashes.error('There was an error saving the cron task. Please try again.');
    }
  }).drop()
});
