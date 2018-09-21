import Component from '@ember/component';

export default Component.extend({
  // defaults to this as it is the first option in the form
  formInterval: 'monthly',

  intervals: ['monthly', 'weekly', 'daily (weekdays)', 'daily (every day)' ],

  daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  // Need to warn users that not every month has those days. If you select 30,
  // it will not run in Feburary
  calendarDaysOfMonth: [...Array(31).keys()].map(d => d + 1),

  options: ['Always run', 'Do not run if there has been a build in the last 24h'],

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
});
