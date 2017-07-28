import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['jobs'],
  classNameBindings: ['stage:stage'],

  @computed('required')
  jobTableId(required) {
    if (required) {
      return 'jobs';
    }
    return 'allowed_failure_jobs';
  },

  @computed('jobs.[]', 'build.jobs.[]', 'stage')
  filteredJobs(jobs, buildJobs, stage) {
    if (stage) {
      return buildJobs.filterBy('stage.id', stage.get('id'));
    }
    return jobs;
  },

  @alias('stage.state') stageState: null,

  @computed('stageState')
  stageStateIcon(stageState) {
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
  },

  @computed('stageState')
  stageStateTitle(stageState) {
    return `Stage ${stageState}`;
  },

  @computed('stage', 'stageIsLast', 'filteredJobs.@each.{state,allowFailure}')
  stageAllowFailuresText(stage, stageIsLast, filteredJobs) {
    if (stageIsLast || !stage) {
      return false;
    }

    const jobsAllowedToFail = filteredJobs.filterBy('allowFailure');
    const relevantJobs = jobsAllowedToFail.filterBy('isFinished').rejectBy('state', 'passed');

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
          `and ${Ember.get(lastJob, ('number'))}`;
      }
      return 'Your build matrix was set to allow the failure of ' +
              `${jobList} so we continued this build to the next stage.`;
    }
    return false;
  },

  @computed('stages', 'stage')
  stageIsLast(stages, stage) {
    return stage && stages && stages.indexOf(stage) == stages.length - 1;
  },
});
