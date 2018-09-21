import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  @service store: null,

  classNames: ['form--cron'],

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: null,
      disable: null
    });
  },

  actions: {
    intervalSelected(interval) {
      if (interval.includes('daily')) {
        this.set('formInterval', 'daily');
      } else if (interval.includes('weekly')) {
        this.set('formInterval', 'weekly');
      } else if (interval.includes('monthly')) {
        this.set('formInterval', 'monthly');
      }
    },
  },

  save: task(function* () {
    const store = this.get('store');
    const repoId = this.get('branches.firstObject.repoId');
    const branch = this.get('selectedBranch') || this.get('branches.firstObject');

    const existingCrons = yield store.filter('cron', { repository_id: repoId }, (c) => {
      c.get('branch.repoId') === repoId && c.get('branch.name') === branch.get('name');
    });

    if (existingCrons.get('firstObject')) {
      store.unloadRecord(existingCrons.get('firstObject'));
    }

    const cron = store.createRecord('cron', {
      branch,
      interval: this.get('selectedInterval') || 'monthly',
      dont_run_if_recent_build_exists: this.get('selectedOption') || false
    });

    this.reset();

    yield cron.save();
  }).drop(),

  intervals: ['monthly', 'weekly', 'daily (weekdays)', 'daily (every day)' ],

  daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  // Need to warn users that not every month has those days. If you select 30,
  // it will not run in Feburary
  calendarDaysOfMonth: [...Array(31).keys()].map(d => d + 1),

  options: ['Always run', 'Do not run if there has been a build in the last 24h']
});
