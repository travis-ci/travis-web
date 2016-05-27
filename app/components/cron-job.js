import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['settings-cron'],
  isDeleting: false,
  actionType: 'Save',
  store: service(),

  isOverdue: function(key) {
    var time = this.get('cron.next_enqueuing');
    if (time + 1 > Date.now()){
      return true
    }
    return false
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
