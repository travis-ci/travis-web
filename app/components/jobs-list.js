import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['jobs'],
  classNameBindings: ['stage:stage'],

  jobTableId: Ember.computed(function () {
    if (this.get('required')) {
      return 'jobs';
    } else {
      return 'allowed_failure_jobs';
    }
  }),

  jobsProxyLol: Ember.computed('build.jobs', 'jobs', function () {
    const stage = this.get('stage');

    if (stage) {
      // FIXME this or something like it will actually filter
      // return this.get('build.jobs').filterBy('stage.number', stage.get('number'));
      return this.get('build.jobs');
    } else {
      return this.get('jobs');
    }
  })
});
