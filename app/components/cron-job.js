import Ember from 'ember';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['settings-cron'],
  isDeleting: false,
  actionType: 'Save',
  store: service(),

  intervalText: Ember.computed('cron.created_at', function () {
    function timeOfDay(creationTime) {
      let hours = creationTime.getHours();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours !== 0 ? hours : 12;
      return `${hours} ${ampm}`;
    }

    function dayOfWeek(creationTime) {
      let weekday = new Array(7);
      weekday[0] = 'Sunday';
      weekday[1] = 'Monday';
      weekday[2] = 'Tuesday';
      weekday[3] = 'Wednesday';
      weekday[4] = 'Thursday';
      weekday[5] = 'Friday';
      weekday[6] = 'Saturday';
      return weekday[creationTime.getDay()];
    }

    function dayOfMonth(creationTime) {
      let post = 'th';
      let day = creationTime.getDate();
      if (day === 1) {
        post = 'st';
      } else if (day === 2) {
        post = 'nd';
      } else if (day === 3) {
        post = 'rd';
      }
      return day + post;
    }

    let interval = this.get('cron.interval');
    let creationTime = new Date(this.get('cron.created_at'));
    let text = '';
    let time = timeOfDay(creationTime);

    switch (interval) {
      case 'monthly':
        text = `Enqueues the ${dayOfMonth(creationTime)} of every month after ${time}`;
        break;
      case 'weekly':
        text = `Enqueues each ${dayOfWeek(creationTime)} after ${time}`;
        break;
      case 'daily':
        text = `Enqueues each day after ${time}`;
        break;
    }
    return text;
  }),


  disableByBuild: Ember.computed('cron.disable_by_build', function () {
    if (this.get('cron.disable_by_build')) {
      return 'Only if no new commit';
    } else {
      return 'Always run';
    }
  }),

  delete: task(function* () {
    yield this.get('cron').destroyRecord();
  })
});
