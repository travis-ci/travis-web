import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
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
    const branchNames = this.currentCronJobsBranches;
    const searchResults = yield this.searchBranch.perform(this.repository.id, query, branchNames);
    return searchResults;
  }),

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
