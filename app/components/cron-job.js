import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['settings-cron'],
  isDeleting: false,
  actionType: 'Save',
  store: service(),

  intervalText: function() {
    function timeOfDay(creationTime) {
      var hours = creationTime.getHours();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours !== 0 ? hours : 12;
      return hours + ' ' + ampm;
    }

    function dayOfWeek(creationTime) {
      var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      return weekday[creationTime.getDay()];
    }

    function dayOfMonth(creationTime) {
      var post = 'th';
      var day = creationTime.getDate();
      if ( day === 1 ){
        post = 'st';
      } else if ( day === 2 ){
        post = 'nd';
      } else if ( day === 3 ){
        post = 'rd';
      }
      return day + post;
    }

    var interval = this.get('cron.interval');
    var creationTime = new Date(this.get('cron.created_at'));
    var text = "";
    var time = timeOfDay(creationTime);

    switch (interval) {
      case 'monthly':
        text = 'Enqueuing every ' + dayOfMonth(creationTime) + ' of the month after ' + time;
        break;
      case 'weekly':
        text = 'Enqueuing every ' + dayOfWeek(creationTime) + ' after ' + time;
        break;
      case 'daily':
        text = 'Enqueuing every day after ' + time;
        break;
    }
    return text;
  }.property('cron.created_at'),


  disableByBuild: function(key) {
    var value = '';
    if (this.get('cron.disable_by_build')) {
      value = 'Only ';
    } else {
      value = 'Even ';
    }
    return value + 'if no new commit after last cron build';
  }.property('cron.disable_by_build'),

  actions: {
    "delete": function() {
      if (this.get('isDeleting')) {
        return;
      }
      this.set('isDeleting', true);

      return this.get('cron').destroyRecord().then(() => {
        this.set('isDeleting', false);
      });
    }
  }
});
