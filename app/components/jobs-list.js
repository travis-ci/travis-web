import Ember from 'ember';
import jobsListState from 'travis/utils/jobs-list-state';

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
      return this.get('build.jobs').filterBy('stage.id', stage.get('id'));
    } else {
      return this.get('jobs');
    }
  }),

  jobDurations: Ember.computed.mapBy('jobsProxyLol', 'duration'),
  duration: Ember.computed.sum('jobDurations'),

  // FIXME it seems unfortunate to have to know the dependent keys here… 🤔
  stageState: Ember.computed('jobsProxyLol.@each.state', 'jobsProxyLol.@each.isRunning', function () {
    return jobsListState(this.get('jobsProxyLol'));
  }),

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
  })
});
