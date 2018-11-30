import { get, computed } from '@ember/object';
import Component from '@ember/component';
import { alias, mapBy } from '@ember/object/computed';

export default Component.extend({
  tagName: 'section',
  classNames: ['jobs'],
  classNameBindings: ['stage:stage'],

  jobTableId: computed('required', function () {
    let required = this.get('required');
    if (required) {
      return 'jobs';
    }
    return 'allowed_failure_jobs';
  }),

  buildJobs: alias('build.jobs'),
  jobStages: mapBy('buildJobs', 'stage'),

  filteredJobs: computed('jobs.[]', 'build.jobs.[]', 'stage', 'jobStages.@each.id', function () {
    let jobs = this.get('jobs');
    let buildJobs = this.get('buildJobs');
    let stage = this.get('stage');

    if (stage) {
      // FIXME why is this needed? Without it, the stage ids are undefined.
      // eslint-disable-next-line
      let jobStageIds = this.get('jobStages').mapBy('id');
      return buildJobs.filterBy('stage.id', stage.get('id'));
    }
    return jobs;
  }),

  stageState: alias('stage.state'),

  stageStateIcon: computed('stageState', function () {
    let stageState = this.get('stageState');
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

  stageStateTitle: computed('stageState', function () {
    return `Stage ${this.get('stageState')}`;
  }),

  stageAllowFailuresText: computed(
    'stage',
    'stageIsLast',
    'filteredJobs.@each.{state,allowFailure}',
    function () {
      let stage = this.get('stage');
      let stageIsLast = this.get('stageIsLast');
      let filteredJobs = this.get('filteredJobs');
      if (!stage) {
        return false;
      }

      const jobsAllowedToFail = filteredJobs.filterBy('allowFailure');
      const relevantJobs = jobsAllowedToFail.filterBy('isFinished').rejectBy('state', 'passed');

      const failedJobsNotAllowedToFail = this.get('filteredJobs').rejectBy('allowFailure')
        .filterBy('isFinished').rejectBy('state', 'passed');

      if (relevantJobs.length > 0) {
        let jobList;

        if (relevantJobs.length == 1) {
          jobList = `job ${relevantJobs.mapBy('number')[0]}`;
        } else if (relevantJobs.length == 2) {
          jobList = `jobs ${relevantJobs.mapBy('number').join(' and ')}`;
        } else if (relevantJobs.length > 5) {
          jobList = 'multiple jobs';
        } else {
          const firstJobs = relevantJobs.slice(0, relevantJobs.length - 1);
          const lastJob = relevantJobs[relevantJobs.length - 1];
          jobList = `jobs ${firstJobs.mapBy('number').join(', ')}, ` +
            `and ${get(lastJob, ('number'))}`;
        }

        let continuationText = '';

        if (!stageIsLast && failedJobsNotAllowedToFail.length === 0) {
          continuationText = ' so we continued this build to the next stage';
        }

        return 'Your build matrix was set to allow the failure of ' +
                `${jobList}${continuationText}.`;
      }
      return false;
    }
  ),

  stageIsLast: computed('stages', 'stage', function () {
    let stages = this.get('stages');
    let stage = this.get('stage');
    return stage && stages && stages.indexOf(stage) == stages.length - 1;
  }),
});
