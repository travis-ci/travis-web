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
  }),

  stageAllowFailuresText: Ember.computed('filteredJobs.@each.state', 'filteredJobs.@each.allowFailure', 'stageIsLast', function () {
    if (this.get('stageIsLast')) {
      return false;
    } else {
      const jobsAllowedToFail = this.get('filteredJobs').filterBy('allowFailure');
      const allowedToFailAndFinishedAndNotPassed = jobsAllowedToFail.filterBy('isFinished').rejectBy('state', 'passed');

      if (allowedToFailAndFinishedAndNotPassed.length > 0) {
        let jobList;

        if (allowedToFailAndFinishedAndNotPassed.length == 1) {
          jobList = `job ${allowedToFailAndFinishedAndNotPassed.mapBy('number')[0]}`;
        } else if (allowedToFailAndFinishedAndNotPassed.length == 2) {
          jobList = `jobs ${allowedToFailAndFinishedAndNotPassed.mapBy('number').join(' and ')}`;
        } else {
          const firstJobs = allowedToFailAndFinishedAndNotPassed.slice(0, allowedToFailAndFinishedAndNotPassed.length - 1);
          const lastJob = allowedToFailAndFinishedAndNotPassed[allowedToFailAndFinishedAndNotPassed.length - 1];
          jobList = `jobs ${firstJobs.mapBy('number').join(', ')}, and ${Ember.get(lastJob, ('number'))}`;
        }
        return 'Your build matrix was set to allow the failure of ' +
               `${jobList} so we continued this build to the next stage.`;
      } else {
        return false;
      }
    }
  }),

  stageIsLast: Ember.computed('stages', 'stage', function () {
    const stages = this.get('stages');
    const stage = this.get('stage');

    return stage && stages && stages.indexOf(stage) == stages.length - 1;
  })
});
