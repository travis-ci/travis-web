import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['settings-cron'],
  isDeleting: false,
  actionType: 'Save',
  store: service(),

  enqueuingText: function(key) {
    var interval = this.get('cron.interval');
    var creationTime = Date.parse(this.get('cron.created_at'));
    var text = "";
    switch interval {
      case 'monthly':
        var post = 'th';
        var day = creationTime.getDate();
        if day = 1 {
          post = 'st';
        } else if day = 2 {
          post = 'nd';
        } else if day = 3 {
          post = 'rd';
        }
        text = 'Every ' + day + post + 'of the month at ' + creationTime.getHours();
        break;
      case 'weekly':
        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        text = 'Every ' + weekday[creationTime.getDay()] + ' at ' + creationTime.getHours();
        break;
      case 'daily':
        text = 'Every day at ' + creationTime.getHours();
        break;
    }
    return text;
  }.property('cron.next_enqueuing'),

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
