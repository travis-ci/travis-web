import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['jobs'],
  jobTableId: Ember.computed(function() {
    if (this.get('required')) {
      return 'jobs';
    } else {
      return 'allowed_failure_jobs';
    }
  })
});
