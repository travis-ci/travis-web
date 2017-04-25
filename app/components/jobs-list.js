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

  filteredJobs: Ember.computed('build.jobs', 'jobs', function () {
    const stage = this.get('stage');

    if (stage) {
      return this.get('build.jobs').filterBy('stage.id', stage.get('id'));
    } else {
      return this.get('jobs');
    }
  }),

  stageState: Ember.computed.alias('stage.state'),
  stageStateIcon: Ember.computed('stageState', function () {
    const stageState = this.get('stageState');

    const icon = {
      'passed': 'passed',
      'failed': 'failed',
      'errored': 'errored',
      'canceled': 'canceled'
    }[stageState];

    if (icon) {
      return `stage-${icon}`;
    } else {
      return undefined;
    }
  }),

  stageStateTitle: Ember.computed('stageState', function () {
    const stageState = this.get('stageState');
    return `Stage ${stageState}`;
  })
});
