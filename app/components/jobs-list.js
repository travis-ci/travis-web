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
    if (!window.lists) {
      window.lists = [];
    }
    window.lists.push(this);
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

  // FIXME lol almost the same as above
  stageStateTitle: Ember.computed('stageState', function () {
    const stageState = this.get('stageState');

    const title = {
      'passed': 'passed',
      'failed': 'failed',
      'errored': 'errored',
      'canceled': 'canceled'
    }[stageState];

    if (title) {
      return `Stage ${title}`;
    } else {
      return undefined;
    }
  })
});
